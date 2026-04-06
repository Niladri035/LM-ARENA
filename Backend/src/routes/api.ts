import express from 'express';
import User from '../models/User.js';
import Battle from '../models/Battle.js';

const router = express.Router();

// Mock model data for now (could be moved to DB later)
const modelsMetadata = [
  { id: 'mistral', name: "Mistral 7B", model: "Mistral 7B", type: "Open Source", status: "Active", desc: "Fast and efficient small-scale model.", elo: 1245, costScore: "Low" },
  { id: 'cohere', name: "Cohere Command R", model: "Cohere Command R", type: "Proprietary", status: "Active", desc: "Optimized for long-context reasoning.", elo: 1210, costScore: "Low" },
  { id: 'gemini', name: "Gemini 1.5 Pro", model: "Gemini 1.5 Pro", type: "Proprietary", status: "Active", desc: "Google's most capable multimodal model.", elo: 1280, costScore: "Mid" }
];

// GET /api/models
router.get('/models', (req, res) => {
  res.json(modelsMetadata);
});

// GET /api/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const battles = await Battle.find();
    
    // Default starting point for models
    const stats: any = {
      mistral: { ...modelsMetadata[0], elo: 1200, wins: 0, battles: 0 },
      cohere: { ...modelsMetadata[1], elo: 1200, wins: 0, battles: 0 },
      gemini: { ...modelsMetadata[2], elo: 1200, wins: 0, battles: 0 }
    };

    // Calculate from history
    battles.forEach(battle => {
      const { results } = battle;
      if (results && results.judge) {
        const { solution_1_score, solution_2_score } = results.judge;
        
        // For now we assume solution_1 is Mistral and solution_2 is Cohere
        stats.mistral.battles++;
        stats.cohere.battles++;

        if (solution_1_score > solution_2_score) {
          stats.mistral.wins++;
          stats.mistral.elo += 5;
          stats.cohere.elo -= 5;
        } else if (solution_2_score > solution_1_score) {
          stats.cohere.wins++;
          stats.cohere.elo += 5;
          stats.mistral.elo -= 5;
        }
      }
    });

    const sorted = Object.values(stats).sort((a: any, b: any) => b.elo - a.elo);
    res.json(sorted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/battle-history
router.get('/history', async (req, res) => {
  try {
    const history = await Battle.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name');
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/save-battle
router.post('/save-battle', async (req, res) => {
  try {
    const { userId, promptText, results } = req.body;
    
    if (!userId || !promptText || !results) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newBattle = new Battle({
      userId,
      promptText,
      results
    });

    await newBattle.save();
    res.status(201).json({ message: 'Battle saved successfully', battle: newBattle });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/history/user/:userId
router.get('/history/user/:userId', async (req, res) => {
  try {
    const history = await Battle.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/models/:id
router.get('/models/:id', async (req, res) => {
  try {
    const model = modelsMetadata.find(m => m.id === req.params.id);
    if (!model) return res.status(404).json({ message: 'Model not found' });
    
    // Aggregate real stats from battles
    const battles = await Battle.find();
    let wins = 0;
    let total = 0;
    
    battles.forEach(b => {
      if (b.results && b.results.judge) {
        total++;
        const isWinner = (req.params.id === 'mistral' && b.results.judge.solution_1_score > b.results.judge.solution_2_score) ||
                         (req.params.id === 'cohere' && b.results.judge.solution_2_score > b.results.judge.solution_1_score);
        if (isWinner) wins++;
      }
    });

    res.json({ ...model, winRate: total > 0 ? (wins / total * 100).toFixed(1) : 0, totalBattles: total });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
