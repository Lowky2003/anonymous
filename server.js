const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store: { id, text, createdAt }
const answers = new Map();
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

// Cleanup expired answers every minute
setInterval(() => {
  const now = Date.now();
  for (const [id, answer] of answers) {
    if (now - answer.createdAt >= SIX_HOURS_MS) {
      answers.delete(id);
    }
  }
}, 60 * 1000);

// Get all active answers
app.get('/api/answers', (_req, res) => {
  const now = Date.now();
  const active = [];
  for (const [, answer] of answers) {
    if (now - answer.createdAt < SIX_HOURS_MS) {
      const remaining = SIX_HOURS_MS - (now - answer.createdAt);
      active.push({ ...answer, remainingMs: remaining });
    }
  }
  res.json(active);
});

// Post a new answer
app.post('/api/answers', (req, res) => {
  const text = (req.body.text ?? '').trim();
  if (!text) {
    return res.status(400).json({ error: 'Answer text is required' });
  }
  if (text.length > 500) {
    return res.status(400).json({ error: 'Answer must be 500 characters or less' });
  }

  const answer = {
    id: uuidv4(),
    text,
    createdAt: Date.now()
  };
  answers.set(answer.id, answer);
  res.status(201).json(answer);
});

app.listen(PORT, () => {
  console.log(`Bubble Answers running at http://localhost:${PORT}`);
});
