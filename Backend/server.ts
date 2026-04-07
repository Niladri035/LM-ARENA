import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/db.js";

const PORT = config.PORT;

// Connect to MongoDB Atlas
connectDB();

const server = app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
    console.log(`\n ${signal} received. Shutting down gracefully...`);
    server.close(() => {
        console.log(" HTTP server closed.");
        process.exit(0);
    });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
        console.error(` Port ${PORT} is already in use.`);
    } else {
        console.error(" Server error:", err);
    }
    process.exit(1);
});
