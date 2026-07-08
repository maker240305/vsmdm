const { handleApi } = require('../lib/api-handler');

module.exports = async function handler(req, res) {
  return handleApi(req, res);
};
