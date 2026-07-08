const { supabase } = require('./supabase');

const SEARCH_COLUMNS = new Set(['title', 'author', 'content']);

function formatDate(value) {
  if (!value) return value;

  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(value));
}

function formatBoard(row) {
  const votes1 = Number(row.votes1 || 0);
  const votes2 = Number(row.votes2 || 0);
  const totalVotes = votes1 + votes2;
  const ratio1 = totalVotes === 0 ? 5 : Math.round((votes1 / totalVotes) * 10);

  return {
    ...row,
    match_score: `${ratio1}:${10 - ratio1}`,
    total_votes: totalVotes,
    created_at: formatDate(row.created_at),
    updated_at: formatDate(row.updated_at),
    vote_deadline: formatDate(row.vote_deadline),
  };
}

function formatComment(row) {
  return {
    ...row,
    created_at: formatDate(row.created_at),
    updated_at: formatDate(row.updated_at),
  };
}

function send(res, status, body) {
  return res.status(status).json(body);
}

function getPath(req, explicitPath) {
  if (explicitPath) return explicitPath.filter(Boolean);
  const raw = req.query.path;
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') return raw.split('/').filter(Boolean);

  const pathname = new URL(req.url, 'http://localhost').pathname;
  return pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
}

function messageFromError(error, fallback) {
  const text = error?.message || '';
  if (text.includes('INVALID_COMMENT_PASSWORD')) return '비밀번호가 일치하지 않습니다.';
  if (text.includes('VOTE_DISABLED')) return '이 게시글은 투표를 사용하지 않습니다.';
  if (text.includes('VOTE_CLOSED')) return '투표가 마감되었습니다.';
  if (text.includes('INVALID_CHOICE')) return '1번 또는 2번 중 하나를 선택해주세요.';
  if (text.includes('BOARD_NOT_FOUND')) return '게시글을 찾을 수 없습니다.';
  return fallback;
}

async function addBoardNumber(board) {
  const { count } = await supabase
    .from('mdae_boards')
    .select('*', { count: 'exact', head: true })
    .lte('id', board.id);

  return { ...formatBoard(board), board_no: count || 0 };
}

async function listBoards(req, res) {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
  const offset = (page - 1) * limit;
  const searchType = SEARCH_COLUMNS.has(req.query.searchType) ? req.query.searchType : 'title';
  const keyword = String(req.query.keyword || '').trim();

  let query = supabase
    .from('mdae_boards')
    .select('*', { count: 'exact' })
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  if (keyword) query = query.ilike(searchType, `%${keyword}%`);

  const { data, count, error } = await query;
  if (error) throw error;

  const totalCount = count || 0;
  const totalPage = Math.ceil(totalCount / limit) || 1;

  return send(res, 200, {
    success: true,
    data: (data || []).map((row, index) => ({
      ...formatBoard(row),
      board_no: totalCount - offset - index,
    })),
    pagination: {
      page, limit, totalCount, totalPage,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPage,
    },
    search: { searchType, keyword },
  });
}

async function rankBoards(req, res, column) {
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 5, 1), 10);
  const { data, error } = await supabase
    .from('mdae_boards')
    .select('*')
    .order(column, { ascending: false })
    .order('id', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return send(res, 200, { success: true, data: (data || []).map(formatBoard) });
}

async function handleApi(req, res, explicitPath) {
  const path = getPath(req, explicitPath);
  const method = req.method.toUpperCase();
  const body = parseBody(req);

  try {
    if (path.length === 1 && path[0] === 'board' && method === 'GET') {
      return await listBoards(req, res);
    }

    if (path[0] === 'board' && path[1] === 'ranking' && method === 'GET') {
      if (path[2] === 'views') return await rankBoards(req, res, 'views');
      if (path[2] === 'likes') return await rankBoards(req, res, 'likes');
    }

    if (path[0] === 'board' && path.length === 2 && method === 'GET') {
      const id = Number(path[1]);
      const { data, error } = await supabase.rpc('mdae_get_board', { p_id: id });
      if (error) throw error;
      if (!data?.length) return send(res, 404, { success: false, message: '게시글을 찾을 수 없습니다.' });
      return send(res, 200, { success: true, data: await addBoardNumber(data[0]) });
    }

    if (path[0] === 'board' && path[2] === 'like' && method === 'POST') {
      const { data, error } = await supabase.rpc('mdae_like_board', { p_id: Number(path[1]) });
      if (error) throw error;
      if (!data?.length) return send(res, 404, { success: false, message: '게시글을 찾을 수 없습니다.' });
      return send(res, 200, { success: true, message: '좋아요가 추가되었습니다.', data: await addBoardNumber(data[0]) });
    }

    if (path[0] === 'board' && path[2] === 'vote' && method === 'POST') {
      const { data, error } = await supabase.rpc('mdae_vote_board', {
        p_id: Number(path[1]),
        p_choice: Number(body.choice),
      });
      if (error) return send(res, 400, { success: false, message: messageFromError(error, '투표 처리 중 오류가 발생했습니다.') });
      return send(res, 200, { success: true, message: '투표가 완료되었습니다.', data: await addBoardNumber(data[0]) });
    }

    if (path[0] === 'board' && path.length === 1 && method === 'POST') {
      const title = String(body.title || '').trim();
      const content = String(body.content || '').trim();
      const author = String(body.author || '').trim();
      if (!title || !content || !author) return send(res, 400, { success: false, message: '제목, 내용, 작성자를 모두 입력해주세요.' });

      const { data, error } = await supabase.rpc('mdae_create_board', {
        p_title: title,
        p_content: content,
        p_author: author,
        p_fighter1: String(body.fighter1 || ''),
        p_fighter2: String(body.fighter2 || ''),
        p_vote_enabled: body.vote_enabled !== false,
        p_vote_deadline: body.vote_deadline || null,
      });
      if (error) throw error;
      return send(res, 201, { success: true, message: '게시글이 등록되었습니다.', data: await addBoardNumber(data[0]) });
    }

    if (path[0] === 'board' && path.length === 2 && method === 'PUT') {
      const { data, error } = await supabase.rpc('mdae_update_board', {
        p_id: Number(path[1]),
        p_title: String(body.title || ''),
        p_content: String(body.content || ''),
        p_author: String(body.author || ''),
        p_fighter1: String(body.fighter1 || ''),
        p_fighter2: String(body.fighter2 || ''),
        p_vote_enabled: body.vote_enabled !== false,
        p_vote_deadline: body.vote_deadline || null,
      });
      if (error) throw error;
      if (!data?.length) return send(res, 404, { success: false, message: '수정할 게시글을 찾을 수 없습니다.' });
      return send(res, 200, { success: true, message: '게시글이 수정되었습니다.', data: await addBoardNumber(data[0]) });
    }

    if (path[0] === 'board' && path.length === 2 && method === 'DELETE') {
      const { data, error } = await supabase.rpc('mdae_delete_board', { p_id: Number(path[1]) });
      if (error) throw error;
      if (!data) return send(res, 404, { success: false, message: '삭제할 게시글을 찾을 수 없습니다.' });
      return send(res, 200, { success: true, message: '게시글이 삭제되었습니다.' });
    }

    if (path[0] === 'board' && path[2] === 'comments' && method === 'GET') {
      const { data, error } = await supabase.rpc('mdae_list_comments', { p_board_id: Number(path[1]) });
      if (error) throw error;
      return send(res, 200, { success: true, data: (data || []).map(formatComment) });
    }

    if (path[0] === 'board' && path[2] === 'comments' && method === 'POST') {
      const nickname = String(body.nickname || '').trim();
      const password = String(body.password || '').trim();
      const content = String(body.content || '').trim();
      if (!nickname || !password || !content) return send(res, 400, { success: false, message: '닉네임, 비밀번호, 댓글 내용을 모두 입력해주세요.' });
      const { data, error } = await supabase.rpc('mdae_create_comment', {
        p_board_id: Number(path[1]), p_nickname: nickname, p_password: password, p_content: content,
      });
      if (error) throw error;
      return send(res, 201, { success: true, message: '댓글이 등록되었습니다.', data: formatComment(data[0]) });
    }

    if (path[0] === 'comments' && path.length === 2 && method === 'PUT') {
      const { data, error } = await supabase.rpc('mdae_update_comment', {
        p_id: Number(path[1]), p_password: String(body.password || ''), p_content: String(body.content || ''),
      });
      if (error) return send(res, 403, { success: false, message: messageFromError(error, '댓글 수정 중 오류가 발생했습니다.') });
      return send(res, 200, { success: true, message: '댓글이 수정되었습니다.', data: formatComment(data[0]) });
    }

    if (path[0] === 'comments' && path.length === 2 && method === 'DELETE') {
      const { data, error } = await supabase.rpc('mdae_delete_comment', {
        p_id: Number(path[1]), p_password: String(body.password || ''),
      });
      if (error) return send(res, 403, { success: false, message: messageFromError(error, '댓글 삭제 중 오류가 발생했습니다.') });
      return send(res, 200, { success: true, message: '댓글이 삭제되었습니다.', data });
    }

    return send(res, 404, { success: false, message: 'API 경로를 찾을 수 없습니다.' });
  } catch (error) {
    console.error(error);
    return send(res, 500, { success: false, message: '서버 처리 중 오류가 발생했습니다.' });
  }
}

module.exports = { handleApi };
