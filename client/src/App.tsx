import { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import "./App.css";

// Wake Lock API types
interface WakeLockSentinel {
  released: boolean;
  type: string;
  release(): Promise<void>;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

interface WakeLockNavigator {
  wakeLock: {
    request(type: "screen"): Promise<WakeLockSentinel>;
  };
}

// Your computer's local IP addresses for different networks
const localIps = [
  "192.168.1.10", // Your friend's house IP address (current location)
  "192.168.100.240", // Your house IP address
];

// Detect if running on mobile device
const isMobileDevice =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

// Function to determine the correct backend URL
const getBackendUrl = () => {
  const hostname = window.location.hostname;

  if (hostname === "localhost") {
    return "http://localhost:3001";
  }

  // Check if we're accessing from one of the known local IPs
  if (localIps.includes(hostname)) {
    return `http://${hostname}:3001`;
  }

  // For mobile devices or when accessing via IP, use the first IP (current location)
  if (
    isMobileDevice ||
    localIps.some((ip) => hostname.includes(ip.split(".")[0]))
  ) {
    return `http://${localIps[0]}:3001`;
  }

  // Default to production server
  return "https://wordimpostergame.onrender.com";
};

const backendUrl = getBackendUrl();

// Debug logging for mobile
if (isMobileDevice) {
  console.log("📱 Mobile device detected:", navigator.userAgent);
  console.log("📱 Backend URL:", backendUrl);
  console.log("📱 Socket.IO transport config:", ["polling"]);
}

const socket: Socket = io(backendUrl, {
  // Always use polling first for mobile devices to avoid CORS issues
  transports: isMobileDevice ? ["polling"] : ["websocket", "polling"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 15, // Increased for mobile
  reconnectionDelay: 500, // Faster initial reconnection for mobile
  reconnectionDelayMax: 3000, // Lower max delay for mobile
  timeout: 45000, // Increased timeout for slower mobile connections
  forceNew: false,
  // Mobile-specific options
  upgrade: !isMobileDevice, // Disable upgrade for mobile to stick with polling
  rememberUpgrade: false,
  // Enable CORS for mobile browsers
  withCredentials: false,
});

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
  ],
  "Body Parts": ["hand", "foot", "head", "arm", "leg", "eye", "nose", "mouth"],
  Clothing: [
    "shirt",
    "pants",
    "dress",
    "shoes",
    "hat",
    "jacket",
    "socks",
    "tie",
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
  ],
  Continents: [
    "asia",
    "africa",
    "europe",
    "north america",
    "south america",
    "antarctica",
    "oceania",
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
  ],
};

function App() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState<{ id: string; name: string }[]>([]);
  const [joined, setJoined] = useState(false);
  const [category, setCategory] = useState(Object.keys(categories)[0]);
  const [role, setRole] = useState<"imposter" | "player" | null>(null);
  const [secretWord, setSecretWord] = useState("");
  const [impostorWord, setImpostorWord] = useState("");
  const [hostId, setHostId] = useState("");
  const [mySocketId, setMySocketId] = useState("");
  const [isRoomCreator, setIsRoomCreator] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [phase, setPhase] = useState<
    "lobby" | "countdown" | "game" | "gameOver"
  >("lobby");
  const [gameStarted, setGameStarted] = useState(false);
  const [imposterName, setImposterName] = useState("");
  const [revealedWord, setRevealedWord] = useState("");
  const [customWord, setCustomWord] = useState("");
  const [customImposterWord, setCustomImposterWord] = useState("");
  const [wordSource, setWordSource] = useState("random");
  const [hostIsModerator, setHostIsModerator] = useState(false); // Whether host is acting as moderator

  // Debug wordSource changes
  useEffect(() => {
    console.log("🔄 wordSource changed to:", wordSource);
  }, [wordSource]);

  // Debug hostIsModerator changes
  useEffect(() => {
    console.log("👑 hostIsModerator changed to:", hostIsModerator);
  }, [hostIsModerator]);
  const [imposterGetsWord, setImposterGetsWord] = useState(true);
  const [discussionTime, setDiscussionTime] = useState<number | string>(120);
  const [discussionCountdown, setDiscussionCountdown] = useState<number | null>(
    null
  );
  const [votingTime, setVotingTime] = useState<number | string>(60);
  const [votingCountdown, setVotingCountdown] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showWordOverlay, setShowWordOverlay] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "reconnecting" | "failed"
  >("connecting");
  const [networkStatus, setNetworkStatus] = useState<"online" | "offline">(
    "online"
  );
  const [bubbles, setBubbles] = useState(
    Array.from({ length: isMobile ? 10 : 20 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${10 + Math.random() * 30}px`,
      delay: `${Math.random() * 15}s`,
      duration: `${15 + Math.random() * 15}s`,
    }))
  );
  const [votingPhase, setVotingPhase] = useState<
    "none" | "voting" | "results" | "finalVoting"
  >("none");
  const [votingResults, setVotingResults] = useState<{
    results: Record<string, { name: string; votes: number }>;
    eliminatedPlayers: Array<{ id: string; name: string }>;
    maxVotes: number;
  } | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [hasFinalVoted, setHasFinalVoted] = useState(false);
  const [finalVoteChoice, setFinalVoteChoice] = useState<boolean | null>(null);
  const [showVotingOverlay, setShowVotingOverlay] = useState(false);
  const [selectedVote, setSelectedVote] = useState("");
  const [votingStarted, setVotingStarted] = useState(false);
  const [isEliminated, setIsEliminated] = useState(false);
  const [allEliminatedPlayers, setAllEliminatedPlayers] = useState<
    Array<{ id: string; name: string }>
  >([]);
  // Final voting timer state
  const [finalVotingCountdown, setFinalVotingCountdown] = useState<
    number | null
  >(null);
  const FINAL_VOTING_DURATION = 10;
  // Final voting live counts
  const [finalVoteCounts, setFinalVoteCounts] = useState<{
    continueVotes: number;
    endVotes: number;
    totalVoters: number;
  }>({ continueVotes: 0, endVotes: 0, totalVoters: 0 });

  // Chat functionality
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      senderId: string;
      senderName: string;
      message: string;
      timestamp: number;
      isCurrentTurn?: boolean;
    }>
  >([]);
  const [currentMessage, setCurrentMessage] = useState("");

  // Turn-based chat system
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string | null>(
    null
  );
  const [currentTurnPlayerName, setCurrentTurnPlayerName] =
    useState<string>("");
  const [turnDuration, setTurnDuration] = useState<number>(30);
  const [turnTimeLeft, setTurnTimeLeft] = useState<number>(0);
  const [turnIndex, setTurnIndex] = useState<number>(0);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [isTurnSystemActive, setIsTurnSystemActive] = useState<boolean>(false);

  // Loading state for start game button
  const [isStartingGame, setIsStartingGame] = useState<boolean>(false);

  // Toast message state
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);

  // Game state reset function
  const resetGameState = useCallback(() => {
    console.log("Resetting game state, preserving host info:", {
      hostId,
      isRoomCreator,
      mySocketId,
    });

    setRole(null);
    setSecretWord("");
    setImpostorWord("");
    setPhase("lobby");
    setGameStarted(false);
    setImposterName("");
    setRevealedWord("");
    setCountdown(null);
    setDiscussionCountdown(null);
    setVotingCountdown(null);
    setCustomWord("");
    setCustomImposterWord("");
    setWordSource("random");
    setHostIsModerator(false); // Reset moderator status
    setImposterGetsWord(true);
    // Don't reset discussionTime and votingTime - preserve host's settings for the room
    // setDiscussionTime(120);
    // setVotingTime(60);
    setCategory(Object.keys(categories)[0]);
    setShowWordOverlay(false);
    setVotingPhase("none");
    setVotingResults(null);
    setHasVoted(false);
    setHasFinalVoted(false);
    setFinalVoteChoice(null);
    setShowVotingOverlay(false);
    setSelectedVote("");
    setVotingStarted(false);
    setIsEliminated(false);
    setAllEliminatedPlayers([]);
    setFinalVotingCountdown(null);
    setFinalVoteCounts({ continueVotes: 0, endVotes: 0, totalVoters: 0 });
    // Reset chat
    setChatMessages([]);
    setCurrentMessage("");
    // Reset turn system
    setCurrentTurnPlayerId(null);
    setCurrentTurnPlayerName("");
    setTurnDuration(30);
    setTurnTimeLeft(0);
    setTurnIndex(0);
    setTotalPlayers(0);
    setIsTurnSystemActive(false);
    // Reset start game loading state
    setIsStartingGame(false);
    // Don't reset host information when resetting game state
    // Only reset when leaving the room completely

    console.log("Game state reset completed, host info preserved");
  }, [hostId, isRoomCreator, mySocketId]);

  // Wake Lock and Keep-Alive functionality
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [keepAliveInterval, setKeepAliveInterval] = useState<number | null>(
    null
  );

  // Keep screen awake during gameplay
  const requestWakeLock = useCallback(async () => {
    try {
      if ("wakeLock" in navigator) {
        const wakelock = await (
          navigator as WakeLockNavigator
        ).wakeLock.request("screen");
        setWakeLock(wakelock);
        console.log("📱 Screen wake lock activated");

        wakelock.addEventListener("release", () => {
          console.log("📱 Screen wake lock released");
          setWakeLock(null);
        });
      }
    } catch (err) {
      console.warn("📱 Wake lock not supported or failed:", err);
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
      console.log("📱 Screen wake lock manually released");
    }
  }, [wakeLock]);

  // Keep-alive ping to maintain connection
  const startKeepAlive = useCallback(() => {
    if (keepAliveInterval) return;

    const interval = window.setInterval(() => {
      if (socket.connected && joined) {
        socket.emit("heartbeat", { roomCode, timestamp: Date.now() });
        console.log("💓 Heartbeat sent");
      }
    }, 30000); // Send heartbeat every 30 seconds

    setKeepAliveInterval(interval);
    console.log("💓 Keep-alive started");
  }, [keepAliveInterval, joined, roomCode]);

  const stopKeepAlive = useCallback(() => {
    if (keepAliveInterval) {
      window.clearInterval(keepAliveInterval);
      setKeepAliveInterval(null);
      console.log("💓 Keep-alive stopped");
    }
  }, [keepAliveInterval]);

  // Connection test function for mobile devices
  const testConnection = useCallback(async () => {
    console.log("🧪 Testing connection to:", backendUrl);
    setConnectionStatus("connecting");

    try {
      // Use the same URL as configured for Socket.IO - don't force HTTPS conversion
      const testUrl = backendUrl;
      console.log("📱 Testing HTTP connection to:", testUrl);

      const response = await fetch(testUrl, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        signal: AbortSignal.timeout(10000), // Reduced timeout for faster feedback
      });

      console.log("📱 HTTP test response status:", response.status);

      if (response.ok || response.status === 404 || response.status === 405) {
        // 404/405 are fine - server is reachable but endpoint doesn't exist
        console.log("✅ HTTP connection test passed");
        // Now try to connect via Socket.IO
        if (!socket.connected) {
          console.log("📱 Attempting Socket.IO connection...");
          socket.connect();
        }
      } else {
        console.log(
          "❌ HTTP connection test failed with status:",
          response.status
        );
        setConnectionStatus("failed");
      }
    } catch (error) {
      console.log("❌ Connection test failed:", error);

      // Be more specific about network errors
      if (error instanceof TypeError) {
        if (error.message.includes("Failed to fetch")) {
          console.log("📵 Network error detected - marking as offline");
          setNetworkStatus("offline");
        } else if (error.message.includes("NetworkError")) {
          console.log("📵 Network error detected - marking as offline");
          setNetworkStatus("offline");
        }
      }

      setConnectionStatus("failed");
    }
  }, []);

  // Enhanced mobile reconnection with connection testing
  const attemptReconnection = useCallback(() => {
    if (!socket.connected && joined && roomCode && name) {
      console.log("🔄 Attempting auto-reconnection...");

      // For mobile devices, only test connection if we've had multiple failures
      if (isMobileDevice && connectionAttempts > 3) {
        console.log("📱 Multiple failures - testing connection first");
        testConnection();
      } else {
        // Try direct Socket.IO reconnection first
        if (!socket.connected) {
          console.log("📱 Direct Socket.IO reconnection attempt");
          socket.connect();
        }
      }

      // Try to rejoin the room
      socket.emit(
        "rejoinRoom",
        {
          name: name.trim(),
          roomCode: roomCode.trim().toUpperCase().replace(/\s/g, ""),
        },
        (res: {
          error?: string;
          players: { id: string; name: string }[];
          hostId?: string;
          gameState?: {
            active: boolean;
            phase: string;
            playerRole?: { role: string; word: string; impostorWord: string };
            discussionCountdown?: number;
            votingCountdown?: number;
          };
          reconnected?: boolean;
        }) => {
          if (res.error) {
            console.log("❌ Reconnection failed:", res.error);
            // If room doesn't exist anymore, reset to join screen
            if (
              res.error.includes("not found") ||
              res.error.includes("does not exist")
            ) {
              alert("The room no longer exists. Returning to main screen.");
              setJoined(false);
              setRoomCode("");
              setPlayers([]);
              setHostId("");
              setIsRoomCreator(false);
              resetGameState();
              releaseWakeLock();
              stopKeepAlive();
            }
          } else {
            console.log("✅ Successfully reconnected to room");
            setPlayers(res.players);
            setHostId(res.hostId || res.players[0]?.id);

            // Restore game state if game is ongoing
            if (res.gameState) {
              console.log("🎮 Restoring game state...");
              setGameStarted(res.gameState.active);
              setPhase(
                (res.gameState.phase as
                  | "lobby"
                  | "countdown"
                  | "game"
                  | "gameOver") || "lobby"
              );

              // Restore role and words if assigned
              if (res.gameState.playerRole) {
                setRole(res.gameState.playerRole.role as "imposter" | "player");
                setSecretWord(res.gameState.playerRole.word || "");
                setImpostorWord(res.gameState.playerRole.impostorWord || "");
              }

              // Restore timers if active
              if (res.gameState.discussionCountdown) {
                setDiscussionCountdown(res.gameState.discussionCountdown);
              }
              if (res.gameState.votingCountdown) {
                setVotingCountdown(res.gameState.votingCountdown);
              }

              // Reactivate wake lock if game is active
              if (res.gameState.active) {
                requestWakeLock();
              }
            }

            // Restart keep-alive
            startKeepAlive();
          }
        }
      );
    }
  }, [
    joined,
    roomCode,
    name,
    releaseWakeLock,
    stopKeepAlive,
    requestWakeLock,
    startKeepAlive,
    testConnection,
    connectionAttempts,
    resetGameState,
  ]);

  // Mobile-specific connection initialization
  useEffect(() => {
    if (isMobileDevice && !isConnected) {
      console.log("📱 Initializing mobile connection...");

      // For mobile devices, wait longer before testing connection
      // This gives Socket.IO more time to connect naturally
      const initTimer = setTimeout(() => {
        if (!socket.connected && !isConnected) {
          console.log(
            "📱 Socket not connected after extended wait, trying direct connection..."
          );
          // Try direct socket connection first, not HTTP test
          socket.connect();
        }
      }, 8000); // Increased from 3 seconds to 8 seconds

      return () => clearTimeout(initTimer);
    }
  }, [isConnected]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setBubbles(
      Array.from({ length: isMobile ? 10 : 20 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${10 + Math.random() * 30}px`,
        delay: `${Math.random() * 15}s`,
        duration: `${15 + Math.random() * 15}s`,
      }))
    );
  }, [isMobile]);

  const playSound = (soundUrl: string) => {
    try {
      const audio = new Audio(soundUrl);
      audio.play().catch(console.error);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  useEffect(() => {
    const handleConnect = () => {
      console.log("📱 Socket connected with ID:", socket.id);
      setMySocketId(socket.id || "");
      setIsConnected(true);
      setConnectionStatus("connected");
      setConnectionAttempts(0);

      // Send a test message to ensure connection is working
      if (isMobileDevice) {
        socket.emit("ping", { timestamp: Date.now(), mobile: true });
      }
    };

    const handleDisconnect = (reason: string) => {
      console.log("📱 Socket disconnected, reason:", reason);
      setIsConnected(false);
      setConnectionStatus("reconnecting");

      // Different strategies based on disconnect reason
      let reconnectDelay = 1000;
      if (reason === "io server disconnect") {
        // Server disconnected us - try again quickly
        reconnectDelay = 500;
      } else if (reason === "transport close" || reason === "transport error") {
        // Network issue - wait a bit longer for mobile
        reconnectDelay = isMobileDevice ? 2000 : 1000;
      }

      setTimeout(() => {
        if (joined && roomCode && name) {
          setConnectionAttempts((prev) => prev + 1);
          attemptReconnection();
        } else if (!socket.connected) {
          // Try to reconnect even if not in a room
          setConnectionAttempts((prev) => prev + 1);
          if (isMobileDevice) {
            testConnection();
          } else {
            socket.connect();
          }
        }
      }, reconnectDelay);
    };

    const handleReconnectAttempt = () => {
      console.log("🔄 Attempting to reconnect...");
      setConnectionStatus("reconnecting");
      setConnectionAttempts((prev) => prev + 1);
    };

    const handleReconnectError = () => {
      console.log("❌ Reconnection failed");
      setConnectionStatus("failed");
    };

    const handleReconnectFailed = () => {
      console.log("❌ Reconnection attempts exhausted");
      setConnectionStatus("failed");
      setIsConnected(false);

      // Force a page reload as last resort for mobile devices
      if (isMobileDevice && connectionAttempts > 5) {
        console.log(
          "📱 Mobile device - forcing page reload after multiple failed attempts"
        );
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    };

    // Handle visibility change (app switching) - critical for mobile
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("📱 App went to background");
      } else {
        console.log("📱 App came to foreground");
        // Immediately try to reconnect if disconnected (mobile apps often disconnect in background)
        if (!socket.connected && joined && roomCode && name) {
          setConnectionStatus("reconnecting");
          setTimeout(() => attemptReconnection(), 500);
        }
      }
    };

    // Handle page focus (similar to visibility but more reliable on some devices)
    const handleFocus = () => {
      console.log("📱 App gained focus");
      if (!socket.connected && joined && roomCode && name) {
        setConnectionStatus("reconnecting");
        setTimeout(() => attemptReconnection(), 500);
      }
    };

    const handleBlur = () => {
      console.log("📱 App lost focus");
    };

    // Network status monitoring for mobile devices
    const handleOnline = () => {
      console.log("📶 Network back online");
      setNetworkStatus("online");
      if (!socket.connected) {
        setConnectionStatus("reconnecting");
        setTimeout(() => {
          socket.connect();
        }, 1000);
      }
    };

    const handleOffline = () => {
      console.log("📵 Network went offline");
      setNetworkStatus("offline");
      setConnectionStatus("failed");
    };

    const handlePlayerListUpdate = (
      players: { id: string; name: string }[]
    ) => {
      setPlayers(players);
    };

    const handleHostId = (hostId: string) => {
      // Update hostId when we're in lobby or when game is not active
      // This allows proper host assignment after game ends
      if (!gameStarted || phase === "lobby") {
        setHostId(hostId);
        console.log("Host ID updated to:", hostId);
      } else {
        console.log("Host ID update ignored during active game:", hostId);
      }
    };

    const handleCountdown = ({ seconds }: { seconds: number }) => {
      setPhase("countdown");
      setCountdown(seconds);
      if (seconds === 5) playSound("/sounds/countdown.mp3");
    };

    const handleVotingCountdown = ({ seconds }: { seconds: number }) => {
      console.log("handleVotingCountdown called with seconds:", seconds);
      console.log("Current votingStarted:", votingStarted);
      console.log("Current showVotingOverlay:", showVotingOverlay);

      setVotingCountdown(seconds);

      // Show voting interface when voting countdown first starts
      // Show for all players (eliminated and non-eliminated) so eliminated players can see what's happening
      if (!votingStarted && seconds > 0) {
        console.log("Setting up voting interface");
        setVotingStarted(true);
        setVotingPhase("voting");
        setShowVotingOverlay(true);
        // Only reset voting state for non-eliminated players
        if (!isEliminated) {
          setHasVoted(false);
          setSelectedVote("");
        }
      }

      // If seconds is 0 or negative, ensure voting interface is closed
      if (seconds <= 0) {
        setVotingStarted(false);
        setShowVotingOverlay(false);
      }

      if (seconds === 10) playSound("/sounds/countdown.mp3"); // Play sound at 10 seconds left
    };

    const handleDiscussionCountdown = ({ seconds }: { seconds: number }) => {
      setDiscussionCountdown(seconds);
      if (seconds === 10) playSound("/sounds/countdown.mp3"); // Play sound at 10 seconds left
    };

    const handleRoleAssigned = ({
      role,
      word,
      targetWord,
      impostorWord,
    }: {
      role: string;
      word: string;
      targetWord?: string;
      impostorWord?: string;
    }) => {
      console.log("Role assigned:", role, word);

      if (role === "moderator") {
        // Host is moderating the game with custom words
        setRole(null); // No role assigned to host
        setSecretWord(targetWord || "");
        setImpostorWord(impostorWord || "");
        setPhase("game");
        // Mark that host is moderating
        setHostIsModerator(true);
        console.log("👑 Host is now moderating");
        // Don't show word overlay for moderator
        setShowWordOverlay(false);
        playSound("/sounds/word-reveal.mp3");
      } else {
        // Regular player or imposter
        if (role === "imposter") {
          setImpostorWord(word || ""); // word might be empty if imposter gets no word
          setSecretWord(""); // Clear secret word for imposter
        } else {
          setSecretWord(word);
          setImpostorWord(""); // Clear imposter word for regular players
        }
        setRole(role as "imposter" | "player");
        setPhase("game");

        // Show word overlay only if the player has a word to show
        if (role === "player" || (role === "imposter" && word)) {
          setShowWordOverlay(true);
          // Hide word overlay after 2 seconds
          setTimeout(() => {
            setShowWordOverlay(false);
          }, 2000);
        } else if (role === "imposter" && !word) {
          // Imposter with no word - show special overlay briefly
          setShowWordOverlay(true);
          setTimeout(() => {
            setShowWordOverlay(false);
          }, 3000); // Show a bit longer for the "no word" message
        }

        playSound("/sounds/word-reveal.mp3");
      }
    };

    const handleGameStarted = ({
      hostExcluded,
    }: {
      hostExcluded?: boolean;
      playingPlayerCount?: number;
    } = {}) => {
      setGameStarted(true);
      // Set hostIsModerator based on hostExcluded flag from server
      if (hostExcluded !== undefined) {
        setHostIsModerator(hostExcluded);
        console.log("👑 Host moderator status set to:", hostExcluded);
      }
      // Lock host status during gameplay to prevent transfers
    };

    const handleGameEnded = ({
      imposterName,
      word,
    }: {
      imposterName: string;
      word: string;
    }) => {
      setImposterName(imposterName);
      setRevealedWord(word);
      setPhase("gameOver");
      playSound("/sounds/game-end.mp3");
      setTimeout(() => {
        resetGameState();
        // Request host confirmation after game reset
        console.log("Game ended - requesting host confirmation");
      }, 5000);
    };

    const handleResetToLobby = () => {
      resetGameState();
    };

    const handleRoomClosed = () => {
      alert("Room closed because host left or no players.");
      // Reset all states including host information
      setJoined(false);
      setRoomCode("");
      setPlayers([]);
      setHostId("");
      setIsRoomCreator(false);
      // Reset timer values to defaults when room is closed
      setDiscussionTime(120);
      setVotingTime(60);
      resetGameState();
    };

    const handleTimerUpdate = ({
      discussionTime: newDiscussionTime,
      votingTime: newVotingTime,
    }: {
      discussionTime: number;
      votingTime: number;
    }) => {
      setDiscussionTime(newDiscussionTime);
      setVotingTime(newVotingTime);
    };

    const handleWordSourceUpdate = ({
      wordSource: newWordSource,
      hostIsModerator: newHostIsModerator,
    }: {
      wordSource: string;
      hostIsModerator: boolean;
    }) => {
      console.log("📡 Received word source update:", {
        newWordSource,
        newHostIsModerator,
      });
      setWordSource(newWordSource);
      setHostIsModerator(newHostIsModerator);
    };

    const handleVotingResults = (data: {
      results: Record<string, { name: string; votes: number }>;
      eliminatedPlayers: Array<{ id: string; name: string }>;
      allEliminatedPlayers?: Array<{ id: string; name: string }>;
      maxVotes: number;
    }) => {
      setVotingResults(data);
      setVotingPhase("results");
      setShowVotingOverlay(true);

      // Check if current player is eliminated
      const currentPlayerEliminated = data.eliminatedPlayers.some(
        (eliminated) => eliminated.id === mySocketId
      );
      setIsEliminated(currentPlayerEliminated);

      // Use the complete list from server if available, otherwise build it locally
      if (data.allEliminatedPlayers) {
        setAllEliminatedPlayers(data.allEliminatedPlayers);
      } else {
        // Fallback: Add newly eliminated players to the cumulative list
        setAllEliminatedPlayers((prev) => {
          const newEliminated = data.eliminatedPlayers.filter(
            (newPlayer) =>
              !prev.some((existing) => existing.id === newPlayer.id)
          );
          return [...prev, ...newEliminated];
        });
      }
    };

    const handleStartFinalVoting = () => {
      setVotingPhase("finalVoting");
      setHasFinalVoted(false);
      setFinalVoteChoice(null);
      setFinalVotingCountdown(FINAL_VOTING_DURATION);
      setShowVotingOverlay(true); // Ensure overlay is shown
      // Reset final vote counts
      setFinalVoteCounts({ continueVotes: 0, endVotes: 0, totalVoters: 0 });
    };

    const handleFinalVoteUpdate = (data: {
      continueVotes: number;
      endVotes: number;
      totalVoters: number;
    }) => {
      setFinalVoteCounts(data);
    };

    const handleGameResumes = (data?: {
      continueVotes: number;
      endVotes: number;
      decision: string;
      allEliminatedPlayers?: Array<{ id: string; name: string }>;
    }) => {
      setVotingPhase("none");
      setVotingResults(null);
      setHasVoted(false);
      setHasFinalVoted(false);
      setFinalVoteChoice(null);
      setShowVotingOverlay(false);
      setSelectedVote("");
      setVotingStarted(false);
      setVotingCountdown(null); // Reset voting countdown to prevent stuck overlay
      setFinalVotingCountdown(null); // Reset final voting countdown
      setFinalVoteCounts({ continueVotes: 0, endVotes: 0, totalVoters: 0 }); // Reset final vote counts

      // Update eliminated players list from server if provided
      if (data?.allEliminatedPlayers) {
        setAllEliminatedPlayers(data.allEliminatedPlayers);

        // Check if current player is eliminated
        const currentPlayerEliminated = data.allEliminatedPlayers.some(
          (eliminated) => eliminated.id === mySocketId
        );
        setIsEliminated(currentPlayerEliminated);
      } else {
        // Fallback: Ensure eliminated status is maintained based on current list
        const currentPlayerEliminated = allEliminatedPlayers.some(
          (eliminated) => eliminated.id === mySocketId
        );
        setIsEliminated(currentPlayerEliminated);
      }

      // Don't reset isEliminated here - eliminated players stay eliminated
    };

    const handleChatMessage = (message: {
      id: string;
      senderId: string;
      senderName: string;
      message: string;
      timestamp: number;
      isCurrentTurn?: boolean;
    }) => {
      setChatMessages((prev) => [...prev, message]);
    };

    // Turn system event handlers
    const handlePlayerTurn = (data: {
      currentPlayerId: string;
      currentPlayerName: string;
      turnDuration: number;
      turnIndex: number;
      totalPlayers: number;
    }) => {
      setCurrentTurnPlayerId(data.currentPlayerId);
      setCurrentTurnPlayerName(data.currentPlayerName);
      setTurnDuration(data.turnDuration);
      setTurnTimeLeft(data.turnDuration);
      setTurnIndex(data.turnIndex);
      setTotalPlayers(data.totalPlayers);
      setIsTurnSystemActive(true);

      console.log(
        `🎯 It's ${data.currentPlayerName}'s turn to speak (${data.turnIndex}/${data.totalPlayers})`
      );
    };

    const handleTurnSystemStopped = () => {
      setIsTurnSystemActive(false);
      setCurrentTurnPlayerId(null);
      setCurrentTurnPlayerName("");
      setTurnTimeLeft(0);
      console.log("🛑 Turn system stopped");
    };

    // Add event listeners for app visibility and focus
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    // Add network status listeners for mobile devices
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect_attempt", handleReconnectAttempt);
    socket.on("reconnect_error", handleReconnectError);
    socket.on("reconnect_failed", handleReconnectFailed);
    socket.on("playerListUpdate", handlePlayerListUpdate);
    socket.on("hostId", handleHostId);
    socket.on("countdown", handleCountdown);
    socket.on("discussionCountdown", handleDiscussionCountdown);
    socket.on("votingCountdown", handleVotingCountdown);
    socket.on("timerUpdate", handleTimerUpdate);
    socket.on("wordSourceUpdate", handleWordSourceUpdate);
    socket.on("votingResults", handleVotingResults);
    socket.on("startFinalVoting", handleStartFinalVoting);
    socket.on("finalVoteUpdate", handleFinalVoteUpdate);
    socket.on("gameResumes", handleGameResumes);
    socket.on("chatMessage", handleChatMessage);
    socket.on("playerTurn", handlePlayerTurn);
    socket.on("turnSystemStopped", handleTurnSystemStopped);

    socket.on("discussionEnded", () => {
      setDiscussionCountdown(null);
      // Turn system stops when discussion ends
      setIsTurnSystemActive(false);
    });

    socket.on("votingEnded", () => {
      setVotingCountdown(null);
      setVotingStarted(false);
    });
    socket.on("roleAssigned", handleRoleAssigned);
    socket.on("gameStarted", handleGameStarted);
    socket.on("gameEnded", handleGameEnded);
    socket.on("resetToLobby", handleResetToLobby);
    socket.on("roomClosed", handleRoomClosed);

    // Check initial connection state
    if (socket.connected) {
      setIsConnected(true);
      setConnectionStatus("connected");
      setMySocketId(socket.id || "");
    } else {
      setConnectionStatus("connecting");
    }

    return () => {
      // Remove event listeners
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect_attempt", handleReconnectAttempt);
      socket.off("reconnect_error", handleReconnectError);
      socket.off("reconnect_failed", handleReconnectFailed);
      socket.off("playerListUpdate", handlePlayerListUpdate);
      socket.off("hostId", handleHostId);
      socket.off("countdown", handleCountdown);
      socket.off("discussionCountdown", handleDiscussionCountdown);
      socket.off("votingCountdown", handleVotingCountdown);
      socket.off("discussionEnded");
      socket.off("votingEnded");
      socket.off("timerUpdate", handleTimerUpdate);
      socket.off("wordSourceUpdate", handleWordSourceUpdate);
      socket.off("votingResults", handleVotingResults);
      socket.off("startFinalVoting", handleStartFinalVoting);
      socket.off("finalVoteUpdate", handleFinalVoteUpdate);
      socket.off("gameResumes", handleGameResumes);
      socket.off("chatMessage", handleChatMessage);
      socket.off("playerTurn", handlePlayerTurn);
      socket.off("turnSystemStopped", handleTurnSystemStopped);
      socket.off("roleAssigned", handleRoleAssigned);
      socket.off("gameStarted", handleGameStarted);
      socket.off("gameEnded", handleGameEnded);
      socket.off("resetToLobby", handleResetToLobby);
      socket.off("roomClosed", handleRoomClosed);
    };
  }, [
    gameStarted,
    votingTime,
    votingCountdown,
    votingStarted,
    showVotingOverlay,
    mySocketId,
    isEliminated,
    allEliminatedPlayers,
    joined,
    roomCode,
    name,
    attemptReconnection,
    connectionAttempts,
    testConnection,
    phase,
    resetGameState,
  ]);

  // Connection timeout effect - especially important for mobile
  useEffect(() => {
    let connectionTimer: ReturnType<typeof setTimeout> | null = null;

    if (connectionStatus === "connecting" && !isConnected) {
      // Set a timeout for connection attempts
      const timeoutDuration = isMobileDevice ? 15000 : 10000; // Longer timeout for mobile

      connectionTimer = setTimeout(() => {
        if (!isConnected && connectionStatus === "connecting") {
          console.log("📱 Connection timeout - forcing reconnection strategy");
          setConnectionStatus("failed");

          // For mobile devices, try a different approach
          if (isMobileDevice) {
            console.log("📱 Mobile timeout - trying forced reconnection");
            setTimeout(() => {
              testConnection();
            }, 2000);
          }
        }
      }, timeoutDuration);
    }

    return () => {
      if (connectionTimer) clearTimeout(connectionTimer);
    };
  }, [connectionStatus, isConnected, testConnection]);

  // Final voting countdown effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (
      votingPhase === "finalVoting" &&
      finalVotingCountdown !== null &&
      finalVotingCountdown > 0
    ) {
      timer = setTimeout(() => {
        setFinalVotingCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    }
    // When timer runs out, just disable the countdown display but keep the overlay open
    // The server will handle closing final voting after the server-side timeout
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [votingPhase, finalVotingCountdown]);

  // Turn timer countdown effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isTurnSystemActive && turnTimeLeft > 0) {
      timer = setTimeout(() => {
        setTurnTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isTurnSystemActive, turnTimeLeft]);

  // Wake lock management - activate during gameplay
  useEffect(() => {
    if (gameStarted && phase === "game" && !isEliminated) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  }, [gameStarted, phase, isEliminated, requestWakeLock, releaseWakeLock]);

  // Keep-alive management - start when joined, stop when leaving
  useEffect(() => {
    if (joined && roomCode) {
      startKeepAlive();
    } else {
      stopKeepAlive();
    }

    // Cleanup on unmount
    return () => {
      stopKeepAlive();
      releaseWakeLock();
    };
  }, [joined, roomCode, startKeepAlive, stopKeepAlive, releaseWakeLock]);

  const createRoom = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!name || name.trim() === "") {
      alert("Please enter a name");
      return;
    }

    console.log("Creating room for:", name); // Debug log

    socket.emit(
      "createRoom",
      name.trim(),
      (data: {
        roomCode: string;
        players: { id: string; name: string }[];
        hostId?: string;
        error?: string;
      }) => {
        if (data.error) {
          alert(data.error);
          return;
        }
        console.log("Room created:", data); // Debug log
        setRoomCode(data.roomCode);
        setPlayers(data.players);
        setJoined(true);
        setHostId(data.hostId || data.players[0]?.id);
        setIsRoomCreator(true); // Mark this user as the room creator
      }
    );
  };

  const joinRoom = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!name || name.trim() === "") {
      alert("Please enter a name");
      return;
    }
    if (!roomCode || roomCode.trim().replace(/\s/g, "") === "") {
      alert("Please enter a room code");
      return;
    }

    console.log("Joining room:", roomCode, "with name:", name); // Debug log

    socket.emit(
      "joinRoom",
      {
        name: name.trim(),
        roomCode: roomCode.trim().toUpperCase().replace(/\s/g, ""),
      },
      (res: {
        error?: string;
        players: { id: string; name: string }[];
        hostId?: string;
        isOriginalHost?: boolean;
      }) => {
        if (res.error) {
          alert(res.error);
          setRoomCode(""); // Clear the room code input field on error
          return;
        }
        console.log("Joined room:", res); // Debug log
        setPlayers(res.players);
        setJoined(true);
        setHostId(res.hostId || res.players[0]?.id);
        // Use server's isOriginalHost flag if available, otherwise default to false
        setIsRoomCreator(res.isOriginalHost || false);
      }
    );
  };

  const startGame = () => {
    if (!roomCode) return;
    if (
      wordSource === "custom" &&
      (!customWord.trim() || !customImposterWord.trim())
    ) {
      alert("Please enter both custom words (player word and imposter word)");
      return;
    }

    setIsStartingGame(true);

    const gameConfig = {
      roomCode,
      category,
      wordSource,
      customWord,
      customImposterWord,
      imposterGetsWord,
      discussionTime: typeof discussionTime === "string" ? 120 : discussionTime,
      votingTime: typeof votingTime === "string" ? 60 : votingTime,
    };

    console.log("🚀 Starting game with config:", gameConfig);
    console.log("🔍 Current wordSource before sending:", wordSource);

    socket.emit("startGame", gameConfig, (res: { error?: string }) => {
      setIsStartingGame(false);
      if (res?.error) alert(res.error);
    });
  };

  const endGame = () => {
    if (!window.confirm("Are you sure you want to end the game?")) return;
    socket.emit("endGame", { roomCode }, (res: { error?: string }) => {
      if (res?.error) alert(res.error);
    });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setToastMessage("Copied to clipboard!");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const submitVote = (votedPlayerId: string) => {
    if (!roomCode || hasVoted) return;

    socket.emit(
      "submitVote",
      { roomCode, votedPlayerId },
      (res: { error?: string; success?: boolean }) => {
        if (res?.error) {
          alert(res.error);
        } else {
          setHasVoted(true);
          setSelectedVote(votedPlayerId);
        }
      }
    );
  };

  const submitFinalVote = (continueGame: boolean) => {
    if (!roomCode || hasFinalVoted) return;

    socket.emit(
      "submitFinalVote",
      { roomCode, continueGame },
      (res: { error?: string; success?: boolean }) => {
        if (res?.error) {
          alert(res.error);
        } else {
          setHasFinalVoted(true);
          setFinalVoteChoice(continueGame);
        }
      }
    );
  };

  const sendChatMessage = () => {
    if (!roomCode || !currentMessage.trim() || isEliminated) return;

    socket.emit(
      "sendChatMessage",
      { roomCode, message: currentMessage.trim() },
      (res: { error?: string; success?: boolean }) => {
        if (res?.error) {
          alert(res.error);
        } else {
          setCurrentMessage("");
        }
      }
    );
  };

  const renderCountdown = () => (
    <div className="countdown-overlay">
      <div className="game-instructions">
        <div className="countdown-number">{countdown}</div>

        <h2>🎯 How to Play</h2>

        <div className="objective-text">
          <p>
            <strong>Describe your word without saying it!</strong> One player is
            the imposter with a different word.
          </p>
        </div>

        <div className="instructions-grid">
          <div className="instruction-section">
            <h3>📝 Rules</h3>
            <ul>
              <li>Take turns giving clues</li>
              <li>Don't say your word directly</li>
              <li>Find the imposter to win</li>
            </ul>
          </div>

          <div className="instruction-section">
            <h3>🕵️ Imposter</h3>
            <ul>
              <li>Listen to others' clues</li>
              <li>Give vague descriptions</li>
              <li>Stay hidden to win</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGameOver = () => (
    <div className="game-over-overlay">
      <h1>Game Over</h1>
      <h2>
        The Imposter was: <span className="imposter-name">{imposterName}</span>
      </h2>
      <h3>
        The Word was: <span className="target-word">{revealedWord}</span>
      </h3>
      <button className="return-button" onClick={resetGameState}>
        Return to Lobby
      </button>
    </div>
  );

  const renderWordOverlay = () => {
    const word = role === "imposter" ? impostorWord : secretWord;
    const isLongWord = word.length > 15;
    const isVeryLongWord = word.length > 25;

    // Special case: imposter with no word
    if (role === "imposter" && !word) {
      return (
        <div className="word-overlay imposter no-word">
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🕵️</div>
          <div>No Word</div>
          <div
            style={{ fontSize: "0.8rem", marginTop: "0.5rem", opacity: "0.8" }}
          >
            Listen and blend in!
          </div>
        </div>
      );
    }

    return (
      <div
        className={`word-overlay ${role === "imposter" ? "imposter" : ""}`}
        data-long={isLongWord}
        data-very-long={isVeryLongWord}
      >
        {word}
      </div>
    );
  };

  const renderEliminationOverlay = () => (
    <div className="elimination-overlay">
      <div className="elimination-content">
        <h1>💀 You Are Eliminated</h1>
        <p>
          You received the most votes and have been eliminated from the game.
        </p>
        <p>
          You can continue watching the game, but you cannot participate in
          discussions or voting.
        </p>
        <div className="elimination-icon">⚰️</div>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          The game continues for the remaining players...
        </p>
      </div>
    </div>
  );

  const renderVotingOverlay = () => {
    console.log("renderVotingOverlay called, votingPhase:", votingPhase);
    console.log("showVotingOverlay:", showVotingOverlay);
    console.log("isEliminated:", isEliminated);
    console.log("allEliminatedPlayers:", allEliminatedPlayers);

    if (votingPhase === "voting") {
      // Check if current user is the moderator (host with custom words only)
      const isModerator =
        isRoomCreator && hostId === mySocketId && hostIsModerator;

      // Get players that can be voted for (exclude host when they're moderating, current player, and eliminated players)
      let votablePlayers = players.filter((p) => {
        console.log(`Checking player ${p.name} (${p.id}):`, {
          isHost: p.id === hostId,
          hostIsModerator: hostIsModerator,
          shouldExcludeHost: p.id === hostId && hostIsModerator,
          isSelf: p.id === mySocketId,
        });

        // Always exclude the host when they're moderating (custom words mode)
        // This applies to ALL players, not just the host themselves
        if (p.id === hostId && hostIsModerator) {
          console.log(
            `✅ EXCLUDING host ${p.name} (${p.id}) because host is moderating`
          );
          return false;
        }
        // Always exclude yourself from voting
        if (p.id === mySocketId) {
          console.log(`✅ EXCLUDING self ${p.name} (${p.id})`);
          return false;
        }
        console.log(`✅ INCLUDING player ${p.name} (${p.id})`);
        return true;
      });

      // Filter out all eliminated players
      votablePlayers = votablePlayers.filter(
        (player) =>
          !allEliminatedPlayers.some(
            (eliminated) => eliminated.id === player.id
          )
      );

      console.log("=== VOTING DEBUG ===");
      console.log("🔍 Complete voting state check:");
      console.log("  - wordSource (UI):", wordSource);
      console.log("  - hostIsModerator:", hostIsModerator);
      console.log("  - hostId:", hostId);
      console.log("  - mySocketId:", mySocketId);
      console.log("  - isRoomCreator:", isRoomCreator);
      console.log("  - isModerator:", isModerator);
      console.log(
        "  - players:",
        players.map((p) => `${p.name} (${p.id})`)
      );
      console.log("  - hostId === mySocketId:", hostId === mySocketId);
      console.log("  - hostIsModerator:", hostIsModerator);
      console.log(
        "Original players:",
        players.map((p) => `${p.name} (${p.id})`)
      );
      console.log("Host ID:", hostId);
      console.log("My Socket ID:", mySocketId);
      console.log("Word source (UI):", wordSource);
      console.log("Host is moderator:", hostIsModerator);
      console.log("Is moderator:", isModerator);
      console.log(
        "Eliminated players:",
        allEliminatedPlayers.map((p) => `${p.name} (${p.id})`)
      );
      console.log(
        "Votable players after filtering:",
        votablePlayers.map((p) => `${p.name} (${p.id})`)
      );
      console.log("===================");

      return (
        <div className="voting-overlay">
          <div className="voting-content">
            <h2>🗳️ Vote for the Imposter</h2>
            <p>Who do you think is the imposter?</p>
            <div className="voting-countdown-display">
              Time remaining: {votingCountdown}s
            </div>

            <div className="voting-players">
              {votablePlayers.map((player) => (
                <button
                  key={player.id}
                  className={`vote-button ${
                    selectedVote === player.id ? "selected" : ""
                  } ${
                    hasVoted || isEliminated || isModerator ? "disabled" : ""
                  }`}
                  onClick={() =>
                    !hasVoted &&
                    !isEliminated &&
                    !isModerator &&
                    submitVote(player.id)
                  }
                  disabled={hasVoted || isEliminated || isModerator}
                >
                  {player.name}
                  {selectedVote === player.id && hasVoted && " ✓"}
                </button>
              ))}
            </div>

            {hasVoted && !isEliminated && !isModerator && (
              <p style={{ color: "var(--success)", marginTop: "1rem" }}>
                Vote submitted! Waiting for other players...
              </p>
            )}

            {isModerator && (
              <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
                👑 You are moderating this game and cannot vote.
              </p>
            )}
          </div>

          {/* Eliminated player blocking overlay */}
          {isEliminated && (
            <div className="eliminated-voting-block">
              <div className="eliminated-voting-message">
                <h3>💀 You Cannot Vote</h3>
                <p>You have been eliminated from the game.</p>
                <p>You can watch the voting but cannot participate.</p>
                <div className="eliminated-icon">⚰️</div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (votingPhase === "results" && votingResults) {
      return (
        <div className="voting-overlay">
          <div className="voting-content">
            <h2>📊 Voting Results</h2>
            <div className="voting-results">
              {Object.entries(votingResults.results).map(
                ([playerId, result]) => {
                  const isEliminated = votingResults.eliminatedPlayers.some(
                    (eliminated) => eliminated.id === playerId
                  );
                  return (
                    <div
                      key={playerId}
                      className={`vote-result ${
                        isEliminated ? "eliminated-highlight" : ""
                      }`}
                    >
                      <span className="player-name">{result.name}</span>
                      <span className="vote-count">{result.votes} votes</span>
                    </div>
                  );
                }
              )}
            </div>

            {votingResults.eliminatedPlayers.length === 0 && (
              <p>No one was eliminated (no votes cast)</p>
            )}
          </div>
        </div>
      );
    }

    if (votingPhase === "finalVoting") {
      // Check if current user is the moderator (host with custom words only)
      const isModerator =
        isRoomCreator && hostId === mySocketId && hostIsModerator;

      return (
        <div className="voting-overlay">
          <div className="voting-content">
            <h2>🤔 Final Decision</h2>
            {/* Timer above the voting box */}
            <div
              className="final-voting-timer"
              style={{
                fontWeight: 700,
                fontSize: "1.3rem",
                marginBottom: "0.5rem",
                color: "var(--accent-red)",
              }}
            >
              Time left:{" "}
              {finalVotingCountdown !== null
                ? finalVotingCountdown
                : FINAL_VOTING_DURATION}
              s
            </div>

            <p>Do you think the imposter was voted out? Click to vote:</p>

            {/* Interactive vote counts as buttons */}
            <div
              className="final-vote-counts"
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                marginBottom: "1rem",
                fontSize: "1rem",
              }}
            >
              <button
                className={`final-vote-counter-button continue ${
                  hasFinalVoted || isEliminated || isModerator ? "disabled" : ""
                }`}
                style={{
                  background:
                    hasFinalVoted && finalVoteChoice === true
                      ? "rgba(76, 175, 80, 0.4)"
                      : "rgba(76, 175, 80, 0.2)",
                  padding: "1rem 1.5rem",
                  borderRadius: "0.8rem",
                  border:
                    hasFinalVoted && finalVoteChoice === true
                      ? "2px solid var(--success)"
                      : "1px solid var(--success)",
                  cursor:
                    hasFinalVoted || isEliminated || isModerator
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.2s ease",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--success)",
                  opacity:
                    hasFinalVoted || isEliminated || isModerator ? 0.6 : 1,
                  minWidth: "140px",
                  textAlign: "center",
                }}
                onClick={() =>
                  !hasFinalVoted &&
                  !isEliminated &&
                  !isModerator &&
                  submitFinalVote(true)
                }
                disabled={hasFinalVoted || isEliminated || isModerator}
              >
                <div>👍 Continue</div>
                <div style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>
                  {finalVoteCounts.continueVotes}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  Imposter still here
                </div>
              </button>

              <button
                className={`final-vote-counter-button end ${
                  hasFinalVoted || isEliminated || isModerator ? "disabled" : ""
                }`}
                style={{
                  background:
                    hasFinalVoted && finalVoteChoice === false
                      ? "rgba(255, 77, 77, 0.4)"
                      : "rgba(255, 77, 77, 0.2)",
                  padding: "1rem 1.5rem",
                  borderRadius: "0.8rem",
                  border:
                    hasFinalVoted && finalVoteChoice === false
                      ? "2px solid var(--accent-red)"
                      : "1px solid var(--accent-red)",
                  cursor:
                    hasFinalVoted || isEliminated || isModerator
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.2s ease",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--accent-red)",
                  opacity:
                    hasFinalVoted || isEliminated || isModerator ? 0.6 : 1,
                  minWidth: "140px",
                  textAlign: "center",
                }}
                onClick={() =>
                  !hasFinalVoted &&
                  !isEliminated &&
                  !isModerator &&
                  submitFinalVote(false)
                }
                disabled={hasFinalVoted || isEliminated || isModerator}
              >
                <div>� End Game</div>
                <div style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>
                  {finalVoteCounts.endVotes}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  Imposter eliminated
                </div>
              </button>

              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "1rem 1.5rem",
                  borderRadius: "0.8rem",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  minWidth: "120px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  Total Voters
                </div>
                <div
                  style={{
                    fontSize: "1.2rem",
                    margin: "0.5rem 0",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                  }}
                >
                  {finalVoteCounts.totalVoters}
                </div>
              </div>
            </div>

            {hasFinalVoted && !isEliminated && !isModerator && (
              <p style={{ color: "var(--success)", marginTop: "1rem" }}>
                Vote submitted! Waiting for other players...
              </p>
            )}

            {isModerator && (
              <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
                👑 You are moderating this game and cannot vote.
              </p>
            )}
          </div>

          {/* Eliminated player blocking overlay */}
          {isEliminated && (
            <div className="eliminated-voting-block">
              <div className="eliminated-voting-message">
                <h3>💀 You Cannot Vote</h3>
                <p>You have been eliminated from the game.</p>
                <p>You can watch the voting but cannot participate.</p>
                <div className="eliminated-icon">⚰️</div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`app-container ${phase}`}>
      {/* Toast notification */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "rgba(76, 175, 80, 0.9)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            zIndex: 9999,
            fontSize: "14px",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {toastMessage}
        </div>
      )}

      <div className="bubbles-container">
        {bubbles.map((bubble, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              top: bubble.top,
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              animationDelay: bubble.delay,
              animationDuration: bubble.duration,
            }}
          />
        ))}
      </div>

      {/* Show elimination overlay for eliminated players throughout the entire game */}
      {isEliminated &&
        (phase === "game" || phase === "countdown") &&
        renderEliminationOverlay()}

      {/* Show normal game content only for non-eliminated players */}
      {!isEliminated &&
        phase === "countdown" &&
        countdown !== null &&
        renderCountdown()}
      {!isEliminated && phase === "gameOver" && renderGameOver()}
      {!isEliminated &&
        phase === "game" &&
        role &&
        showWordOverlay &&
        renderWordOverlay()}
      {showVotingOverlay && renderVotingOverlay()}

      {/* Game over screen shows for everyone regardless of elimination status */}
      {phase === "gameOver" && renderGameOver()}

      <div
        className={`main-content ${
          phase === "lobby" || (phase === "game" && !isEliminated)
            ? ""
            : "blurred"
        }`}
      >
        {!joined ? (
          <div className="join-screen">
            <h1 className="title">Word Imposter</h1>
            {!isConnected && (
              <div
                style={{
                  background:
                    connectionStatus === "failed"
                      ? "rgba(255, 77, 77, 0.3)"
                      : "rgba(255, 193, 7, 0.3)",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                  color:
                    connectionStatus === "failed"
                      ? "var(--accent-red)"
                      : "#ffc107",
                  fontSize: "0.9rem",
                  border: `1px solid ${
                    connectionStatus === "failed"
                      ? "var(--accent-red)"
                      : "#ffc107"
                  }`,
                }}
              >
                {connectionStatus === "connecting" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid #ffc107",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                      🔄 Connecting to server...
                    </div>
                    {isMobileDevice && (
                      <div style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
                        📱 Optimizing for mobile connection...
                        <br />
                        Using HTTP polling for better compatibility
                      </div>
                    )}
                  </>
                )}
                {connectionStatus === "reconnecting" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid #ffc107",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                      🔄 Reconnecting... (Attempt {connectionAttempts})
                    </div>
                    <div style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
                      Please wait, trying to restore connection
                    </div>
                  </>
                )}
                {connectionStatus === "failed" && (
                  <>
                    ⚠️ Connection failed
                    <div style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
                      {networkStatus === "offline"
                        ? isMobileDevice
                          ? "📱 Connection issues detected - please check your WiFi"
                          : "📵 No internet connection detected"
                        : "Please check your internet connection and try refreshing the page"}
                    </div>
                    <button
                      onClick={() => {
                        setConnectionStatus("connecting");
                        setConnectionAttempts(0);
                        setNetworkStatus("online"); // Reset network status
                        if (isMobileDevice) {
                          console.log(
                            "📱 Mobile manual reconnection - attempting direct socket connection"
                          );
                          // For mobile, try direct socket connection instead of HTTP test
                          socket.connect();
                        } else {
                          socket.connect();
                        }
                      }}
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.25rem 0.5rem",
                        background: "var(--accent-red)",
                        color: "white",
                        border: "none",
                        borderRadius: "0.25rem",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        marginRight: "0.5rem",
                      }}
                      disabled={networkStatus === "offline"}
                    >
                      {networkStatus === "offline"
                        ? "Waiting for network..."
                        : isMobileDevice
                        ? "🔄 Retry Mobile Connection"
                        : "Try Again"}
                    </button>
                    {connectionAttempts > 3 && (
                      <button
                        onClick={() => window.location.reload()}
                        style={{
                          marginTop: "0.5rem",
                          padding: "0.25rem 0.5rem",
                          background: "#ffc107",
                          color: "black",
                          border: "none",
                          borderRadius: "0.25rem",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        🔄 Refresh Page
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
            <div className="input-group">
              <input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-input"
              />
              <input
                placeholder="Room Code (leave empty to create)"
                value={roomCode}
                onChange={(e) =>
                  setRoomCode(e.target.value.toUpperCase().replace(/\s/g, ""))
                }
                className="text-input"
              />
              <div className="button-group">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    createRoom(e);
                  }}
                  className="create-button"
                  type="button"
                  disabled={!isConnected || !name.trim()}
                >
                  Create Room
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    joinRoom(e);
                  }}
                  className="join-button"
                  type="button"
                  disabled={!isConnected || !name.trim() || !roomCode.trim()}
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        ) : phase === "game" && !showWordOverlay && !isEliminated ? (
          <div className="game-screen">
            {/* Discussion Phase UI */}
            {discussionCountdown !== null ? (
              <div className="discussion-phase">
                {/* Minimal horizontal info bar */}
                <div className="game-info-bar">
                  <div className="countdown-mini">
                    <span className="countdown-label">⏱️</span>
                    <span className="countdown-time">
                      {discussionCountdown}s
                    </span>
                  </div>
                  <div className="role-section">
                    <span
                      className={`role-indicator ${
                        role === "imposter" ? "imposter" : "player"
                      }`}
                    >
                      {role === "imposter" ? "🕵️ IMPOSTER" : "👥 PLAYER"}
                    </span>
                  </div>
                  <div
                    className={`word-section ${
                      role === "imposter" ? "imposter" : "player"
                    }`}
                  >
                    <span className="word-label">Word:</span>
                    <span className="word-value">
                      {role === "imposter" ? impostorWord || "???" : secretWord}
                    </span>
                  </div>
                </div>

                {/* Full-screen chat overlay */}
                <div className="chat-overlay">
                  <div className="chat-overlay-content">
                    <div className="chat-header">
                      <h2>💬 Discussion Chat</h2>
                      <p>Share clues about your word and find the imposter!</p>

                      {/* Turn system indicator */}
                      {isTurnSystemActive && (
                        <div className="turn-indicator">
                          <div className="turn-info">
                            <span className="current-turn">
                              {currentTurnPlayerId === mySocketId ? (
                                <span className="your-turn">🎯 Your Turn!</span>
                              ) : (
                                <span className="other-turn">
                                  🕰️ {currentTurnPlayerName}'s Turn
                                </span>
                              )}
                            </span>
                            <span className="turn-progress">
                              ({turnIndex}/{totalPlayers})
                            </span>
                          </div>
                          <div className="turn-timer">
                            <span className="timer-text">
                              ⏱️ {turnTimeLeft}s
                            </span>
                            <div className="timer-bar">
                              <div
                                className="timer-progress"
                                style={{
                                  width: `${
                                    (turnTimeLeft / turnDuration) * 100
                                  }%`,
                                  backgroundColor:
                                    turnTimeLeft <= 5
                                      ? "#ff4d4d"
                                      : turnTimeLeft <= 10
                                      ? "#ffa500"
                                      : "#4caf50",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="chat-messages-container">
                      {chatMessages.length === 0 ? (
                        <div className="chat-empty">
                          <p>
                            💬 Start the discussion! Share clues about your
                            word.
                          </p>
                        </div>
                      ) : (
                        chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`chat-message ${
                              msg.senderId === mySocketId ? "own-message" : ""
                            }`}
                          >
                            <div className="message-header">
                              <span className="sender-name">
                                {msg.senderName}
                              </span>
                              <span className="message-time">
                                {new Date(msg.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="message-content">{msg.message}</div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="chat-input-section">
                      {isTurnSystemActive &&
                        currentTurnPlayerId !== mySocketId && (
                          <div className="waiting-turn-message">
                            <p>
                              ⏳ Waiting for {currentTurnPlayerName} to speak...
                            </p>
                          </div>
                        )}

                      <div className="chat-input-container">
                        <input
                          type="text"
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          placeholder={
                            isTurnSystemActive &&
                            currentTurnPlayerId !== mySocketId
                              ? "Wait for your turn..."
                              : "Type your message..."
                          }
                          maxLength={200}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              sendChatMessage();
                            }
                          }}
                          disabled={
                            isEliminated ||
                            (isTurnSystemActive &&
                              currentTurnPlayerId !== mySocketId)
                          }
                          className="chat-input"
                        />
                        <button
                          onClick={sendChatMessage}
                          disabled={
                            !currentMessage.trim() ||
                            isEliminated ||
                            (isTurnSystemActive &&
                              currentTurnPlayerId !== mySocketId)
                          }
                          className="send-button"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Non-discussion phases - simpler layout */
              <div className="simple-game-layout">
                {/* Voting countdown banner */}
                {votingCountdown !== null && !showVotingOverlay && (
                  <div className="countdown-banner">
                    <div className="countdown-content">
                      <h3>🗳️ Voting Time!</h3>
                      <div className="countdown-number">{votingCountdown}</div>
                      <p>Discuss and vote for who you think the imposter is</p>
                      {votingCountdown <= 10 && (
                        <p className="countdown-warning">
                          Time's running out - cast your vote!
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="room-header">
                  <h2>
                    <span className="room-icon">🎮</span>
                    Game in Progress
                  </h2>
                  <p>Room: {roomCode}</p>
                </div>

                {/* Show different content based on whether host is participating or not */}
                {isRoomCreator &&
                hostId === mySocketId &&
                hostIsModerator &&
                !role ? (
                  <div className="host-observer-info">
                    <div
                      style={{
                        background: "rgba(255, 77, 77, 0.1)",
                        border: "2px solid rgba(255, 77, 77, 0.3)",
                        borderRadius: "1rem",
                        padding: "1.5rem",
                        margin: "1rem 0",
                        textAlign: "center",
                      }}
                    >
                      <h3
                        style={{
                          color: "var(--accent-red)",
                          marginBottom: "1rem",
                        }}
                      >
                        👑 Host Observer Mode
                      </h3>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          marginBottom: "1rem",
                        }}
                      >
                        You are observing the game since you provided the custom
                        words.
                      </p>
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "0.5rem",
                          padding: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <p
                          style={{ fontWeight: "600", marginBottom: "0.5rem" }}
                        >
                          Words in play:
                        </p>
                        <p style={{ color: "var(--success)" }}>
                          Players: {customWord}
                        </p>
                        <p style={{ color: "var(--accent-red)" }}>
                          Imposter: {customImposterWord}
                        </p>
                      </div>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Watch the players discuss and try to find the imposter!
                      </p>
                    </div>
                  </div>
                ) : null}

                {isRoomCreator && hostId === mySocketId && (
                  <div className="game-action-buttons">
                    <button onClick={endGame} className="end-button">
                      End Game
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : !isEliminated ? (
          <div className="room-screen">
            <div className="room-header">
              <h2>
                <span className="room-icon">🏠</span>
                Room:{" "}
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                  {roomCode}
                </span>
                <button onClick={copyRoomCode} className="copy-button">
                  Copy
                </button>
              </h2>
              <p>
                {players.length} {players.length === 1 ? "player" : "players"}{" "}
                connected
              </p>
            </div>

            <div className="players-list">
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                  color: "#FFFFFF",
                }}
              >
                Players
              </h3>
              <ul>
                {players.map((p) => (
                  <li
                    key={p.id}
                    className={p.id === hostId ? "host" : ""}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#FFFFFF",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "#4CAF50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ color: "#FFFFFF" }}>{p.name}</span>
                    {p.id === hostId && <span className="host-badge">👑</span>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Game settings preview for non-host players only */}
            {!(isRoomCreator && hostId === mySocketId) && (
              <div className="game-settings-preview">
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    color: "#FFFFFF",
                  }}
                >
                  Game Settings
                </h3>
                <div className="settings-grid">
                  <div className="setting-item">
                    <span
                      className="setting-label"
                      style={{ color: "#FFFFFF" }}
                    >
                      Discussion Time:
                    </span>
                    <span
                      className="setting-value"
                      style={{ color: "#FFFFFF" }}
                    >
                      {typeof discussionTime === "string"
                        ? "120"
                        : discussionTime}{" "}
                      seconds
                    </span>
                  </div>
                  <div className="setting-item">
                    <span
                      className="setting-label"
                      style={{ color: "#FFFFFF" }}
                    >
                      Voting Time:
                    </span>
                    <span
                      className="setting-value"
                      style={{ color: "#FFFFFF" }}
                    >
                      {typeof votingTime === "string" ? "60" : votingTime}{" "}
                      seconds
                    </span>
                  </div>
                </div>
              </div>
            )}

            {isRoomCreator && hostId === mySocketId && (
              <div className="game-controls">
                {!gameStarted && (
                  <div className="game-settings">
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                        color: "#FFFFFF",
                      }}
                    >
                      Game Settings
                    </h3>

                    <div className="word-source-selector">
                      <label
                        style={{
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <input
                          type="radio"
                          value="random"
                          checked={wordSource === "random"}
                          onChange={() => {
                            console.log("📻 Setting wordSource to: random");
                            setWordSource("random");
                            setHostIsModerator(false); // Host participates with random words
                            // Broadcast word source change to all players
                            socket.emit("updateWordSource", {
                              roomCode,
                              wordSource: "random",
                              hostIsModerator: false,
                            });
                          }}
                          aria-label="Select random word option"
                        />
                        Random Word
                      </label>
                      <label
                        style={{
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <input
                          type="radio"
                          value="custom"
                          checked={wordSource === "custom"}
                          onChange={() => {
                            console.log("📻 Setting wordSource to: custom");
                            setWordSource("custom");
                            setHostIsModerator(true); // Host moderates with custom words
                            // Broadcast word source change to all players
                            socket.emit("updateWordSource", {
                              roomCode,
                              wordSource: "custom",
                              hostIsModerator: true,
                            });
                          }}
                          aria-label="Select custom word option"
                        />
                        Custom Word
                      </label>
                    </div>

                    {/* No category selection needed for random words - server chooses */}

                    {wordSource === "custom" && (
                      <div className="custom-word-input">
                        <input
                          type="text"
                          value={customWord}
                          onChange={(e) => setCustomWord(e.target.value)}
                          placeholder="Enter word for players"
                          aria-label="Word for players"
                          style={{
                            background: "var(--card-bg)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--text-secondary)",
                            borderRadius: "0.25rem",
                            padding: "0.5rem",
                          }}
                        />
                        <input
                          type="text"
                          value={customImposterWord}
                          onChange={(e) =>
                            setCustomImposterWord(e.target.value)
                          }
                          placeholder="Enter word for imposter"
                          aria-label="Word for imposter"
                          style={{
                            background: "var(--card-bg)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--text-secondary)",
                            borderRadius: "0.25rem",
                            padding: "0.5rem",
                          }}
                        />
                      </div>
                    )}

                    <div className="imposter-mode-selector">
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginTop: "1rem",
                          color: "#FFFFFF",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={imposterGetsWord}
                          onChange={(e) =>
                            setImposterGetsWord(e.target.checked)
                          }
                          aria-label="Give imposter a different word"
                        />
                        <span>Give imposter a different word</span>
                      </label>
                    </div>

                    <div className="voting-time-selector">
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginTop: "1rem",
                        }}
                      >
                        <span
                          style={{
                            width: "180px",
                            textAlign: "left",
                            color: "#FFFFFF",
                          }}
                        >
                          Discussion time (seconds):
                        </span>
                        <input
                          type="number"
                          min="10"
                          max="300"
                          step="30"
                          value={discussionTime}
                          placeholder="Enter seconds: 10-300"
                          aria-label="Discussion time in seconds"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              setDiscussionTime("");
                            } else {
                              const numValue = parseInt(value);
                              if (!isNaN(numValue) && numValue >= 0) {
                                setDiscussionTime(numValue);
                                // Emit real-time update to other players
                                socket.emit("updateTimers", {
                                  roomCode,
                                  discussionTime: numValue,
                                  votingTime:
                                    typeof votingTime === "string"
                                      ? 60
                                      : votingTime,
                                });
                              }
                            }
                          }}
                          style={{
                            width: "80px",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            border: "1px solid var(--text-secondary)",
                            background: "var(--card-bg)",
                            color: "var(--text-primary)",
                          }}
                        />
                      </label>
                    </div>

                    <div className="voting-time-selector">
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginTop: "1rem",
                        }}
                      >
                        <span
                          style={{
                            width: "180px",
                            textAlign: "left",
                            color: "#FFFFFF",
                          }}
                        >
                          Voting time (seconds):
                        </span>
                        <input
                          type="number"
                          min="10"
                          max="300"
                          step="10"
                          value={votingTime}
                          placeholder="Enter seconds: 10-300"
                          aria-label="Voting time in seconds"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              setVotingTime("");
                            } else {
                              const numValue = parseInt(value);
                              if (!isNaN(numValue) && numValue >= 0) {
                                setVotingTime(numValue);
                                // Emit real-time update to other players
                                socket.emit("updateTimers", {
                                  roomCode,
                                  discussionTime:
                                    typeof discussionTime === "string"
                                      ? 120
                                      : discussionTime,
                                  votingTime: numValue,
                                });
                              }
                            }
                          }}
                          style={{
                            width: "80px",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            border: "1px solid var(--text-secondary)",
                            background: "var(--card-bg)",
                            color: "var(--text-primary)",
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}

                <div className="game-action-buttons">
                  {!gameStarted ? (
                    <button
                      onClick={startGame}
                      className="start-button"
                      disabled={isStartingGame}
                      aria-label="Start the game"
                      style={{
                        transform: isStartingGame ? "none" : "scale(1)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) => {
                        if (!isStartingGame) {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isStartingGame) {
                          e.currentTarget.style.transform = "scale(1)";
                        }
                      }}
                    >
                      {isStartingGame && (
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            border: "2px solid #ffffff",
                            borderTop: "2px solid transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        />
                      )}
                      Start Game
                    </button>
                  ) : (
                    <button
                      onClick={endGame}
                      className="end-button"
                      aria-label="End the game"
                    >
                      End Game
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Eliminated players see nothing in main content - only the elimination overlay
          <div className="eliminated-main-content">
            {/* Intentionally empty - eliminated players only see the elimination overlay */}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
