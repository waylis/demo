import { createCommand, createScene } from "@waylis/core";

export const command = createCommand({
    value: "random_cat",
    label: "🐱 Random cat image",
    description: "Get a random photos of cute cats.",
});

const apiHost = "https://cataas.com";

export const scene = createScene({
    steps: [],
    handler: async () => {
        try {
            const offset = Math.floor(Math.random() * 1900); // Around 2k cats in database
            const req = await fetch(`${apiHost}/api/cats?skip=${offset}&limit=1`);
            const [cat] = (await req.json()) as { id: string }[];
            const id = cat?.id || "";

            return { type: "markdown", content: `![Random cat](${apiHost}/cat/${id})` };
        } catch (error) {
            return { type: "text", content: "Opps... The service is temporarily unavailable." };
        }
    },
});

export const randomCat = { command, scene };
