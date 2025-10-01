import { createCommand, createScene, createStep } from "@waylis/core";
import { PassThrough } from "node:stream";
import QRCode from "qrcode";
import { fileManager } from "./app.js";

const command = createCommand({
    value: "qrcode_generator",
    label: "📱 QR code generator",
    description: "Create QR code images for any text information.",
});

const data = createStep({
    key: "data",
    prompt: { type: "text", content: "Enter some text data:" },
    reply: { bodyType: "text", bodyLimits: { minLength: 1, maxLength: 512 } },
});

const scene = createScene({
    steps: [data],
    handler: async (answers) => {
        const stream = new PassThrough();
        QRCode.toFileStream(stream, answers.data, { scale: 10 });

        const metadata = await fileManager.uploadFile(stream, {
            name: "qrcode.png",
            mimeType: "image/png",
            size: 0,
        });

        return { type: "file", content: metadata };
    },
});

export const qrcodeGenerator = { command, scene };
