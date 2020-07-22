const foods = ["banaan", "appel", "peer", "sinaasappel", "meloen", "taart", "worst", "snoep"];
const colors = ["groen", "geel", "rood", "blauw", "paars", "oranje", "roze", "zwart", "wit"];
const shapes = ["cirkel", "vierkant", "driehoek"];
const nature = ["koe", "kat", "hond", "kip", "vis", "boom"];

exports.generateSecretSpell = () => {
    let food = foods[Math.floor(Math.random() * foods.length)];
    let color = colors[Math.floor(Math.random() * colors.length)];
    let shape = shapes[Math.floor(Math.random() * shapes.length)];
    let natureWord = nature[Math.floor(Math.random() * nature.length)];

    return `${food} ${color} ${shape} ${natureWord}`;
}

function generateSecretSpell() {
    let food = foods[Math.floor(Math.random() * foods.length)];
    let color = colors[Math.floor(Math.random() * colors.length)];
    let shape = shapes[Math.floor(Math.random() * shapes.length)];
    let natureWord = nature[Math.floor(Math.random() * nature.length)];

    return `${food} ${color} ${shape} ${natureWord}`;
}

exports.generateMultipleSecretSpells = () => {
    let secretSpellArray = [];
    // Hard limit is 1296 combinations with the current secret spell word parts! Takes long time with random implementation however.
    let amountOfEntries = 100;

    while (secretSpellArray.length !== amountOfEntries) {
        const secretSpell = generateSecretSpell();
        if (!secretSpellArray.includes(secretSpell)) {
            secretSpellArray.push(secretSpell);
        }
    }

    return secretSpellArray;
}