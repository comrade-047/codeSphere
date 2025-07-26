import express from 'express';
import cors from 'cors';
import { runLanguages } from './indexCore.js';
const app = express();

app.use(cors()); // 👈 allow all origins
app.use(express.json());

// Test route
app.post('/run', async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code || input === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await runLanguages({ language, code, input });
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal compiler error' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Compiler service running on ${PORT}`));
