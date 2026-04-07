import express from 'express';
import runGraph from "./ai/graph.ai.js"
import cors from "cors"
import apiRoutes from "./routes/api.js"
import authRoutes from "./routes/auth.js"

const app = express();
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}))

// Mount API routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);


app.get('/', async (req, res) => {
    console.log("📥 GET / request received");
    try {
        const result = await runGraph("Write an code for Factorial function in js")
        console.log(" Graph execution successful");
        res.json(result)
    } catch (error: any) {
        console.error(" Error running graph:", error.message || error);
        res.status(500).json({ error: error.message || "Failed to run graph" });
    }
})


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
