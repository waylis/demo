import { app } from "./app.js";
import { birthdayStats } from "./birthday-stats.js";
import { bitcoinPrices } from "./bitcoin-prices.js";
import { qrcodeGenerator } from "./qrcode-generator.js";
import { questionnaire } from "./questionnaire.js";
import { randomCat } from "./random-cat.js";
import { txtParser } from "./txt-parser.js";
import { urlShortener } from "./url-shortener.js";

const main = async () => {
    app.addScene(questionnaire.command, questionnaire.scene);
    app.addScene(birthdayStats.command, birthdayStats.scene);
    app.addScene(urlShortener.command, urlShortener.scene);
    app.addScene(txtParser.command, txtParser.scene);
    app.addScene(qrcodeGenerator.command, qrcodeGenerator.scene);
    app.addScene(randomCat.command, randomCat.scene);
    app.addScene(bitcoinPrices.command, bitcoinPrices.scene);

    app.start();
};

main();
