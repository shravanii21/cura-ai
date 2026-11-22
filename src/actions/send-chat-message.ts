
"use server";

import ai from "@/lib/google";

interface ChatMessage {
    role: "user" | "model";
    content: string;
}

interface Props {
    message: string;
    history: ChatMessage[];
    promptText: string;
}

const sendChatMessage = async ({
    message,
    history,
    promptText,
}: Props): Promise<string> => {
    try {
        const model = ai.getGenerativeModel({
            model: "gemini-3.5-flash-lite",
            systemInstruction: promptText,
        });

        const chat = model.startChat({
            history: history.map((item) => ({
                role: item.role,
                parts: [{ text: item.content }],
            })),
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        if (!response) {
            throw new Error("Empty response received from AI");
        }

        return response;
    } catch (error) {
        console.error("AI Chat error:", error);
        throw new Error("Failed to generate AI response");
    }
};

export default sendChatMessage;
