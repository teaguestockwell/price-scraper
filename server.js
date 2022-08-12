const express = require('express');
const dist = require('./dist');
const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json(Date.now());
});

app.get('/', async (req, res) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'url is required' });
    return;
  }

  try {
    const data = await dist.scrapeMeta({ url, type: 'headed', wait: 1000 });
    res.status(200).json(data);
  } catch ({ stack, message, time = Date.now() }) {
    res.status(500).json({ message, stack, time });
  }
});

app.listen(process.env.PORT);
console.log(`listening on ${process.env.PORT} at ${new Date().toISOString()}`);
