const foods = ["banaan", "appel", "peer", "sinaasappel", "meloen", "taart", "worst", "snoep", "boter", "kaas"];
const colors = ["groen", "geel", "rood", "blauw", "paars", "oranje", "roze", "zwart", "wit"];
const shapes = ["cirkel", "vierkant", "driehoek", "hand", "duim", "pink", "been", "knie", "voet", "teen", "nek",
    "baard", "kaal", "snor", "rond", "plat", "bol", "lijn", "punt", "streep", "stip", "vlak"];
const nature = ["koe", "kat", "hond", "kip", "vis", "boom", "jongen", "meisje", "oor", "neus", "vlieg", "spin", "mug",
    "mier", "vlinder", "koe", "kalf", "geit", "bok", "schaap", "paard"];

exports.generateSecretSpell = () => {
    let food = foods[Math.floor(Math.random() * foods.length)];
    let color = colors[Math.floor(Math.random() * colors.length)];
    let shape = shapes[Math.floor(Math.random() * shapes.length)];
    let natureWord = nature[Math.floor(Math.random() * nature.length)];

    return `${food} ${color} ${shape} ${natureWord}`;
}