import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import z from "zod";
import { mistralAIModel, cohereModel, geminiModel } from "./model.ai.js";

// ─── State Definition ───────────────────────────────────────────────────────
const GraphState = Annotation.Root({
    problem: Annotation<string>({
        reducer: (_, next) => next,
        default: () => "",
    }),
    solution_1: Annotation<string>({
        reducer: (_, next) => next,
        default: () => "",
    }),
    solution_2: Annotation<string>({
        reducer: (_, next) => next,
        default: () => "",
    }),
    judge: Annotation<{
        solution_1_score: number;
        solution_2_score: number;
        solution_1_reasoning: string;
        solution_2_reasoning: string;
    }>({
        reducer: (_, next) => next,
        default: () => ({
            solution_1_score: 0,
            solution_2_score: 0,
            solution_1_reasoning: "",
            solution_2_reasoning: "",
        }),
    }),
});

// ─── Retry Utility ──────────────────────────────────────────────────────────
async function withRetry<T>(
    fn: () => Promise<T>, 
    retries: number = 5, 
    delay: number = 2000
): Promise<T> {
    try {
        return await fn();
    } catch (err: any) {
        const isRateLimit = 
            err.message?.includes("429") || 
            err.status === 429 || 
            err.code === 429 ||
            err.message?.toLowerCase().includes("quota exceeded") ||
            err.error?.status === "RESOURCE_EXHAUSTED";

        if (retries > 0 && isRateLimit) {
            console.log(`⚠️ Rate limit hit. Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(res => setTimeout(res, delay));
            return withRetry(fn, retries - 1, delay * 2);
        }
        throw err;
    }
}

// ─── Solution Node ───────────────────────────────────────────────────────────
const solutionNode = async (state: typeof GraphState.State) => {
    console.log("🤖 Node: solution (Mistral + Cohere)");
    return withRetry(async () => {
        const [mistralResponse, cohereResponse] = await Promise.all([
            mistralAIModel.invoke(state.problem),
            cohereModel.invoke(state.problem),
        ]);
        console.log("✅ Node: solution completed");
        return {
            solution_1: mistralResponse.content as string,
            solution_2: cohereResponse.content as string,
        };
    });
};

// ─── Judge Node ──────────────────────────────────────────────────────────────
const judgeSchema = z.object({
    solution_1_score: z.number().min(0).max(10),
    solution_2_score: z.number().min(0).max(10),
    solution_1_reasoning: z.string(),
    solution_2_reasoning: z.string(),
});

const judgeNode = async (state: typeof GraphState.State) => {
    console.log("🤖 Node: judge (Gemini)");
    const { problem, solution_1, solution_2 } = state;

    return withRetry(async () => {
        const structuredJudge = geminiModel.withStructuredOutput(judgeSchema);

        const judgeResponse = await structuredJudge.invoke([
            new HumanMessage(`
                You are a judge evaluating two AI-generated solutions.
                
                Problem: ${problem}
                
                Solution 1 (Mistral): ${solution_1}
                
                Solution 2 (Cohere): ${solution_2}
                
                Please evaluate both solutions. Score each out of 10 and explain your reasoning.
            `),
        ]);
        console.log("✅ Node: judge completed");
        return {
            judge: {
                solution_1_score: judgeResponse.solution_1_score,
                solution_2_score: judgeResponse.solution_2_score,
                solution_1_reasoning: judgeResponse.solution_1_reasoning,
                solution_2_reasoning: judgeResponse.solution_2_reasoning,
            },
        };
    });
};


// ─── Graph Assembly ───────────────────────────────────────────────────────────
const graph = new StateGraph(GraphState)
    .addNode("solution", solutionNode)
    .addNode("judge_node", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge_node")
    .addEdge("judge_node", END)
    .compile();

// ─── Export ───────────────────────────────────────────────────────────────────
export default async function runGraph(problem: string) {
    const result = await graph.invoke({ problem });
    return result;
}