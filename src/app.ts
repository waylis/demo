import { AppServer, SimpleLogger } from "@waylis/core";
import { SqliteDatabase } from "@waylis/sqlite-db";
import { randomUUID } from "node:crypto";
import { IncomingMessage, ServerResponse } from "node:http";

export const app = new AppServer({
    db: new SqliteDatabase("data/sqlite.db"),
    logger: new SimpleLogger({ levels: ["info", "warn", "error"] }),
    config: {
        app: {
            name: "@waylis/demo",
            description: `👋 Welcome to **Waylis** demo server

Here you can try out different scenes created with Waylis from the end user's perspective. 

- [Official documentation](https://waylis.github.io)
- [GitHub organization](https://github.com/waylis/core)
- [This demo source code](https://github.com/waylis/demo)
- [Bug report](https://github.com/waylis/core/issues)
- [Donate](https://buymeacoffee.com/yurace)
            `,
        },

        auth: {
            // Rewrite the default authentication handler to prevent custom user IDs, only random ones
            handler: async (_req: IncomingMessage, res: ServerResponse) => {
                const userID = randomUUID();
                res.setHeader("Set-Cookie", `user_id=${userID}; Secure; HttpOnly; SameSite=Strict; Path=/`);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "OK" }));
            },
        },
    },
});

export const fileManager = await app.getFileManager();
