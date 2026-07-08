import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const LIMIT = 10;
const EMPTY_FORM = {
  title: '',
  content: '',
  author: '',
  vote_enabled: true,
  vote_deadline: '',
  fighter1: '',
  fighter2: '',
};

const DEFAULT_SEARCH = {
  searchType: 'title',
  keyword: '',
};

const EMPTY_COMMENT = {
  nickname: '',
  password: '',
  content: '',
};

const TEXT = {
  brand: '\uba87\ub300\uba87',
  board: '\uac8c\uc2dc\ud310',
  list: '\ubaa9\ub85d',
  detail: '\uc0c1\uc138',
  create: '\uae00\u0020\ub4f1\ub85d',
  edit: '\uc218\uc815',
  delete: '\uc0ad\uc81c',
  save: '\uc800\uc7a5',
  cancel: '\ucde8\uc18c',
  close: '\ub2eb\uae30',
  backToList: '\ubaa9\ub85d\uc73c\ub85c',
  title: '\uc81c\ubaa9',
  author: '\uc791\uc131\uc790',
  content: '\ub0b4\uc6a9',
  search: '\uac80\uc0c9',
  searchReset: '\ucd08\uae30\ud654',
  searchPlaceholder: '\uac80\uc0c9\uc5b4\ub97c\u0020\uc785\ub825\ud558\uc138\uc694',
  comments: '\ub313\uae00',
  nickname: '\ub2c9\ub124\uc784',
  password: '\ube44\ubc00\ubc88\ud638',
  commentPlaceholder: '\ub313\uae00\uc744\u0020\uc785\ub825\ud558\uc138\uc694',
  commentSubmit: '\ub313\uae00\u0020\ub4f1\ub85d',
  commentEdit: '\ub313\uae00\u0020\uc218\uc815',
  commentDelete: '\ub313\uae00\u0020\uc0ad\uc81c',
  fighter1: '1\ubc88\u0020\uc0ac\ub78c',
  fighter2: '2\ubc88\u0020\uc0ac\ub78c',
  fighterLabel1: '1\ubc88',
  fighterLabel2: '2\ubc88',
  vote: '\ud22c\ud45c',
  useVote: '\ud22c\ud45c\u0020\uc0ac\uc6a9',
  noVote: '\uc774\u0020\uae00\uc740\u0020\ud22c\ud45c\ub97c\u0020\uc0ac\uc6a9\ud558\uc9c0\u0020\uc54a\uc2b5\ub2c8\ub2e4.',
  voteDeadline: '\ud22c\ud45c\u0020\ub9c8\uac10\uc77c',
  voteClosed: '\ud22c\ud45c\u0020\ub9c8\uac10',
  timeLeft: '\ub9c8\uac10\uae4c\uc9c0',
  voteDone: '\ud22c\ud45c\u0020\uc644\ub8cc',
  voted: '\uc774\ubbf8\u0020\ud22c\ud45c\ud588\uc2b5\ub2c8\ub2e4',
  voteFail: '\ud22c\ud45c\u0020\ucc98\ub9ac\uc5d0\u0020\uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.',
  matchScore: '\uba87\ub300\uba87\u0020\uacb0\uacfc',
  totalVotes: '\ucd1d\u0020\ud22c\ud45c',
  createdAt: '\uc791\uc131\uc77c',
  views: '\uc870\ud68c\uc218',
  likes: '\uc88b\uc544\uc694',
  ranking: '\uc870\ud68c\uc218\u0020\uc21c\uc704',
  likeRanking: '\ubcc4\uc88b\uc544\uc694\u0020\uc21c\uc704',
  star: '\u2605',
  likeButton: '\ubcc4\u0020\uc88b\uc544\uc694',
  id: '\ubc88\ud638',
  total: '\uc804\uccb4',
  count: '\uac1c',
  page: '\ud398\uc774\uc9c0',
  prev: '\uc774\uc804',
  next: '\ub2e4\uc74c',
  loading: '\ubd88\ub7ec\uc624\ub294\u0020\uc911...',
  empty: '\uac8c\uc2dc\uae00\uc774\u0020\uc5c6\uc2b5\ub2c8\ub2e4.',
  saving: '\uc800\uc7a5\u0020\uc911...',
  confirmDelete: '\uc774\u0020\uac8c\uc2dc\uae00\uc744\u0020\uc0ad\uc81c\ud560\uae4c\uc694?',
  loadFail: '\uac8c\uc2dc\uae00\uc744\u0020\ubd88\ub7ec\uc624\uc9c0\u0020\ubabb\ud588\uc2b5\ub2c8\ub2e4.',
  detailFail: '\uac8c\uc2dc\uae00\u0020\ub0b4\uc6a9\uc744\u0020\ubd88\ub7ec\uc624\uc9c0\u0020\ubabb\ud588\uc2b5\ub2c8\ub2e4.',
  saveFail: '\uac8c\uc2dc\uae00\u0020\uc800\uc7a5\uc5d0\u0020\uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.',
  deleteFail: '\uac8c\uc2dc\uae00\u0020\uc0ad\uc81c\uc5d0\u0020\uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.',
  likeFail: '\uc88b\uc544\uc694\u0020\ucc98\ub9ac\uc5d0\u0020\uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.',
};

function App() {
  const [boards, setBoards] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [likeRankings, setLikeRankings] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: LIMIT,
    totalCount: 0,
    totalPage: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });
  const [view, setView] = useState('list');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [searchForm, setSearchForm] = useState(DEFAULT_SEARCH);
  const [activeSearch, setActiveSearch] = useState(DEFAULT_SEARCH);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState(EMPTY_COMMENT);
  const [editingId, setEditingId] = useState(null);
  const [votedChoice, setVotedChoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const formatDeadlineInput = (value) => {
    if (!value) {
      return '';
    }

    return value.replace(' ', 'T').slice(0, 16);
  };

  const getDeadlineText = (value, short = false) => {
    if (!value) {
      return '-';
    }

    const deadline = new Date(value);
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();

    if (Number.isNaN(deadline.getTime()) || diffMs <= 0) {
      return TEXT.voteClosed;
    }

    const minutes = Math.ceil(diffMs / 60000);

    if (minutes < 60) {
      return `${minutes}min`;
    }

    const hours = Math.ceil(minutes / 60);

    if (hours < 24) {
      return `${hours}hr`;
    }

    const days = Math.ceil(hours / 24);

    return short ? `D-${days}` : `${days}\uc77c`;
  };

  const pageNumbers = useMemo(() => {
    return Array.from({ length: pagination.totalPage }, (_, index) => index + 1);
  }, [pagination.totalPage]);

  const updateBrowserHistory = (params, replace = false) => {
    const query = new URLSearchParams(params);
    const url = `${window.location.pathname}?${query.toString()}`;

    if (replace) {
      window.history.replaceState(params, '', url);
      return;
    }

    window.history.pushState(params, '', url);
  };

  const getListParams = (newPage, searchParams = activeSearch) => {
    const params = {
      page: String(newPage),
    };

    if (searchParams.keyword) {
      params.searchType = searchParams.searchType;
      params.keyword = searchParams.keyword;
    }

    return params;
  };

  const buildBoardUrl = (newPage, searchParams = activeSearch) => {
    const params = new URLSearchParams({
      page: String(newPage),
      limit: String(LIMIT),
    });

    if (searchParams.keyword) {
      params.set('searchType', searchParams.searchType);
      params.set('keyword', searchParams.keyword);
    }

    return `/api/board?${params.toString()}`;
  };

  const fetchBoardData = async (newPage = page, searchParams = activeSearch) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(buildBoardUrl(newPage, searchParams));
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || TEXT.loadFail);
      }

      setBoards(result.data);
      setPagination(result.pagination);
      fetchRankings();
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchViewRanking = async () => {
    try {
      const response = await fetch('/api/board/ranking/views?limit=5');
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || TEXT.loadFail);
      }

      setRankings(result.data);
    } catch (rankingError) {
      setError(rankingError.message);
    }
  };

  const fetchLikeRanking = async () => {
    try {
      const response = await fetch('/api/board/ranking/likes?limit=5');
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || TEXT.loadFail);
      }

      setLikeRankings(result.data);
    } catch (rankingError) {
      setError(rankingError.message);
    }
  };

  const fetchRankings = async () => {
    await Promise.all([fetchViewRanking(), fetchLikeRanking()]);
  };

  const fetchComments = async (boardId) => {
    try {
      const response = await fetch(`/api/board/${boardId}/comments`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || TEXT.loadFail);
      }

      setComments(result.data);
    } catch (commentError) {
      setError(commentError.message);
    }
  };

  const openList = async (newPage = page, pushHistory = true, searchParams = activeSearch) => {
    setView('list');
    setSelectedBoard(null);
    setVotedChoice(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setPage(newPage);
    setActiveSearch(searchParams);
    setSearchForm(searchParams);

    if (pushHistory) {
      updateBrowserHistory(getListParams(newPage, searchParams));
    }

    await fetchBoardData(newPage, searchParams);
  };

  const openDetail = async (id, pushHistory = true) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/board/${id}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || TEXT.detailFail);
      }

      setSelectedBoard(result.data);
      setVotedChoice(localStorage.getItem(`vote:${id}`));
      fetchComments(id);
      setEditingId(null);
      setForm(EMPTY_FORM);
      setView('detail');

      if (pushHistory) {
        updateBrowserHistory({
          view: 'detail',
          id: String(id),
          page: String(page),
          ...getListParams(page, activeSearch),
        });
      }

      fetchRankings();

      return result.data;
    } catch (fetchError) {
      setError(fetchError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setSelectedBoard(null);
    setVotedChoice(null);
    setError('');
    setView('form');
    updateBrowserHistory({
      view: 'create',
      page: String(page),
      ...getListParams(page, activeSearch),
    });
  };

  const openEditForm = (board) => {
    setForm({
      title: board.title || '',
      content: board.content || '',
      author: board.author || '',
      fighter1: board.fighter1 || '',
      fighter2: board.fighter2 || '',
      vote_enabled: Boolean(board.vote_enabled),
      vote_deadline: formatDeadlineInput(board.vote_deadline),
    });
    setEditingId(board.id);
    setError('');
    setView('form');
    updateBrowserHistory({
      view: 'edit',
      id: String(board.id),
      page: String(page),
      ...getListParams(page, activeSearch),
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPage || newPage === page) {
      return;
    }

    setPage(newPage);
    updateBrowserHistory(getListParams(newPage, activeSearch));
    fetchBoardData(newPage, activeSearch);
  };

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchForm((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  };

  const handleCommentChange = (event) => {
    const { name, value } = event.target;
    setCommentForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!selectedBoard) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/board/${selectedBoard.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentForm),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || TEXT.saveFail);
      }

      setCommentForm(EMPTY_COMMENT);
      await fetchComments(selectedBoard.id);
    } catch (commentError) {
      setError(commentError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentEdit = async (comment) => {
    const password = window.prompt(TEXT.password);

    if (!password) {
      return;
    }

    const content = window.prompt(TEXT.commentEdit, comment.content);

    if (!content) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, content }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || TEXT.saveFail);
      }

      await fetchComments(comment.board_id);
    } catch (commentError) {
      setError(commentError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentDelete = async (comment) => {
    const password = window.prompt(TEXT.password);

    if (!password) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || TEXT.deleteFail);
      }

      await fetchComments(comment.board_id);
    } catch (commentError) {
      setError(commentError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const nextSearch = {
      searchType: searchForm.searchType,
      keyword: searchForm.keyword.trim(),
    };

    setActiveSearch(nextSearch);
    setPage(1);
    setView('list');
    updateBrowserHistory(getListParams(1, nextSearch));
    fetchBoardData(1, nextSearch);
    setIsMobileSearchOpen(false);
  };

  const handleSearchReset = () => {
    setSearchForm(DEFAULT_SEARCH);
    setActiveSearch(DEFAULT_SEARCH);
    setPage(1);
    setView('list');
    updateBrowserHistory(getListParams(1, DEFAULT_SEARCH));
    fetchBoardData(1, DEFAULT_SEARCH);
    setIsMobileSearchOpen(false);
  };

  const goHome = () => {
    setSearchForm(DEFAULT_SEARCH);
    setActiveSearch(DEFAULT_SEARCH);
    setSelectedBoard(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setView('list');
    setPage(1);
    updateBrowserHistory({ page: '1' });
    fetchBoardData(1, DEFAULT_SEARCH);
    setIsMobileSearchOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const isEditing = Boolean(editingId);
      const response = await fetch(isEditing ? `/api/board/${editingId}` : '/api/board', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || TEXT.saveFail);
      }

      setSelectedBoard(result.data);
      setView('detail');
      updateBrowserHistory({
        view: 'detail',
        id: String(result.data.id),
        page: String(isEditing ? page : 1),
      });

      if (!isEditing) {
        setPage(1);
        await fetchBoardData(1, activeSearch);
      } else {
        await fetchBoardData(page, activeSearch);
      }
      await fetchRankings();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id) => {
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/board/${id}/like`, {
        method: 'POST',
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || TEXT.likeFail);
      }

      setSelectedBoard((prevBoard) => ({
        ...result.data,
        board_no: prevBoard?.board_no || result.data.board_no,
      }));
      await fetchBoardData(page, activeSearch);
      await fetchRankings();
    } catch (likeError) {
      setError(likeError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (id, choice) => {
    const voteKey = `vote:${id}`;

    if (localStorage.getItem(voteKey)) {
      setVotedChoice(localStorage.getItem(voteKey));
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/board/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ choice }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || TEXT.voteFail);
      }

      localStorage.setItem(voteKey, String(choice));
      setVotedChoice(String(choice));
      setSelectedBoard((prevBoard) => ({
        ...result.data,
        board_no: prevBoard?.board_no || result.data.board_no,
      }));
      await fetchBoardData(page, activeSearch);
    } catch (voteError) {
      setError(voteError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(TEXT.confirmDelete)) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/board/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || TEXT.deleteFail);
      }

      const nextPage = boards.length === 1 && page > 1 ? page - 1 : page;
      setPage(nextPage);
      await openList(nextPage);
      await fetchRankings();
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const applyRoute = () => {
      const params = new URLSearchParams(window.location.search);
      const routePage = Math.max(parseInt(params.get('page'), 10) || 1, 1);
      const routeView = params.get('view');
      const routeId = params.get('id');
      const routeSearch = {
        searchType: params.get('searchType') || 'title',
        keyword: params.get('keyword') || '',
      };

      setPage(routePage);
      setActiveSearch(routeSearch);
      setSearchForm(routeSearch);

      if (routeView === 'detail' && routeId) {
        openDetail(routeId, false);
        return;
      }

      if (routeView === 'create') {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setSelectedBoard(null);
        setView('form');
        fetchBoardData(routePage, routeSearch);
        return;
      }

      if (routeView === 'edit' && routeId) {
        openDetail(routeId, false).then((board) => {
          if (!board) {
            return;
          }

          setForm({
            title: board.title || '',
            content: board.content || '',
            author: board.author || '',
            fighter1: board.fighter1 || '',
            fighter2: board.fighter2 || '',
            vote_enabled: Boolean(board.vote_enabled),
            vote_deadline: formatDeadlineInput(board.vote_deadline),
          });
          setView('form');
          setEditingId(routeId);
        });
        return;
      }

      openList(routePage, false, routeSearch);
    };

    if (!window.location.search) {
      updateBrowserHistory({ page: '1' }, true);
    }

    applyRoute();
    window.addEventListener('popstate', applyRoute);

    return () => {
      window.removeEventListener('popstate', applyRoute);
    };
  }, []);

  const pageTitle = view === 'detail' ? `${TEXT.board} ${TEXT.detail}` : view === 'form' ? (editingId ? `${TEXT.board} ${TEXT.edit}` : TEXT.create) : TEXT.board;

  return (
    <main className="page">
      <header className="site-header">
        <button type="button" className="site-brand" onClick={goHome}>
          {TEXT.brand}
        </button>
        <button
          type="button"
          className="mobile-search-toggle"
          aria-label={TEXT.search}
          onClick={() => setIsMobileSearchOpen((isOpen) => !isOpen)}
        >
          <span aria-hidden="true" />
        </button>
        <form className={isMobileSearchOpen ? 'search-bar top-search is-open' : 'search-bar top-search'} onSubmit={handleSearchSubmit}>
          <select name="searchType" value={searchForm.searchType} onChange={handleSearchChange} aria-label={TEXT.search}>
            <option value="title">{TEXT.title}</option>
            <option value="author">{TEXT.author}</option>
            <option value="content">{TEXT.content}</option>
          </select>
          <input
            name="keyword"
            value={searchForm.keyword}
            onChange={handleSearchChange}
            placeholder={TEXT.searchPlaceholder}
          />
          <button type="submit" className="primary-button">{TEXT.search}</button>
          <button type="button" className="secondary-button" onClick={handleSearchReset}>{TEXT.searchReset}</button>
        </form>
        <button type="button" className="primary-button site-create" onClick={openCreateForm}>
          {TEXT.create}
        </button>
      </header>
      <section className="board">
        <div className="board__header">
          <div>
            <h1>{pageTitle}</h1>
          </div>
          <div className="header-actions">
            {view === 'list' && (
              <div className="summary">
                <span>{TEXT.total} {pagination.totalCount}{TEXT.count}</span>
                <strong>{pagination.page}</strong>
                <span>/ {pagination.totalPage} {TEXT.page}</span>
              </div>
            )}
            {view !== 'list' && (
              <button type="button" className="secondary-button" onClick={() => openList(page)}>
                {TEXT.backToList}
              </button>
            )}
          </div>
        </div>

        {error && <div className="notice notice--error">{error}</div>}

        {view === 'list' && !activeSearch.keyword && (
          <>
            <div className="ranking-grid">
              <aside className="ranking-panel" aria-label={TEXT.ranking}>
                <div className="ranking-panel__header">
                  <h2>{TEXT.ranking}</h2>
                  <span>TOP {rankings.length}</span>
                </div>
                {rankings.length > 0 ? (
                  <ol className="ranking-list">
                    {rankings.map((board, index) => (
                      <li key={board.id}>
                        <button type="button" onClick={() => openDetail(board.id)}>
                          <strong>{index + 1}</strong>
                          <span>{board.title}</span>
                          <em>{board.views || 0}</em>
                        </button>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="ranking-empty">{TEXT.empty}</p>
                )}
              </aside>

              <aside className="ranking-panel" aria-label={TEXT.likeRanking}>
                <div className="ranking-panel__header">
                  <h2>{TEXT.likeRanking}</h2>
                  <span>TOP {likeRankings.length}</span>
                </div>
                {likeRankings.length > 0 ? (
                  <ol className="ranking-list">
                    {likeRankings.map((board, index) => (
                      <li key={board.id}>
                        <button type="button" onClick={() => openDetail(board.id)}>
                          <strong>{index + 1}</strong>
                          <span>{board.title}</span>
                          <em>{board.likes || 0}</em>
                        </button>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="ranking-empty">{TEXT.empty}</p>
                )}
              </aside>
            </div>
          </>
        )}

        {view === 'form' && (
          <form className="editor" onSubmit={handleSubmit}>
            <div className="editor__header">
              <h2>{editingId ? `${TEXT.board} ${TEXT.edit}` : TEXT.create}</h2>
              <button type="button" className="text-button" onClick={() => (selectedBoard ? openDetail(selectedBoard.id) : openList(page))}>
                {TEXT.close}
              </button>
            </div>
            <label>
              {TEXT.title}
              <input name="title" value={form.title} onChange={handleChange} placeholder={TEXT.title} />
            </label>
            <label>
              {TEXT.author}
              <input name="author" value={form.author} onChange={handleChange} placeholder={TEXT.author} />
            </label>
            <div className="fighter-fields">
              <label className="checkbox-label">
                <input name="vote_enabled" type="checkbox" checked={form.vote_enabled} onChange={handleChange} />
                {TEXT.useVote}
              </label>
            </div>
            {form.vote_enabled && (
              <div className="fighter-fields">
                <label>
                  {TEXT.fighter1}
                  <input name="fighter1" value={form.fighter1} onChange={handleChange} placeholder={TEXT.fighter1} />
                </label>
                <label>
                  {TEXT.fighter2}
                  <input name="fighter2" value={form.fighter2} onChange={handleChange} placeholder={TEXT.fighter2} />
                </label>
                <label>
                  {TEXT.voteDeadline}
                  <input name="vote_deadline" type="datetime-local" value={form.vote_deadline} onChange={handleChange} />
                </label>
              </div>
            )}
            <label>
              {TEXT.content}
              <textarea name="content" value={form.content} onChange={handleChange} placeholder={TEXT.content} rows="8" />
            </label>
            <div className="editor__actions">
              <button type="button" className="secondary-button" onClick={() => (selectedBoard ? openDetail(selectedBoard.id) : openList(page))}>
                {TEXT.cancel}
              </button>
              <button type="submit" className="primary-button" disabled={submitting}>
                {submitting ? TEXT.saving : TEXT.save}
              </button>
            </div>
          </form>
        )}

        {view === 'detail' && selectedBoard && (
          <article className="detail detail--page">
            <div className="detail__header">
              <div>
                <p>#{selectedBoard.board_no}</p>
                <h2>{selectedBoard.title}</h2>
              </div>
              <div className="detail__actions">
                <button type="button" className="secondary-button" onClick={() => openEditForm(selectedBoard)}>
                  {TEXT.edit}
                </button>
                <button type="button" className="danger-button" onClick={() => handleDelete(selectedBoard.id)} disabled={submitting}>
                  {TEXT.delete}
                </button>
              </div>
            </div>
            <div className="detail__meta">
              <span>{selectedBoard.author}</span>
              <span>{selectedBoard.created_at}</span>
              <span>{TEXT.views} {selectedBoard.views || 0}</span>
              <span>{TEXT.likes} {selectedBoard.likes || 0}</span>
            </div>
            {selectedBoard.vote_enabled ? (
              <>
                <div className="vote-arena">
                  <button
                    type="button"
                    className={votedChoice === '1' ? 'vote-card is-picked' : 'vote-card'}
                    onClick={() => handleVote(selectedBoard.id, 1)}
                    disabled={submitting || Boolean(votedChoice)}
                  >
                    <span>{TEXT.fighterLabel1}</span>
                    <strong>{selectedBoard.fighter1 || TEXT.fighter1}</strong>
                    <em>{selectedBoard.votes1 || 0}{TEXT.count}</em>
                  </button>
                  <div className="versus-badge">VS</div>
                  <button
                    type="button"
                    className={votedChoice === '2' ? 'vote-card is-picked' : 'vote-card'}
                    onClick={() => handleVote(selectedBoard.id, 2)}
                    disabled={submitting || Boolean(votedChoice)}
                  >
                    <span>{TEXT.fighterLabel2}</span>
                    <strong>{selectedBoard.fighter2 || TEXT.fighter2}</strong>
                    <em>{selectedBoard.votes2 || 0}{TEXT.count}</em>
                  </button>
                </div>
                <div className="match-score">
                  <span>{TEXT.matchScore}</span>
                  <strong>{selectedBoard.match_score || '5:5'}</strong>
                  <em>{TEXT.totalVotes} {selectedBoard.total_votes || 0}{TEXT.count}</em>
                </div>
                <p className="deadline-text">
                  {TEXT.timeLeft} {getDeadlineText(selectedBoard.vote_deadline)}
                </p>
                {votedChoice && <p className="vote-done">{TEXT.voted}</p>}
              </>
            ) : (
              <p className="vote-disabled">{TEXT.noVote}</p>
            )}
            <p className="detail__content">{selectedBoard.content}</p>
            <div className="detail__footer">
              <button type="button" className="star-button" onClick={() => handleLike(selectedBoard.id)} disabled={submitting}>
                <span>{TEXT.star}</span>
                {TEXT.likeButton} {selectedBoard.likes || 0}
              </button>
            </div>
            <section className="comments">
              <h2>{TEXT.comments}</h2>
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <div className="comment-form__side">
                  <input name="nickname" value={commentForm.nickname} onChange={handleCommentChange} placeholder={TEXT.nickname} />
                  <input name="password" type="password" value={commentForm.password} onChange={handleCommentChange} placeholder={TEXT.password} />
                  <button type="submit" className="primary-button" disabled={submitting}>{TEXT.commentSubmit}</button>
                </div>
                <textarea name="content" value={commentForm.content} onChange={handleCommentChange} placeholder={TEXT.commentPlaceholder} rows="5" />
              </form>
              <div className="comment-list">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <article className="comment-item" key={comment.id}>
                      <div>
                        <strong>{comment.nickname}</strong>
                        <span>{comment.created_at}</span>
                      </div>
                      <p>{comment.content}</p>
                      <div className="comment-actions">
                        <button type="button" onClick={() => handleCommentEdit(comment)}>{TEXT.edit}</button>
                        <button type="button" onClick={() => handleCommentDelete(comment)}>{TEXT.delete}</button>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="comment-empty">{TEXT.empty}</p>
                )}
              </div>
            </section>
          </article>
        )}

        {view === 'list' && (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{TEXT.id}</th>
                    <th>{TEXT.title}</th>
                    <th>{TEXT.author}</th>
                    <th>{TEXT.createdAt}</th>
                    <th>{TEXT.views}</th>
                    <th>{TEXT.likes}</th>
                    <th>{TEXT.matchScore}</th>
                    <th>{TEXT.voteDeadline}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="empty">{TEXT.loading}</td>
                    </tr>
                  ) : boards.length > 0 ? (
                    boards.map((board) => (
                      <tr key={board.id}>
                        <td>{board.board_no}</td>
                        <td className="title-cell">
                          <button type="button" className="title-button" onClick={() => openDetail(board.id)}>
                            {board.title}
                          </button>
                        </td>
                        <td>{board.author}</td>
                        <td>{board.created_at}</td>
                        <td>{board.views || 0}</td>
                        <td>{board.likes || 0}</td>
                        <td>{board.vote_enabled ? board.match_score || '5:5' : '-'}</td>
                        <td>
                          {board.vote_enabled ? (
                            <span className="deadline-badge">
                              <strong>{getDeadlineText(board.vote_deadline, true)}</strong>
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="empty">{TEXT.empty}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <nav className="pagination" aria-label={TEXT.page}>
              <button type="button" onClick={() => handlePageChange(page - 1)} disabled={!pagination.hasPrevPage || loading}>
                {TEXT.prev}
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={pageNumber === page ? 'is-active' : ''}
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={loading}
                >
                  {pageNumber}
                </button>
              ))}
              <button type="button" onClick={() => handlePageChange(page + 1)} disabled={!pagination.hasNextPage || loading}>
                {TEXT.next}
              </button>
            </nav>
          </>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
