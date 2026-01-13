const { StateGraph, MessagesAnnotation } = require('@langchain/langgraph');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ToolMessage } = require('@langchain/core/messages');
const tools = require('./tools');

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0.5,
})


const graph = new StateGraph(MessagesAnnotation)
    .addNode("tools", async (state, config) => {
        const lastMessage = state.messages[state.messages.length - 1];

        const toolCall = lastMessage.tool_calls || lastMessage.toolCalls;

        const toolCallResults = await Promise.all(toolCall.map(async (call) => {
            const tool = tools[call.name]
            if (!tool) {
                throw new Error(`Tool ${call.name} not found`);
            }
            const toolInput = call.args

            const toolResult = await tool.func({ ...toolInput, token: config.configurable?.token })

            return new ToolMessage({
                tool_call_id: call.id,
                name: call.name,
                content: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult)
            })
        }))
        return { messages: toolCallResults };
    })
    .addNode("chat", async (state, config) => {
        const response = await model.invoke(state.messages, { tools: [tools.searchProduct, tools.addProductToCart] });
        return { messages: [response] };
    })
    .addEdge("__start__", "chat")
    .addConditionalEdges("chat", async (state) => {
        const lastMessage = state.messages[state.messages.length - 1];
        const toolCalls = lastMessage.tool_calls || lastMessage.toolCalls;
        if (toolCalls && toolCalls.length > 0) {
            return "tools";
        }
        return "__end__";
    })
    .addEdge("tools", "chat");


const agent = graph.compile()

module.exports = agent