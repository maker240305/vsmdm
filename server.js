const express = require('express');
const { handleApi } = require('./lib/api-handler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', (req, res) => {
  const path = req.path.split('/').filter(Boolean);
  return handleApi(req, res, path);
});

app.listen(PORT, () => {
  console.log(`Supabase API server is running on http://localhost:${PORT}`);
});
