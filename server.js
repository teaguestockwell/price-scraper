const express = require('express');
const dist = require('./dist')

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json('ok');
});

app.get('/', async (req, res) => {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'url is required' });
    return;
  }

  res
    .status(200)
    .json(await dist.scrapeMeta({ url, type: 'headed', wait: 1000 }));
});

app.listen(process.env.PORT);

module.exports = app;
