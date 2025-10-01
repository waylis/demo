import { createCommand, createScene, createStep } from "@waylis/core";

const command = createCommand({
    value: "birthday_stats",
    label: "🎂 Birthday stats",
    description: "Discover usefull statistics and facts about your birthdate.",
});

const datetime = createStep({
    key: "birthday",
    prompt: { type: "text", content: "Enter your date of birth:" },
    reply: { bodyType: "datetime", bodyLimits: { max: new Date() } },
});

function getBirthdayStats(birthdate: Date) {
    const now = new Date();

    const age = calculateAge(birthdate, now);
    const nextBirthday = calculateNextBirthday(birthdate, now);
    const zodiacSign = getZodiacSign(birthdate);
    const chineseZodiac = getChineseZodiac(birthdate.getFullYear());
    const lifeMilestones = calculateLifeMilestones(birthdate, 80);
    const interestingFacts = calculateInterestingFacts(birthdate, now);
    const season = getSeason(birthdate);
    const generation = getGeneration(birthdate.getFullYear());

    return {
        age,
        nextBirthday,
        zodiacSign,
        chineseZodiac,
        dayOfWeek: birthdate.toLocaleDateString("en-US", { weekday: "long" }),
        isLeapYear: isLeapYear(birthdate.getFullYear()),
        lifeMilestones,
        interestingFacts,
        season,
        generation,
        isToday: isSameDay(birthdate, now),
        wasInPast: birthdate < now,
    };
}

function calculateAge(birthDate: Date, currentDate: Date): number {
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
        return age - 1;
    }

    return age;
}

function calculateNextBirthday(birthDate: Date, currentDate: Date) {
    const currentYear = currentDate.getFullYear();
    let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

    if (nextBirthday < currentDate) {
        nextBirthday.setFullYear(currentYear + 1);
    }

    const msUntil = nextBirthday.getTime() - currentDate.getTime();
    const daysUntil = Math.ceil(msUntil / (1000 * 60 * 60 * 24));

    return {
        date: nextBirthday,
        daysUntil,
        weeksUntil: Math.ceil(daysUntil / 7),
    };
}

function getZodiacSign(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    return "Pisces";
}

function getChineseZodiac(year: number): string {
    const zodiacs = [
        "Monkey",
        "Rooster",
        "Dog",
        "Pig",
        "Rat",
        "Ox",
        "Tiger",
        "Rabbit",
        "Dragon",
        "Snake",
        "Horse",
        "Goat",
    ];
    return zodiacs[year % 12];
}

function calculateLifeMilestones(birthDate: Date, lifespan: number) {
    const halfLife = new Date(birthDate);
    halfLife.setFullYear(birthDate.getFullYear() + Math.floor(lifespan / 2));

    const quarterLife = new Date(birthDate);
    quarterLife.setFullYear(birthDate.getFullYear() + Math.floor(lifespan / 4));

    const thirdLife = new Date(birthDate);
    thirdLife.setFullYear(birthDate.getFullYear() + Math.floor(lifespan / 3));

    return { halfLife, quarterLife, thirdLife };
}

function calculateInterestingFacts(birthDate: Date, currentDate: Date) {
    const msLived = currentDate.getTime() - birthDate.getTime();
    const secondsLived = Math.floor(msLived / 1000);
    const minutesLived = Math.floor(secondsLived / 60);
    const hoursLived = Math.floor(minutesLived / 60);
    const daysLived = Math.floor(hoursLived / 24);
    const weeksLived = Math.floor(daysLived / 7);
    const monthsLived = Math.floor(daysLived / 30.44);

    return {
        daysLived,
        weeksLived,
        monthsLived,
        hoursLived,
        minutesLived,
        secondsLived,
    };
}

function getSeason(date: Date): string {
    const month = date.getMonth() + 1;
    if (month >= 3 && month <= 5) return "Spring";
    if (month >= 6 && month <= 8) return "Summer";
    if (month >= 9 && month <= 11) return "Autumn";
    return "Winter";
}

function getGeneration(birthYear: number): string {
    if (birthYear >= 2013) return "Alpha";
    if (birthYear >= 1997) return "Generation Z";
    if (birthYear >= 1981) return "Millennial";
    if (birthYear >= 1965) return "Generation X";
    if (birthYear >= 1946) return "Baby Boomer";
    if (birthYear >= 1928) return "Silent Generation";
    return "Greatest Generation";
}

function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}

function getZodiacEmoji(zodiac: string): string {
    const emojis: { [key: string]: string } = {
        Aries: "♈",
        Taurus: "♉",
        Gemini: "♊",
        Cancer: "♋",
        Leo: "♌",
        Virgo: "♍",
        Libra: "♎",
        Scorpio: "♏",
        Sagittarius: "♐",
        Capricorn: "♑",
        Aquarius: "♒",
        Pisces: "♓",
    };
    return emojis[zodiac] || "✨";
}

function getChineseZodiacEmoji(zodiac: string): string {
    const emojis: { [key: string]: string } = {
        Rat: "🐀",
        Ox: "🐂",
        Tiger: "🐅",
        Rabbit: "🐇",
        Dragon: "🐉",
        Snake: "🐍",
        Horse: "🐎",
        Goat: "🐐",
        Monkey: "🐒",
        Rooster: "🐓",
        Dog: "🐕",
        Pig: "🐖",
    };
    return emojis[zodiac] || "🐾";
}

function getSeasonEmoji(season: string): string {
    const emojis: { [key: string]: string } = {
        Winter: "⛄️",
        Spring: "🌷",
        Summer: "☀️",
        Autumn: "🍂",
    };
    return emojis[season] || "🌍";
}

const scene = createScene({
    steps: [datetime],
    handler: async (answers) => {
        const stats = getBirthdayStats(answers.birthday);

        const body = [
            ["🎂 Age", `${stats.age} years old`],
            [
                "📅 Next Birthday",
                `${stats.nextBirthday.daysUntil} days (${stats.nextBirthday.date.toLocaleDateString()})`,
            ],
            ["♈ Zodiac Sign", `${stats.zodiacSign} ${getZodiacEmoji(stats.zodiacSign)}`],
            ["🐉 Chinese Zodiac", `${stats.chineseZodiac} ${getChineseZodiacEmoji(stats.chineseZodiac)}`],
            ["📆 Day of Week", stats.dayOfWeek],
            ["🎯 Born in Leap Year", stats.isLeapYear ? "Yes" : "No"],
            ["🌤️ Season", `${stats.season} ${getSeasonEmoji(stats.season)}`],
            ["👥 Generation", stats.generation],
            ["📊 Days Lived", `${stats.interestingFacts.daysLived.toLocaleString()}`],
            ["📈 Months Lived", `${stats.interestingFacts.monthsLived.toLocaleString()}`],
            ["⏱️ Weeks Lived", `${stats.interestingFacts.weeksLived.toLocaleString()}`],
            ["⏰ Hours Lived", `${stats.interestingFacts.hoursLived.toLocaleString()}`],
            ["🎯 Life Milestone (1/4)", `${stats.lifeMilestones.quarterLife.toLocaleDateString()}`],
            ["🎯 Life Milestone (1/3)", `${stats.lifeMilestones.thirdLife.toLocaleDateString()}`],
            ["🎯 Life Milestone (1/2)", `${stats.lifeMilestones.halfLife.toLocaleDateString()}`],
            ["🎉 Is Today", stats.isToday ? "Yes - Happy Birthday! 🎉🎂🥳" : "No"],
        ];

        return { type: "table", content: { head: [], body } };
    },
});

export const birthdayStats = { command, scene };
