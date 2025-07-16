const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const categories = {
  // 🌍 General & Everyday
  Fruits: [
    "apple",
    "banana",
    "orange",
    "mango",
    "strawberry",
    "grape",
    "pineapple",
    "watermelon",
    "peach",
    "pear",
    "cherry",
    "plum",
    "kiwi",
    "lemon",
    "lime",
    "coconut",
    "papaya",
    "blueberry",
    "raspberry",
    "blackberry",
  ],
  Vegetables: [
    "carrot",
    "broccoli",
    "spinach",
    "potato",
    "tomato",
    "onion",
    "lettuce",
    "cucumber",
    "celery",
    "pepper",
    "corn",
    "peas",
    "beans",
    "cauliflower",
    "cabbage",
    "zucchini",
    "eggplant",
    "radish",
    "beet",
    "asparagus",
  ],
  Animals: [
    "dog",
    "cat",
    "lion",
    "elephant",
    "tiger",
    "horse",
    "rabbit",
    "bear",
    "wolf",
    "fox",
    "deer",
    "sheep",
    "cow",
    "pig",
    "chicken",
    "duck",
    "goose",
    "fish",
    "bird",
    "mouse",
  ],
  Colors: [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "black",
    "white",
    "brown",
    "gray",
    "silver",
    "gold",
    "violet",
    "turquoise",
    "maroon",
    "navy",
    "lime",
    "coral",
    "magenta",
  ],
  "Body Parts": [
    "hand",
    "foot",
    "head",
    "arm",
    "leg",
    "eye",
    "nose",
    "mouth",
    "ear",
    "finger",
    "toe",
    "shoulder",
    "knee",
    "elbow",
    "wrist",
    "ankle",
    "neck",
    "back",
    "chest",
    "stomach",
  ],
  Clothing: [
    "shirt",
    "pants",
    "dress",
    "shoes",
    "hat",
    "jacket",
    "socks",
    "tie",
    "sweater",
    "jeans",
    "shorts",
    "skirt",
    "blouse",
    "coat",
    "boots",
    "sneakers",
    "scarf",
    "gloves",
    "belt",
    "underwear",
  ],
  Weather: [
    "sunny",
    "rainy",
    "cloudy",
    "snowy",
    "windy",
    "stormy",
    "foggy",
    "humid",
    "hot",
    "cold",
    "warm",
    "cool",
    "freezing",
    "icy",
    "mild",
    "drizzling",
    "thundering",
    "hailing",
    "misty",
    "clear",
  ],
  Emotions: [
    "happy",
    "sad",
    "angry",
    "excited",
    "nervous",
    "calm",
    "confused",
    "surprised",
    "joyful",
    "worried",
    "scared",
    "proud",
    "embarrassed",
    "grateful",
    "jealous",
    "lonely",
    "tired",
    "energetic",
    "peaceful",
    "frustrated",
  ],
  Hobbies: [
    "reading",
    "painting",
    "cooking",
    "gardening",
    "photography",
    "dancing",
    "singing",
    "writing",
    "drawing",
    "running",
    "swimming",
    "hiking",
    "fishing",
    "knitting",
    "cycling",
    "gaming",
    "traveling",
    "collecting",
    "playing music",
    "crafting",
  ],
  Occupations: [
    "doctor",
    "teacher",
    "engineer",
    "chef",
    "artist",
    "lawyer",
    "nurse",
    "pilot",
    "firefighter",
    "police officer",
    "dentist",
    "mechanic",
    "plumber",
    "electrician",
    "carpenter",
    "accountant",
    "pharmacist",
    "librarian",
    "scientist",
    "programmer",
  ],
  "Household Items": [
    "lamp",
    "chair",
    "table",
    "mirror",
    "clock",
    "pillow",
    "blanket",
    "vase",
    "curtains",
    "carpet",
    "television",
    "sofa",
    "bookshelf",
    "picture frame",
    "candle",
    "plant",
    "doorbell",
    "vacuum cleaner",
    "iron",
    "fan",
  ],
  "School Supplies": [
    "pencil",
    "eraser",
    "notebook",
    "ruler",
    "scissors",
    "glue",
    "marker",
    "calculator",
    "pen",
    "highlighter",
    "stapler",
    "paper",
    "binder",
    "folder",
    "tape",
    "crayons",
    "compass",
    "protractor",
    "backpack",
    "lunch box",
  ],
  Appliances: [
    "refrigerator",
    "microwave",
    "oven",
    "washing machine",
    "dishwasher",
    "vacuum",
    "toaster",
    "blender",
    "coffee maker",
    "air conditioner",
    "heater",
    "fan",
    "iron",
    "hair dryer",
    "mixer",
    "juicer",
    "rice cooker",
    "slow cooker",
    "food processor",
    "garbage disposal",
  ],
  Tools: [
    "hammer",
    "screwdriver",
    "wrench",
    "drill",
    "saw",
    "pliers",
    "level",
    "measuring tape",
    "chisel",
    "file",
    "sandpaper",
    "screws",
    "nails",
    "ladder",
    "toolbox",
    "utility knife",
    "clamp",
    "socket wrench",
    "wire cutters",
    "allen wrench",
  ],

  // 🧠 Knowledge & Trivia
  "Capital Cities": [
    "paris",
    "london",
    "tokyo",
    "washington",
    "berlin",
    "rome",
    "madrid",
    "ottawa",
    "beijing",
    "moscow",
    "cairo",
    "new delhi",
    "canberra",
    "brasilia",
    "seoul",
    "athens",
    "stockholm",
    "oslo",
    "dublin",
    "vienna",
  ],
  Countries: [
    "france",
    "germany",
    "japan",
    "brazil",
    "australia",
    "canada",
    "mexico",
    "india",
    "china",
    "russia",
    "italy",
    "spain",
    "england",
    "norway",
    "sweden",
    "portugal",
    "argentina",
    "chile",
    "egypt",
    "south africa",
  ],
  Continents: [
    "asia",
    "africa",
    "europe",
    "north america",
    "south america",
    "antarctica",
    "oceania",
    "australia",
    "eurasia",
    "americas",
  ],
  "World Landmarks": [
    "eiffel tower",
    "great wall",
    "pyramid",
    "statue of liberty",
    "big ben",
    "taj mahal",
    "colosseum",
    "machu picchu",
    "mount rushmore",
    "stonehenge",
    "christ the redeemer",
    "sydney opera house",
    "golden gate bridge",
    "tower bridge",
    "petra",
    "angkor wat",
    "leaning tower",
    "kremlin",
    "acropolis",
    "mount fuji",
  ],
  Currencies: [
    "dollar",
    "euro",
    "yen",
    "pound",
    "peso",
    "rupee",
    "yuan",
    "franc",
  ],
  Languages: [
    "english",
    "spanish",
    "french",
    "german",
    "chinese",
    "japanese",
    "arabic",
    "hindi",
  ],
  "Famous Scientists": [
    "einstein",
    "newton",
    "darwin",
    "curie",
    "galileo",
    "tesla",
    "hawking",
    "pasteur",
  ],
  Inventions: [
    "telephone",
    "computer",
    "airplane",
    "television",
    "internet",
    "automobile",
    "camera",
    "radio",
  ],
  Planets: [
    "mercury",
    "venus",
    "earth",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
  ],

  // 💻 Tech & Gaming
  "Programming Languages": [
    "javascript",
    "python",
    "java",
    "cpp",
    "html",
    "css",
    "php",
    "ruby",
  ],
  "Operating Systems": [
    "windows",
    "macos",
    "linux",
    "android",
    "ios",
    "ubuntu",
    "chrome os",
    "unix",
  ],
  "Software Tools": [
    "photoshop",
    "excel",
    "word",
    "powerpoint",
    "illustrator",
    "discord",
    "slack",
    "zoom",
  ],
  "Video Game Consoles": [
    "playstation",
    "xbox",
    "nintendo",
    "switch",
    "steam deck",
    "gameboy",
    "psp",
    "vita",
  ],
  "Video Game Characters": [
    "mario",
    "sonic",
    "link",
    "pikachu",
    "kratos",
    "master chief",
    "lara croft",
    "pac-man",
  ],
  "Famous Video Games": [
    "minecraft",
    "fortnite",
    "pokemon",
    "zelda",
    "mario",
    "tetris",
    "pac-man",
    "street fighter",
  ],
  "Gaming Genres": [
    "rpg",
    "fps",
    "strategy",
    "puzzle",
    "racing",
    "fighting",
    "platform",
    "simulation",
  ],

  // 🎬 Entertainment
  "Movie Genres": [
    "comedy",
    "drama",
    "action",
    "horror",
    "romance",
    "thriller",
    "documentary",
    "animation",
  ],
  "Movie Characters": [
    "batman",
    "superman",
    "spiderman",
    "ironman",
    "darth vader",
    "luke skywalker",
    "harry potter",
    "gandalf",
  ],
  Directors: [
    "spielberg",
    "tarantino",
    "nolan",
    "scorsese",
    "kubrick",
    "hitchcock",
    "lucas",
    "cameron",
  ],
  "TV Shows": [
    "friends",
    "breaking bad",
    "game of thrones",
    "the office",
    "stranger things",
    "simpsons",
    "seinfeld",
    "lost",
  ],
  "Music Genres": [
    "rock",
    "pop",
    "jazz",
    "classical",
    "hip hop",
    "country",
    "electronic",
    "reggae",
  ],
  "Musical Instruments": [
    "guitar",
    "piano",
    "violin",
    "drums",
    "flute",
    "trumpet",
    "saxophone",
    "bass",
  ],
  "Famous Singers": [
    "elvis",
    "madonna",
    "michael jackson",
    "beyonce",
    "beatles",
    "queen",
    "bob dylan",
    "adele",
  ],

  // 🍟 Food & Drink
  Beverages: [
    "coffee",
    "tea",
    "water",
    "juice",
    "soda",
    "beer",
    "wine",
    "milk",
    "smoothie",
    "lemonade",
    "hot chocolate",
    "energy drink",
    "sports drink",
    "iced tea",
    "cocktail",
    "mocktail",
    "kombucha",
    "coconut water",
    "sparkling water",
    "milkshake",
  ],
  Desserts: [
    "cake",
    "ice cream",
    "chocolate",
    "cookies",
    "pie",
    "pudding",
    "donut",
    "candy",
    "brownie",
    "cheesecake",
    "cupcake",
    "muffin",
    "tart",
    "gelato",
    "sorbet",
    "fudge",
    "caramel",
    "tiramisu",
    "mousse",
    "parfait",
  ],
  "Fast Food Chains": [
    "mcdonalds",
    "burger king",
    "kfc",
    "subway",
    "pizza hut",
    "taco bell",
    "dominos",
    "wendys",
  ],
  Dishes: [
    "pizza",
    "burger",
    "pasta",
    "sushi",
    "tacos",
    "soup",
    "salad",
    "sandwich",
  ],
  Snacks: [
    "chips",
    "crackers",
    "nuts",
    "popcorn",
    "pretzels",
    "granola bar",
    "trail mix",
    "jerky",
  ],
  "Baked Goods": [
    "bread",
    "muffin",
    "croissant",
    "bagel",
    "biscuit",
    "roll",
    "pretzel",
    "danish",
  ],

  // 🚗 Brands & Products
  "Car Brands": [
    "toyota",
    "honda",
    "ford",
    "bmw",
    "mercedes",
    "audi",
    "volkswagen",
    "tesla",
  ],
  "Tech Companies": [
    "apple",
    "google",
    "microsoft",
    "amazon",
    "facebook",
    "netflix",
    "uber",
    "tesla",
  ],
  "Phone Brands": [
    "iphone",
    "samsung",
    "google pixel",
    "oneplus",
    "huawei",
    "xiaomi",
    "nokia",
    "sony",
  ],
  "Clothing Brands": [
    "nike",
    "adidas",
    "zara",
    "h&m",
    "gucci",
    "prada",
    "levis",
    "uniqlo",
  ],
  "Social Media Platforms": [
    "facebook",
    "instagram",
    "twitter",
    "tiktok",
    "youtube",
    "linkedin",
    "snapchat",
    "reddit",
  ],

  // 📚 Academic & School
  "School Subjects": [
    "math",
    "science",
    "english",
    "history",
    "geography",
    "art",
    "music",
    "pe",
  ],
  "Science Terms": [
    "molecule",
    "atom",
    "gravity",
    "evolution",
    "photosynthesis",
    "ecosystem",
    "energy",
    "matter",
  ],
  "Chemistry Elements": [
    "hydrogen",
    "oxygen",
    "carbon",
    "nitrogen",
    "iron",
    "gold",
    "silver",
    "copper",
  ],
  "Famous Books": [
    "harry potter",
    "lord of the rings",
    "pride and prejudice",
    "1984",
    "to kill a mockingbird",
    "gatsby",
    "hamlet",
    "odyssey",
  ],
  Authors: [
    "shakespeare",
    "tolkien",
    "rowling",
    "hemingway",
    "dickens",
    "austen",
    "orwell",
    "twain",
  ],

  // 🌐 Pop Culture
  Superheroes: [
    "superman",
    "batman",
    "spiderman",
    "wonder woman",
    "hulk",
    "thor",
    "captain america",
    "flash",
  ],
  "Marvel Characters": [
    "ironman",
    "captain america",
    "thor",
    "hulk",
    "black widow",
    "hawkeye",
    "spiderman",
    "wolverine",
  ],
  "Star Wars Characters": [
    "luke skywalker",
    "darth vader",
    "princess leia",
    "han solo",
    "yoda",
    "obi-wan",
    "chewbacca",
    "r2-d2",
  ],
  Pokemon: [
    "pikachu",
    "charizard",
    "blastoise",
    "venusaur",
    "mewtwo",
    "mew",
    "lucario",
    "garchomp",
  ],
  "Anime Characters": [
    "goku",
    "naruto",
    "luffy",
    "ichigo",
    "natsu",
    "light",
    "edward",
    "saitama",
  ],

  // 🏀 Sports & Outdoors
  Sports: [
    "football",
    "basketball",
    "baseball",
    "soccer",
    "tennis",
    "golf",
    "swimming",
    "boxing",
    "volleyball",
    "hockey",
    "cricket",
    "badminton",
    "rugby",
    "wrestling",
    "track and field",
    "gymnastics",
    "skiing",
    "snowboarding",
    "surfing",
    "cycling",
  ],
  "Olympic Events": [
    "swimming",
    "gymnastics",
    "track and field",
    "diving",
    "cycling",
    "rowing",
    "weightlifting",
    "archery",
    "fencing",
    "boxing",
    "wrestling",
    "judo",
    "taekwondo",
    "sailing",
    "shooting",
    "equestrian",
    "triathlon",
    "marathon",
    "pole vault",
    "javelin",
  ],
  Athletes: [
    "jordan",
    "brady",
    "messi",
    "lebron",
    "tiger woods",
    "serena",
    "usain bolt",
    "phelps",
  ],
  "Board Games": [
    "chess",
    "checkers",
    "monopoly",
    "scrabble",
    "risk",
    "clue",
    "backgammon",
    "connect four",
  ],

  // 🏠 Places & Objects
  "Rooms in a House": [
    "kitchen",
    "bedroom",
    "bathroom",
    "living room",
    "dining room",
    "garage",
    "basement",
    "attic",
  ],
  "Things in a Kitchen": [
    "stove",
    "refrigerator",
    "sink",
    "microwave",
    "toaster",
    "blender",
    "knife",
    "cutting board",
  ],
  Furniture: [
    "sofa",
    "chair",
    "table",
    "bed",
    "dresser",
    "bookshelf",
    "desk",
    "cabinet",
  ],
  Transportation: [
    "car",
    "bus",
    "train",
    "airplane",
    "bicycle",
    "motorcycle",
    "boat",
    "subway",
    "taxi",
    "truck",
    "van",
    "helicopter",
    "ship",
    "scooter",
    "skateboard",
    "tram",
    "ferry",
    "yacht",
    "limousine",
    "ambulance",
  ],
};

const getImposterWord = (targetWord) => {
  const variants = {
    // Fruits - more closely related variants
    apple: ["pear", "peach", "plum", "apricot"],
    banana: ["plantain", "mango", "papaya", "kiwi"],
    orange: ["tangerine", "mandarin", "clementine", "grapefruit"],
    mango: ["papaya", "peach", "apricot", "nectarine"],
    strawberry: ["raspberry", "blueberry", "blackberry", "cranberry"],
    grape: ["raisin", "berry", "cherry", "currant"],
    pineapple: ["coconut", "papaya", "mango", "passion fruit"],
    watermelon: ["cantaloupe", "honeydew", "melon", "papaya"],
    peach: ["nectarine", "apricot", "plum", "cherry"],
    pear: ["apple", "quince", "peach", "plum"],
    cherry: ["berry", "grape", "plum", "cranberry"],
    plum: ["prune", "apricot", "peach", "cherry"],
    kiwi: ["lime", "green apple", "gooseberry", "grape"],
    lemon: ["lime", "citrus", "grapefruit", "orange"],
    lime: ["lemon", "citrus", "kiwi", "green apple"],
    coconut: ["palm fruit", "tropical fruit", "pineapple", "mango"],
    papaya: ["mango", "cantaloupe", "peach", "apricot"],
    blueberry: ["blackberry", "raspberry", "huckleberry", "cranberry"],
    raspberry: ["blackberry", "strawberry", "blueberry", "cranberry"],
    blackberry: ["raspberry", "blueberry", "mulberry", "elderberry"],

    // Vegetables - closely related variants
    carrot: ["parsnip", "turnip", "sweet potato", "radish"],
    broccoli: ["cauliflower", "brussels sprouts", "cabbage", "kale"],
    spinach: ["lettuce", "kale", "arugula", "swiss chard"],
    potato: ["sweet potato", "yam", "turnip", "parsnip"],
    tomato: ["cherry tomato", "bell pepper", "eggplant", "zucchini"],
    onion: ["garlic", "shallot", "leek", "green onion"],
    lettuce: ["spinach", "cabbage", "romaine", "iceberg"],
    cucumber: ["zucchini", "pickle", "squash", "melon"],
    celery: ["asparagus", "green bean", "leek", "fennel"],
    pepper: ["bell pepper", "chili", "jalapeño", "paprika"],
    corn: ["maize", "kernel", "cob", "sweet corn"],
    peas: ["green peas", "snap peas", "beans", "legumes"],
    beans: ["green beans", "peas", "legumes", "lentils"],
    cauliflower: ["broccoli", "cabbage", "brussels sprouts", "kale"],
    cabbage: ["lettuce", "kale", "brussels sprouts", "bok choy"],
    zucchini: ["cucumber", "squash", "eggplant", "gourd"],
    eggplant: ["zucchini", "squash", "bell pepper", "tomato"],
    radish: ["turnip", "beet", "carrot", "daikon"],
    beet: ["radish", "turnip", "red cabbage", "carrot"],
    asparagus: ["green bean", "celery", "leek", "artichoke"],

    // Animals - related species/similar animals
    dog: ["puppy", "wolf", "fox", "coyote"],
    cat: ["kitten", "lynx", "bobcat", "tiger"],
    lion: ["tiger", "leopard", "cheetah", "panther"],
    elephant: ["mammoth", "rhino", "hippo", "buffalo"],
    tiger: ["lion", "leopard", "cheetah", "jaguar"],
    horse: ["pony", "stallion", "mare", "zebra"],
    rabbit: ["bunny", "hare", "guinea pig", "hamster"],
    bear: ["panda", "polar bear", "grizzly", "teddy bear"],
    wolf: ["dog", "coyote", "fox", "husky"],
    fox: ["wolf", "coyote", "red fox", "arctic fox"],
    deer: ["elk", "moose", "reindeer", "antelope"],
    sheep: ["lamb", "goat", "ram", "ewe"],
    cow: ["bull", "calf", "buffalo", "ox"],
    pig: ["hog", "boar", "piglet", "swine"],
    chicken: ["hen", "rooster", "chick", "poultry"],
    duck: ["goose", "swan", "mallard", "drake"],
    goose: ["duck", "swan", "gander", "gosling"],
    fish: ["salmon", "trout", "bass", "tuna"],
    bird: ["robin", "sparrow", "eagle", "hawk"],
    mouse: ["rat", "hamster", "gerbil", "rodent"],

    // Colors - similar shades and tones
    red: ["crimson", "scarlet", "cherry", "ruby"],
    blue: ["navy", "azure", "cobalt", "sapphire"],
    green: ["emerald", "lime", "forest green", "jade"],
    yellow: ["gold", "amber", "lemon", "canary"],
    purple: ["violet", "lavender", "plum", "indigo"],
    orange: ["tangerine", "peach", "coral", "amber"],
    pink: ["rose", "salmon", "magenta", "fuchsia"],
    black: ["charcoal", "ebony", "midnight", "onyx"],
    white: ["ivory", "cream", "pearl", "snow"],
    brown: ["tan", "beige", "chocolate", "coffee"],
    gray: ["silver", "ash", "charcoal", "slate"],
    silver: ["gray", "platinum", "chrome", "metallic"],
    gold: ["yellow", "bronze", "brass", "amber"],
    violet: ["purple", "lavender", "indigo", "plum"],
    turquoise: ["teal", "aqua", "cyan", "blue-green"],
    maroon: ["burgundy", "wine", "dark red", "crimson"],
    navy: ["dark blue", "midnight blue", "royal blue", "cobalt"],
    lime: ["green", "yellow-green", "chartreuse", "neon green"],
    coral: ["pink", "salmon", "peach", "orange"],
    magenta: ["pink", "fuchsia", "purple", "hot pink"],

    // Body Parts - related or adjacent parts
    hand: ["palm", "fist", "fingers", "wrist"],
    foot: ["toe", "heel", "ankle", "sole"],
    head: ["skull", "face", "brain", "forehead"],
    arm: ["forearm", "elbow", "shoulder", "wrist"],
    leg: ["thigh", "knee", "shin", "calf"],
    eye: ["eyeball", "pupil", "iris", "eyelid"],
    nose: ["nostril", "snout", "bridge", "tip"],
    mouth: ["lips", "tongue", "teeth", "jaw"],
    ear: ["earlobe", "hearing", "earring", "eardrum"],
    finger: ["thumb", "digit", "knuckle", "nail"],
    toe: ["big toe", "toenail", "digit", "pinky toe"],
    shoulder: ["arm", "blade", "joint", "socket"],
    knee: ["kneecap", "joint", "leg", "patella"],
    elbow: ["joint", "arm", "funny bone", "bend"],
    wrist: ["hand", "joint", "forearm", "palm"],
    ankle: ["foot", "joint", "heel", "leg"],
    neck: ["throat", "nape", "collar", "cervical"],
    back: ["spine", "backbone", "rear", "posterior"],
    chest: ["breast", "ribcage", "torso", "pectoral"],
    stomach: ["belly", "abdomen", "tummy", "gut"],

    // More variants for expanded categories...
    // Technology
    computer: ["laptop", "desktop", "pc", "tablet"],
    phone: ["smartphone", "mobile", "cell phone", "device"],
    internet: ["web", "network", "wifi", "online"],
    television: ["tv", "monitor", "screen", "display"],
    camera: ["lens", "photo", "video", "recorder"],
    radio: ["stereo", "speaker", "audio", "broadcast"],

    // Transportation
    car: ["automobile", "vehicle", "sedan", "coupe"],
    bus: ["coach", "shuttle", "van", "transit"],
    train: ["locomotive", "subway", "metro", "rail"],
    airplane: ["aircraft", "jet", "plane", "flight"],
    bicycle: ["bike", "cycle", "two-wheeler", "pedal"],
    motorcycle: ["motorbike", "bike", "scooter", "chopper"],
    boat: ["ship", "vessel", "yacht", "watercraft"],
    subway: ["metro", "underground", "tube", "rail"],

    // Food basics with more relatable variants
    pizza: ["flatbread", "calzone", "pie", "italian bread"],
    burger: ["sandwich", "patty", "cheeseburger", "slider"],
    pasta: ["noodles", "spaghetti", "macaroni", "linguine"],
    coffee: ["espresso", "latte", "cappuccino", "brew"],
    tea: ["herbal tea", "green tea", "chai", "beverage"],
    sushi: ["roll", "sashimi", "nigiri", "japanese food"],
    tacos: ["burrito", "wrap", "quesadilla", "mexican food"],
    soup: ["broth", "stew", "bisque", "chowder"],
    salad: ["greens", "caesar", "garden", "vegetables"],
    sandwich: ["sub", "hoagie", "panini", "club"],

    // Sports with related variants
    football: ["american football", "gridiron", "nfl", "pigskin"],
    basketball: ["hoops", "b-ball", "court game", "dribble"],
    baseball: ["softball", "hardball", "diamond", "america's pastime"],
    soccer: ["football", "futbol", "pitch", "world cup"],
    tennis: ["racquet", "court", "serve", "wimbledon"],
    golf: ["putting", "driving", "course", "clubs"],
    swimming: ["pool", "stroke", "lap", "diving"],
    boxing: ["fighting", "punching", "ring", "gloves"],
  };

  // If we have a specific variant, use it
  if (variants[targetWord]) {
    return variants[targetWord][
      Math.floor(Math.random() * variants[targetWord].length)
    ];
  }

  // Find what category this word belongs to and get a different word from the same category
  for (const [categoryName, words] of Object.entries(categories)) {
    if (words.includes(targetWord)) {
      const otherWords = words.filter((word) => word !== targetWord);
      if (otherWords.length > 0) {
        return otherWords[Math.floor(Math.random() * otherWords.length)];
      }
    }
  }

  // Last resort: return a generic similar word
  return "similar to " + targetWord;
};

const app = express();
app.use(cors());

// Serve static files from public directory
app.use(express.static("public"));

// Basic route for health check
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = {};

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Security function to validate host permissions
function validateHostPermission(socket, room, requireOriginalHost = false) {
  if (!room) return { valid: false, error: "Room not found" };

  // Basic host check
  if (socket.id !== room.hostId) {
    return { valid: false, error: "Only the host can perform this action" };
  }

  // For critical actions during active games, require original host
  if (requireOriginalHost && room.game && socket.id !== room.originalHostId) {
    return {
      valid: false,
      error:
        "Only the original room creator can perform this action during an active game",
    };
  }

  return { valid: true };
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("createRoom", (name, callback) => {
    if (!name || name.trim() === "") {
      return callback({ error: "Name is required" });
    }

    const roomCode = generateRoomCode();
    rooms[roomCode] = {
      hostId: socket.id,
      originalHostId: socket.id, // Track the original room creator
      players: [{ id: socket.id, name }],
      game: null,
    };

    socket.join(roomCode);
    console.log(`Room ${roomCode} created by ${name}`);

    callback({
      roomCode,
      players: rooms[roomCode].players,
      hostId: socket.id,
      isOriginalHost: true, // Mark the creator as original host
    });

    io.to(roomCode).emit("playerListUpdate", rooms[roomCode].players);
    io.to(roomCode).emit("hostId", socket.id);
  });

  socket.on("joinRoom", ({ roomCode, name }, callback) => {
    if (!roomCode || !name) {
      return callback({ error: "Room code and name are required" });
    }

    const room = rooms[roomCode];
    if (!room) {
      return callback({ error: "Room not found" });
    }

    if (room.players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      return callback({ error: "Name already taken" });
    }

    room.players.push({ id: socket.id, name });
    socket.join(roomCode);

    callback({
      success: true,
      players: room.players,
      hostId: room.hostId,
      isOriginalHost: socket.id === room.originalHostId, // Let client know if they're the original host
    });

    io.to(roomCode).emit("playerListUpdate", room.players);
    console.log(`${name} joined room ${roomCode}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Find and remove the player from any room they were in
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const playerIndex = room.players.findIndex((p) => p.id === socket.id);

      if (playerIndex !== -1) {
        const playerName = room.players[playerIndex].name;
        room.players.splice(playerIndex, 1);

        if (room.players.length === 0) {
          // No players left, remove the room
          delete rooms[roomCode];
          console.log(`Room ${roomCode} closed (no players left)`);
        } else {
          // If host left and there's no active game, assign new host
          // If there's an active game, only allow host transfer if the original host is available
          if (socket.id === room.hostId) {
            if (!room.game) {
              // No active game - transfer to next player
              room.hostId = room.players[0].id;
              io.to(roomCode).emit("hostId", room.hostId);
              console.log(
                `New host assigned in room ${roomCode}: ${room.players[0].name}`
              );
            } else {
              // Game is active - only transfer if original host is still available
              const originalHostPlayer = room.players.find(
                (p) => p.id === room.originalHostId
              );
              if (originalHostPlayer && originalHostPlayer.id !== socket.id) {
                room.hostId = room.originalHostId;
                io.to(roomCode).emit("hostId", room.hostId);
                console.log(
                  `Original host restored in room ${roomCode}: ${originalHostPlayer.name}`
                );
              } else {
                // Original host is the one leaving - end the game and close room
                io.to(roomCode).emit("gameEnded", {
                  reason: "Host left the game",
                  imposterName: "Game ended",
                  word: room.game?.targetWord || "Unknown",
                  hostExcluded: room.game?.hostExcluded || false,
                });
                room.game = null;
                room.hostId = room.players[0].id; // Assign new host for lobby
                io.to(roomCode).emit("hostId", room.hostId);
                console.log(
                  `Game ended due to original host leaving room ${roomCode}`
                );
              }
            }
          } else if (room.game && room.game.playingPlayers) {
            // Check if a playing player left during an active game
            if (room.game.playingPlayers.includes(socket.id)) {
              // Remove the player from playing players list
              room.game.playingPlayers = room.game.playingPlayers.filter(
                (id) => id !== socket.id
              );

              // If too few playing players remain, end the game
              if (room.game.playingPlayers.length < 2) {
                io.to(roomCode).emit("gameEnded", {
                  reason: "Not enough players remaining",
                  imposterName: "Game ended",
                  word: room.game?.targetWord || "Unknown",
                  hostExcluded: room.game?.hostExcluded || false,
                });
                room.game = null;
                console.log(
                  `Game ended in room ${roomCode} due to insufficient players`
                );
              }
            }
          }

          io.to(roomCode).emit("playerListUpdate", room.players);
          console.log(`${playerName} left room ${roomCode}`);
        }
        break;
      }
    }
  });

  socket.on(
    "startGame",
    (
      {
        roomCode,
        category,
        wordSource,
        customWord,
        customImposterWord,
        imposterGetsWord,
        discussionTime,
        votingTime,
      },
      callback
    ) => {
      const room = rooms[roomCode];
      const validation = validateHostPermission(socket, room, true); // Require original host for game start

      if (!validation.valid) {
        return callback?.({ error: validation.error });
      }

      if (
        wordSource === "custom" &&
        (!customWord ||
          customWord.trim() === "" ||
          !customImposterWord ||
          customImposterWord.trim() === "")
      ) {
        return callback?.({ error: "Please enter both custom words" });
      }

      let targetWord;
      let impostorWord;
      let playingPlayers;
      let hostExcluded = false;

      if (wordSource === "custom") {
        targetWord = customWord.toLowerCase();
        impostorWord = customImposterWord.toLowerCase();
        // Exclude host from playing when using custom words since they know both words
        playingPlayers = room.players.filter(
          (player) => player.id !== room.hostId
        );
        hostExcluded = true;

        // Check if there are enough players to play (need at least 2 players excluding host)
        if (playingPlayers.length < 2) {
          return callback?.({
            error:
              "Need at least 2 players (excluding host) to start a custom word game",
          });
        }
      } else if (category === "random") {
        const allWords = Object.values(categories).flat();
        targetWord = allWords[Math.floor(Math.random() * allWords.length)];
        impostorWord = getImposterWord(targetWord);
        playingPlayers = room.players; // Host can play in random/category games
      } else {
        console.log("Looking for category:", category);
        console.log("Available categories:", Object.keys(categories));
        const wordList = categories[category];
        console.log("Found wordList:", wordList);
        if (!wordList) {
          return callback?.({ error: "Invalid category" });
        }
        targetWord = wordList[Math.floor(Math.random() * wordList.length)];
        impostorWord = getImposterWord(targetWord);
        playingPlayers = room.players; // Host can play in random/category games
      }

      const imposterIndex = Math.floor(Math.random() * playingPlayers.length);

      room.game = {
        targetWord,
        impostorWord,
        category,
        imposterId: playingPlayers[imposterIndex].id,
        hostExcluded: hostExcluded,
        playingPlayers: playingPlayers.map((p) => p.id), // Store IDs of players actually playing
        eliminatedPlayers: [], // Track eliminated players
        imposterGetsWord: imposterGetsWord !== false, // Default to true if not specified
        discussionTime: discussionTime || 120, // Default to 120 seconds if not specified
        votingTime: votingTime || 60, // Default to 60 seconds if not specified
        phase: "starting", // Track game phase: starting, playing, voting, finalVoting
        votes: {}, // Store player votes
        finalVotes: {}, // Store final votes (continue/end game)
      };

      let countdown = 5;
      io.to(roomCode).emit("countdown", { seconds: countdown });

      const countdownInterval = setInterval(() => {
        countdown -= 1;
        if (countdown > 0) {
          io.to(roomCode).emit("countdown", { seconds: countdown });
        } else {
          clearInterval(countdownInterval);

          // Send role assignments only to playing players
          playingPlayers.forEach((player) => {
            const isImposter = player.id === room.game.imposterId;
            let word;

            if (isImposter) {
              // If imposterGetsWord is false, imposter gets no word (empty string)
              // If imposterGetsWord is true (default), imposter gets the imposter word
              word = room.game.imposterGetsWord ? room.game.impostorWord : "";
            } else {
              // Regular players always get the target word
              word = room.game.targetWord;
            }

            io.to(player.id).emit("roleAssigned", {
              role: isImposter ? "imposter" : "player",
              word: word,
            });
          });

          // If host is excluded, send them a special message
          if (hostExcluded) {
            io.to(room.hostId).emit("roleAssigned", {
              role: "moderator",
              word: null,
              targetWord: targetWord,
              impostorWord: impostorWord,
              message:
                "You are moderating this game. You know both words and cannot participate as a player.",
            });
          }

          io.to(roomCode).emit("gameStarted", {
            hostExcluded: hostExcluded,
            playingPlayerCount: playingPlayers.length,
          });

          // Start discussion countdown after a delay
          setTimeout(() => {
            if (room.game) {
              // Set phase to playing when discussion starts
              room.game.phase = "playing";

              let discussionCountdown = room.game.discussionTime;
              io.to(roomCode).emit("discussionCountdown", {
                seconds: discussionCountdown,
              });

              const discussionInterval = setInterval(() => {
                discussionCountdown -= 1;
                if (discussionCountdown > 0) {
                  io.to(roomCode).emit("discussionCountdown", {
                    seconds: discussionCountdown,
                  });
                } else {
                  clearInterval(discussionInterval);
                  // Discussion time is over - emit "discussionEnded" and start voting
                  io.to(roomCode).emit("discussionEnded");

                  // Start voting countdown
                  setTimeout(() => {
                    if (room.game) {
                      // Set phase to voting
                      room.game.phase = "voting";

                      let votingCountdown = room.game.votingTime;
                      io.to(roomCode).emit("votingCountdown", {
                        seconds: votingCountdown,
                      });

                      const votingInterval = setInterval(() => {
                        votingCountdown -= 1;
                        if (votingCountdown > 0) {
                          io.to(roomCode).emit("votingCountdown", {
                            seconds: votingCountdown,
                          });
                        } else {
                          clearInterval(votingInterval);
                          // Voting time is over - emit voting results and start final vote
                          handleVotingResults(roomCode);
                        }
                      }, 1000);
                    }
                  }, 1000); // 1 second delay between discussion and voting
                }
              }, 1000);
            }
          }, 3000); // Start discussion countdown 3 seconds after game starts
        }
      }, 1000);
    }
  );

  socket.on("updateTimers", ({ roomCode, discussionTime, votingTime }) => {
    const room = rooms[roomCode];
    const validation = validateHostPermission(socket, room, true); // Require original host

    if (!validation.valid) {
      return;
    }

    // Broadcast timer update to all other players in the room (excluding the host)
    socket.to(roomCode).emit("timerUpdate", {
      discussionTime,
      votingTime,
    });
  });

  socket.on("updateWordSource", ({ roomCode, wordSource, hostIsModerator }) => {
    const room = rooms[roomCode];
    const validation = validateHostPermission(socket, room, true); // Require original host

    if (!validation.valid) {
      return;
    }

    // Broadcast word source update to all players in the room (including the host)
    io.to(roomCode).emit("wordSourceUpdate", {
      wordSource,
      hostIsModerator,
    });
  });

  // Voting system handlers
  socket.on("submitVote", ({ roomCode, votedPlayerId }, callback) => {
    const room = rooms[roomCode];
    if (!room || !room.game) {
      return callback?.({ error: "Game not found or not active" });
    }

    const voter = room.players.find((p) => p.id === socket.id);
    if (!voter) {
      return callback?.({ error: "You are not in this room" });
    }

    // Check if the voter is eliminated
    const isEliminated = room.game.eliminatedPlayers.some(
      (eliminated) => eliminated.id === socket.id
    );
    if (isEliminated) {
      return callback?.({ error: "You are eliminated and cannot vote" });
    }

    // Check if voting is currently active
    if (room.game.phase !== "voting") {
      return callback?.({ error: "Voting is not currently active" });
    }

    // Initialize votes object if not exists
    if (!room.game.votes) {
      room.game.votes = {};
    }

    // Record the vote (anonymous)
    room.game.votes[socket.id] = votedPlayerId;

    callback?.({ success: true });
  });

  socket.on("submitFinalVote", ({ roomCode, continueGame }, callback) => {
    const room = rooms[roomCode];
    if (!room || !room.game) {
      return callback?.({ error: "Game not found or not active" });
    }

    const voter = room.players.find((p) => p.id === socket.id);
    if (!voter) {
      return callback?.({ error: "You are not in this room" });
    }

    // Check if the voter is eliminated
    const isEliminated = room.game.eliminatedPlayers.some(
      (eliminated) => eliminated.id === socket.id
    );
    if (isEliminated) {
      return callback?.({ error: "You are eliminated and cannot vote" });
    }

    // Check if final voting is currently active
    if (room.game.phase !== "finalVoting") {
      return callback?.({ error: "Final voting is not currently active" });
    }

    // Initialize final votes object if not exists
    if (!room.game.finalVotes) {
      room.game.finalVotes = {};
    }

    // Record the final vote
    room.game.finalVotes[socket.id] = continueGame;

    // Calculate current vote counts
    let continueVotes = 0;
    let endVotes = 0;
    Object.values(room.game.finalVotes).forEach((vote) => {
      if (vote) continueVotes++;
      else endVotes++;
    });

    // Exclude eliminated players from eligible voters
    const playingPlayers = room.game.hostExcluded
      ? room.players.filter((p) => p.id !== room.hostId)
      : room.players;

    const eligibleVoters = playingPlayers.filter(
      (p) =>
        !room.game.eliminatedPlayers.some(
          (eliminated) => eliminated.id === p.id
        )
    );

    // Emit live vote update to all players in the room
    io.to(roomCode).emit("finalVoteUpdate", {
      continueVotes,
      endVotes,
      totalVoters: eligibleVoters.length,
    });

    // Check if all eligible players have voted
    const finalVoteCount = Object.keys(room.game.finalVotes).length;

    if (finalVoteCount >= eligibleVoters.length) {
      // All players have voted, clear the auto-end timeout and process final results
      if (room.game.finalVoteTimeout) {
        clearTimeout(room.game.finalVoteTimeout);
        room.game.finalVoteTimeout = null;
      }

      setTimeout(() => {
        handleFinalVoteResults(roomCode);
      }, 1000);
    }

    callback?.({ success: true });
  });

  // Helper function to handle voting results
  function handleVotingResults(roomCode) {
    const room = rooms[roomCode];
    if (!room || !room.game) return;

    // Calculate vote results
    const voteResults = {};
    const playingPlayers = room.game.hostExcluded
      ? room.players.filter((p) => p.id !== room.hostId)
      : room.players;

    // Initialize vote counts for all playing players
    playingPlayers.forEach((player) => {
      voteResults[player.id] = {
        name: player.name,
        votes: 0,
      };
    });

    // Count votes
    if (room.game.votes) {
      Object.values(room.game.votes).forEach((votedPlayerId) => {
        if (voteResults[votedPlayerId]) {
          voteResults[votedPlayerId].votes++;
        }
      });
    }

    // Find player(s) with most votes
    const maxVotes = Math.max(
      ...Object.values(voteResults).map((r) => r.votes)
    );

    // Only eliminate if there's a clear winner (only one player with max votes)
    // In case of tie, no one gets eliminated
    const playersWithMaxVotes = Object.entries(voteResults).filter(
      ([id, result]) => result.votes === maxVotes && maxVotes > 0
    );

    const eliminatedPlayers =
      playersWithMaxVotes.length === 1
        ? playersWithMaxVotes.map(([id, result]) => ({ id, name: result.name }))
        : []; // No elimination in case of tie

    // Add eliminated players to the game state (only if there are any)
    if (eliminatedPlayers.length > 0) {
      room.game.eliminatedPlayers = [
        ...room.game.eliminatedPlayers,
        ...eliminatedPlayers,
      ];
    }

    // Emit voting results
    io.to(roomCode).emit("votingResults", {
      results: voteResults,
      eliminatedPlayers,
      allEliminatedPlayers: room.game.eliminatedPlayers, // Send complete list
      maxVotes,
    });

    // Set game phase to final voting
    room.game.phase = "finalVoting";

    // Clear any existing final vote timeout
    if (room.game.finalVoteTimeout) {
      clearTimeout(room.game.finalVoteTimeout);
      room.game.finalVoteTimeout = null;
    }

    // Start final voting after showing results
    setTimeout(() => {
      if (!room.game || room.game.phase !== "finalVoting") return; // Safety check

      io.to(roomCode).emit("startFinalVoting");

      // Initialize and send initial vote counts
      const playingPlayers = room.game.hostExcluded
        ? room.players.filter((p) => p.id !== room.hostId)
        : room.players;

      const eligibleVoters = playingPlayers.filter(
        (p) =>
          !room.game.eliminatedPlayers.some(
            (eliminated) => eliminated.id === p.id
          )
      );

      io.to(roomCode).emit("finalVoteUpdate", {
        continueVotes: 0,
        endVotes: 0,
        totalVoters: eligibleVoters.length,
      });

      // Auto-end final voting after 30 seconds
      room.game.finalVoteTimeout = setTimeout(() => {
        if (room.game && room.game.phase === "finalVoting") {
          handleFinalVoteResults(roomCode);
        }
      }, 30000);
    }, 5000); // 5 seconds to view results
  }

  // Helper function to handle final vote results
  function handleFinalVoteResults(roomCode) {
    const room = rooms[roomCode];
    if (!room || !room.game) return;

    // Safety check - only process if we're actually in final voting phase
    if (room.game.phase !== "finalVoting") {
      console.log(
        `Warning: handleFinalVoteResults called but phase is ${room.game.phase}, not finalVoting`
      );
      return;
    }

    let continueVotes = 0;
    let endVotes = 0;

    if (room.game.finalVotes) {
      Object.values(room.game.finalVotes).forEach((vote) => {
        if (vote) continueVotes++;
        else endVotes++;
      });
    }

    // Get total number of players who should be voting (exclude eliminated players)
    const playingPlayers = room.game.hostExcluded
      ? room.players.filter((p) => p.id !== room.hostId)
      : room.players;

    const eligibleVoters = playingPlayers.filter(
      (p) =>
        !room.game.eliminatedPlayers.some(
          (eliminated) => eliminated.id === p.id
        )
    );

    const totalVoters = eligibleVoters.length;

    // Game continues unless ALL remaining players vote to end it
    const shouldContinue = endVotes < totalVoters; // Continue if not everyone voted to end

    if (shouldContinue) {
      // Continue game - reset voting and return to discussion
      room.game.votes = {};
      room.game.finalVotes = {};
      room.game.phase = "playing";

      // Clear any existing final vote timeout to prevent interference
      if (room.game.finalVoteTimeout) {
        clearTimeout(room.game.finalVoteTimeout);
        room.game.finalVoteTimeout = null;
      }

      io.to(roomCode).emit("gameResumes", {
        continueVotes,
        endVotes,
        decision: "continue",
        allEliminatedPlayers: room.game.eliminatedPlayers, // Send eliminated players list
      });

      // Start new discussion round
      setTimeout(() => {
        if (room.game) {
          let discussionCountdown = room.game.discussionTime;
          io.to(roomCode).emit("discussionCountdown", {
            seconds: discussionCountdown,
          });

          const discussionInterval = setInterval(() => {
            discussionCountdown -= 1;
            if (discussionCountdown > 0) {
              io.to(roomCode).emit("discussionCountdown", {
                seconds: discussionCountdown,
              });
            } else {
              clearInterval(discussionInterval);
              io.to(roomCode).emit("discussionEnded");

              // Start voting countdown
              setTimeout(() => {
                if (room.game) {
                  room.game.phase = "voting";
                  let votingCountdown = room.game.votingTime;
                  io.to(roomCode).emit("votingCountdown", {
                    seconds: votingCountdown,
                  });

                  const votingInterval = setInterval(() => {
                    votingCountdown -= 1;
                    if (votingCountdown > 0) {
                      io.to(roomCode).emit("votingCountdown", {
                        seconds: votingCountdown,
                      });
                    } else {
                      clearInterval(votingInterval);
                      handleVotingResults(roomCode);
                    }
                  }, 1000);
                }
              }, 1000);
            }
          }, 1000);
        }
      }, 3000);
    } else {
      // End game
      // Clear any existing final vote timeout
      if (room.game.finalVoteTimeout) {
        clearTimeout(room.game.finalVoteTimeout);
        room.game.finalVoteTimeout = null;
      }

      const imposterPlayer = room.players.find(
        (p) => p.id === room.game?.imposterId
      );

      io.to(roomCode).emit("gameEnded", {
        imposterName: imposterPlayer?.name || "Unknown",
        word: room.game?.targetWord || "Unknown",
        hostExcluded: room.game?.hostExcluded || false,
        finalVoteResult: {
          continueVotes,
          endVotes,
          decision: "end",
        },
      });

      room.game = null;
    }
  }

  socket.on("endGame", ({ roomCode }, callback) => {
    const room = rooms[roomCode];
    const validation = validateHostPermission(socket, room, true); // Require original host for game end

    if (!validation.valid) {
      return callback?.({ error: validation.error });
    }

    // Clear any existing final vote timeout
    if (room.game && room.game.finalVoteTimeout) {
      clearTimeout(room.game.finalVoteTimeout);
      room.game.finalVoteTimeout = null;
    }

    // Find the imposter player from all players (not just playing players)
    const imposterPlayer = room.players.find(
      (p) => p.id === room.game?.imposterId
    );

    io.to(roomCode).emit("gameEnded", {
      imposterName: imposterPlayer?.name || "Unknown",
      word: room.game?.targetWord || "Unknown",
      hostExcluded: room.game?.hostExcluded || false,
    });

    room.game = null;
    callback?.({ success: true });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
