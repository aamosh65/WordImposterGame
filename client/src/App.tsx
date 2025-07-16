import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import "./App.css";

const backendUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : `${window.location.protocol}//${window.location.hostname}:3001`;

const socket: Socket = io(backendUrl, {
  transports: ["polling", "websocket"],
  autoConnect: true,
  reconnection: true,
  timeout: 5000,
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
  const [wordSource, setWordSource] = useState("category");
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
      console.log("Socket connected with ID:", socket.id);
      setMySocketId(socket.id || "");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    };

    const handlePlayerListUpdate = (
      players: { id: string; name: string }[]
    ) => {
      setPlayers(players);
    };

    const handleHostId = (hostId: string) => {
      // Only update hostId if we don't already have a host or if it's the first time
      // This prevents unauthorized host transfers during gameplay
      if (!gameStarted) {
        setHostId(hostId);
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
      setTimeout(() => resetGameState(), 5000);
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

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
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

    socket.on("discussionEnded", () => {
      setDiscussionCountdown(null);
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
      setMySocketId(socket.id || "");
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
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
  ]);

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

  const resetGameState = () => {
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
    setWordSource("category");
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
    setShowVotingOverlay(false);
    setSelectedVote("");
    setVotingStarted(false);
    setIsEliminated(false);
    setAllEliminatedPlayers([]);
    setFinalVotingCountdown(null);
    setFinalVoteCounts({ continueVotes: 0, endVotes: 0, totalVoters: 0 });
    // Don't reset host information when resetting game state
    // Only reset when leaving the room completely
  };

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
    if (!roomCode || roomCode.trim() === "") {
      alert("Please enter a room code");
      return;
    }

    console.log("Joining room:", roomCode, "with name:", name); // Debug log

    socket.emit(
      "joinRoom",
      { name: name.trim(), roomCode: roomCode.trim().toUpperCase() },
      (res: {
        error?: string;
        players: { id: string; name: string }[];
        hostId?: string;
        isOriginalHost?: boolean;
      }) => {
        if (res.error) {
          alert(res.error);
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
                ([playerId, result]) => (
                  <div key={playerId} className="vote-result">
                    <span className="player-name">{result.name}</span>
                    <span className="vote-count">{result.votes} votes</span>
                  </div>
                )
              )}
            </div>

            {votingResults.eliminatedPlayers.length > 1 ? (
              <div className="eliminated-players">
                <h3>
                  🤝 Tie - Multiple Players with {votingResults.maxVotes} votes
                  each:
                </h3>
                {votingResults.eliminatedPlayers.map(
                  (player: { id: string; name: string }) => (
                    <div key={player.id} className="eliminated-player">
                      {player.name}
                    </div>
                  )
                )}
              </div>
            ) : votingResults.eliminatedPlayers.length === 1 ? (
              <div className="eliminated-players">
                <h3>Most Voted:</h3>
                {votingResults.eliminatedPlayers.map(
                  (player: { id: string; name: string }) => (
                    <div key={player.id} className="eliminated-player">
                      {player.name}
                    </div>
                  )
                )}
              </div>
            ) : (
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

            {/* Live vote counts */}
            <div
              className="final-vote-counts"
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}
            >
              <div
                style={{
                  background: "rgba(76, 175, 80, 0.2)",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--success)",
                }}
              >
                <div style={{ color: "var(--success)", fontWeight: 600 }}>
                  👍 Continue: {finalVoteCounts.continueVotes}
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255, 77, 77, 0.2)",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--accent-red)",
                }}
              >
                <div style={{ color: "var(--accent-red)", fontWeight: 600 }}>
                  👎 End: {finalVoteCounts.endVotes}
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                }}
              >
                <div
                  style={{ color: "var(--text-secondary)", fontWeight: 600 }}
                >
                  Total: {finalVoteCounts.totalVoters}
                </div>
              </div>
            </div>

            <p>Do you think the imposter was voted out?</p>
            <div className="final-voting-buttons">
              <button
                className={`final-vote-button continue ${
                  hasFinalVoted || isEliminated || isModerator ? "disabled" : ""
                }`}
                onClick={() =>
                  !hasFinalVoted &&
                  !isEliminated &&
                  !isModerator &&
                  submitFinalVote(true)
                }
                disabled={hasFinalVoted || isEliminated || isModerator}
              >
                👍 Continue Game
                <br />
                <small>The imposter is still among us</small>
              </button>
              <button
                className={`final-vote-button end ${
                  hasFinalVoted || isEliminated || isModerator ? "disabled" : ""
                }`}
                onClick={() =>
                  !hasFinalVoted &&
                  !isEliminated &&
                  !isModerator &&
                  submitFinalVote(false)
                }
                disabled={hasFinalVoted || isEliminated || isModerator}
              >
                👎 End Game
                <br />
                <small>The imposter was voted out</small>
              </button>
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

      {/* Discussion countdown overlay - only show for non-eliminated players */}
      {!isEliminated && phase === "game" && discussionCountdown !== null && (
        <div className="countdown-overlay">
          <div className="countdown-content">
            <h2>💬 Discussion Time!</h2>
            <div className="countdown-number">{discussionCountdown}</div>
            <p>Give clues about your word and listen to others</p>
            {discussionCountdown <= 10 && (
              <p
                style={{
                  color: "var(--accent-red)",
                  fontSize: "0.9rem",
                  marginTop: "0.5rem",
                }}
              >
                Discussion ending soon - voting comes next!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Voting countdown overlay - only show for non-eliminated players and if voting overlay is not active */}
      {!isEliminated &&
        phase === "game" &&
        votingCountdown !== null &&
        !showVotingOverlay && (
          <div className="countdown-overlay">
            <div className="countdown-content">
              <h2>🗳️ Voting Time!</h2>
              <div className="countdown-number">{votingCountdown}</div>
              <p>Discuss and vote for who you think the imposter is</p>
              {votingCountdown <= 10 && (
                <p
                  style={{
                    color: "var(--accent-red)",
                    fontSize: "0.9rem",
                    marginTop: "0.5rem",
                  }}
                >
                  Time is running out!
                </p>
              )}
            </div>
          </div>
        )}

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
                  background: "rgba(255, 77, 77, 0.2)",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                  color: "var(--accent-red)",
                  fontSize: "0.9rem",
                }}
              >
                ⚠️ Connecting to server...
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
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
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
            <div className="room-header">
              <h2>
                <span className="room-icon">🎮</span>
                Game in Progress
              </h2>
              <p>Room: {roomCode}</p>
            </div>

            <div className="players-list">
              <h3>Players</h3>
              <ul>
                {players.map((p) => (
                  <li key={p.id} className={p.id === hostId ? "host" : ""}>
                    {p.name}
                    {p.id === hostId && <span className="host-badge">👑</span>}
                  </li>
                ))}
              </ul>
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
                    style={{ color: "var(--accent-red)", marginBottom: "1rem" }}
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
                    <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
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
            ) : role ? (
              <div className="game-info">
                <p
                  style={{
                    marginTop: "1rem",
                    color: "var(--text-secondary)",
                    textAlign: "center",
                  }}
                >
                  {role === "imposter"
                    ? impostorWord
                      ? "🕵️ You are the IMPOSTER! Try to blend in without revealing your different word."
                      : "🕵️ You are the IMPOSTER! You have no word - listen carefully and try to figure out what everyone is describing!"
                    : "👥 You are a PLAYER! Describe your word to find the imposter."}
                </p>
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
        ) : !isEliminated ? (
          <div className="room-screen">
            <div className="room-header">
              <h2>
                <span className="room-icon">🏠</span>
                Room: {roomCode}
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
              <h3>Players</h3>
              <ul>
                {players.map((p) => (
                  <li key={p.id} className={p.id === hostId ? "host" : ""}>
                    {p.name}
                    {p.id === hostId && <span className="host-badge">👑</span>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Game settings preview for non-host players only */}
            {!(isRoomCreator && hostId === mySocketId) && (
              <div className="game-settings-preview">
                <h3>Game Settings</h3>
                <div className="settings-grid">
                  <div className="setting-item">
                    <span className="setting-label">Discussion Time:</span>
                    <span className="setting-value">
                      {typeof discussionTime === "string"
                        ? "120"
                        : discussionTime}{" "}
                      seconds
                    </span>
                  </div>
                  <div className="setting-item">
                    <span className="setting-label">Voting Time:</span>
                    <span className="setting-value">
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
                    <h3>Game Settings</h3>

                    <div className="word-source-selector">
                      <label>
                        <input
                          type="radio"
                          value="category"
                          checked={wordSource === "category"}
                          onChange={() => {
                            console.log("📻 Setting wordSource to: category");
                            setWordSource("category");
                            setHostIsModerator(false); // Host participates with category words
                            // Broadcast word source change to all players
                            socket.emit("updateWordSource", {
                              roomCode,
                              wordSource: "category",
                              hostIsModerator: false,
                            });
                          }}
                        />
                        Category Word
                      </label>
                      <label>
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
                        />
                        Custom Word
                      </label>
                    </div>

                    {wordSource === "category" && (
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="category-select"
                      >
                        {Object.keys(categories)
                          .concat("random")
                          .map((cat) => (
                            <option key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                          ))}
                      </select>
                    )}

                    {wordSource === "custom" && (
                      <div className="custom-word-input">
                        <input
                          type="text"
                          value={customWord}
                          onChange={(e) => setCustomWord(e.target.value)}
                          placeholder="Enter word for players"
                        />
                        <input
                          type="text"
                          value={customImposterWord}
                          onChange={(e) =>
                            setCustomImposterWord(e.target.value)
                          }
                          placeholder="Enter word for imposter"
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
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={imposterGetsWord}
                          onChange={(e) =>
                            setImposterGetsWord(e.target.checked)
                          }
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
                        <span>Discussion time (seconds):</span>
                        <input
                          type="number"
                          min="0"
                          step="30"
                          value={discussionTime}
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
                        <span>Voting time (seconds):</span>
                        <input
                          type="number"
                          min="0"
                          step="10"
                          value={votingTime}
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
                    <button onClick={startGame} className="start-button">
                      Start Game
                    </button>
                  ) : (
                    <button onClick={endGame} className="end-button">
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
