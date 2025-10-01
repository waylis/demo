import { createCommand, createScene, createStep } from "@waylis/core";

const command = createCommand({
    value: "url_shortener",
    label: "🔗 URL shortener",
    description: "Makes long URLs short and convenient to share.",
});

const urlRegex = /^https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/;

const url = createStep({
    key: "url",
    prompt: { type: "text", content: "Please enter your URL:" },
    reply: { bodyType: "text", bodyLimits: { minLength: 16, maxLength: 512 } },
    handler: async (url) => {
        if (!urlRegex.test(url)) {
            return { type: "text", content: "Invalid URL, try another one." };
        }
    },
});

async function shortenUrl(url: string): Promise<string> {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
    };

    try {
        const response = await fetch("https://cleanuri.com/api/v1/shorten", options);
        const data = (await response.json()) as { result_url: string };
        return data.result_url || "";
    } catch (err) {
        return "";
    }
}

const scene = createScene({
    steps: [url],
    handler: async (answers) => {
        const shorten = await shortenUrl(answers.url);
        if (!shorten) {
            return {
                type: "text",
                content: `Couldn't shorten your link. Try another link or a little later.`,
            };
        }

        return { type: "markdown", content: `[${shorten}](${shorten})` };
    },
});

export const urlShortener = { command, scene };
