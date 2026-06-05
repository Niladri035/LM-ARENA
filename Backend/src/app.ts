import express from 'express';
import runGraph from "./ai/graph.ai.js"
import cors from "cors"
import apiRoutes from "./routes/api.js"
import authRoutes from "./routes/auth.js"
import config from "./config/config.js";

const app = express();
app.use(express.json())

// Allow multiple origins — local dev + any onrender.com deployment
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    config.CORS_ORIGIN,           // from env var
    'https://lm-arena-5.onrender.com',  // production frontend
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
}))

// Mount API routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);


// Health check — root URL pe simple response
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: '🤖 LM Arena Backend is live!',
        endpoints: ['/api/models', '/api/leaderboard', '/invoke']
    });
});


app.post("/invoke", async (req, res) => {
    try {
        const { input } = req.body;
        const result = await runGraph(input);

        res.status(200).json({
            message: "Graph executed successfully",
            success: true,
            result
        });
    } catch (error: any) {
        console.error("❌ Error in /invoke:", error.message || error);
        res.status(500).json({
            message: "Failed to execute AI battle",
            success: false,
            error: error.message || String(error)
        });
    }
});



export default app;