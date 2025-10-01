import { createCommand, createScene, createStep } from "@waylis/core";
import { fileManager } from "./app.js";

const command = createCommand({
    value: "txt_parser",
    label: "📄 TXT parser",
    description: "A simple content parser from text files.",
});

const txt = createStep({
    key: "txt",
    prompt: { type: "text", content: "Send me a some text file." },
    reply: {
        bodyType: "file",
        bodyLimits: { mimeTypes: ["text/plain"], maxSize: 10_000 }, // 10kb
    },
});

async function readStream(stream: NodeJS.ReadableStream): Promise<string> {
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("utf8");
}

const scene = createScene({
    steps: [txt],
    handler: async (answers) => {
        const stream = await fileManager.downloadFile(answers.txt.id);
        const content = await readStream(stream);

        return [
            { type: "text", content: "The contents of your file:" },
            { type: "text", content },
        ];
    },
});

export const txtParser = { command, scene };
