import dotenv from 'dotenv';

dotenv.config();

const requiredVars = ['GOOGLE_API_KEY', 'MISTRAL_API_KEY', 'COHERE_API_KEY'] as const;

for (const varName of requiredVars) {
    if (!process.env[varName]) {
        console.error(`❌ Missing required environment variable: ${varName}`);
        process.exit(1);
    }
}

const config = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY!,
    MISTRALAI_API_KEY: process.env.MISTRAL_API_KEY!,
    COHERE_API_KEY: process.env.COHERE_API_KEY!,
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

export default config;
