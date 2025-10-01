import { createCommand, createScene, createStep, type Option } from "@waylis/core";

const command = createCommand({
    value: "bitcoin_prices",
    label: "💰 Bitcoin prices",
    description: "Show the history prices for Bitcoin cryptocurrency.",
});

const options: Option[] = [
    { value: "1", label: "Last 24 hours" },
    { value: "7", label: "Last 7 days" },
    { value: "14", label: "Last 14 days" },
    { value: "30", label: "Last 30 days" },
];

const period = createStep({
    key: "period",
    prompt: { type: "text", content: "Please pick a period:" },
    reply: { bodyType: "option", bodyLimits: { options } },
});

async function fetchBTCPrices(days: number) {
    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`;
    const resp = await fetch(url);
    const json = (await resp.json()) as { prices: [number, number][] };
    return json.prices.map(([ts, price]) => ({
        time: new Date(ts),
        usd: +price.toFixed(0),
    }));
}

const padZero = (n: number) => String(n).padStart(2, "0");
function formatDate(date: Date) {
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());

    return `${month}-${day} ${hours}:${minutes}`;
}

const scene = createScene({
    steps: [period],
    handler: async (answers) => {
        try {
            const days = +answers.period || 1;
            const prices = await fetchBTCPrices(days);
            const data = prices.map((p) => ({ time: formatDate(p.time), usd: p.usd }));
            const series = [{ name: "usd", label: "$ USD" }];

            return {
                type: "linechart",
                content: {
                    data,
                    dataKey: "time",
                    series,
                    curveType: "monotone",
                    extra: {
                        withDots: false,
                    },
                },
            };
        } catch (error) {
            return { type: "text", content: `Unable to retrieve prices. Please try again later.` };
        }
    },
});

export const bitcoinPrices = { command, scene };
