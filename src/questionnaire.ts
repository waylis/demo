import { createCommand, createScene, createStep, SystemMessageBody, type Option } from "@waylis/core";

const command = createCommand({
    value: "questionnaire",
    label: "📋 Simple questionnaire",
    description: "An example of a simple user survey.",
});

const name = createStep({
    key: "name",
    prompt: { type: "text", content: "What is your name?" },
    reply: { bodyType: "text", bodyLimits: { minLength: 3, maxLength: 50 } },
    handler: async (name) => {
        if (!name.match(/^[a-z]+$/i)) {
            return { type: "text", content: "Only letters are allowed." };
        }
    },
});

const age = createStep({
    key: "age",
    prompt: { type: "text", content: "How old are you?" },
    reply: { bodyType: "number", bodyLimits: { min: 1, max: 99 } },
});

const CONTINENTS: Option[] = [
    { value: "Africa" },
    { value: "Asia" },
    { value: "Europe" },
    { value: "North America" },
    { value: "Oceania" },
    { value: "South America" },
];

const continent = createStep({
    key: "continent",
    prompt: { type: "text", content: "Where are you from?" },
    reply: { bodyType: "option", bodyLimits: { options: CONTINENTS } },
});

const isDeveloper = createStep({
    key: "isDeveloper",
    prompt: { type: "text", content: "Are you developer?" },
    reply: { bodyType: "boolean" },
});

const scene = createScene({
    steps: [name, age, continent, isDeveloper],
    handler: async (answers) => {
        const text: SystemMessageBody = {
            type: "text",
            content: `Nice to meet you, ${answers.name}! Here's your profile:`,
        };

        const table: SystemMessageBody = {
            type: "table",
            content: {
                head: ["Parameter", "Value"],
                body: [
                    ["Name", answers.name],
                    ["Age", answers.age],
                    ["Continent", answers.continent],
                    ["Is developer?", answers.isDeveloper ? "Yes" : "No"],
                ],
            },
        };

        return [text, table];
    },
});

export const questionnaire = { command, scene };
