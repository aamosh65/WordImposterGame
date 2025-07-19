# Turn-Based Chat System

## Overview

The Word Imposter Game now features a turn-based chat system that prevents spam and creates a more structured discussion phase. Players take turns giving clues about their words, making the game more organized and strategic.

## How It Works

### Server-Side Implementation

- **Turn Order**: Randomly shuffled at the start of each discussion phase
- **Turn Duration**: 30 seconds per player (configurable)
- **Auto-Advance**: Automatically moves to next player after sending a message or when time runs out
- **No Skip Option**: Players must either speak or wait for timeout to maintain game integrity

### Client-Side Features

- **Turn Indicator**: Shows whose turn it is and remaining time
- **Visual Timer**: Progress bar that changes color as time runs out (green → orange → red)
- **Input Restrictions**: Only the current player can type and send messages
- **Timeout System**: Players advance automatically after 30 seconds if they don't speak

### Key Features

1. **Structured Discussion**: No more chat spam - one player speaks at a time
2. **Fair Participation**: Everyone gets equal time to contribute
3. **Visual Feedback**: Clear indicators of whose turn it is
4. **Mobile Responsive**: Works well on all device sizes
5. **Accessibility**: Clear visual and textual cues
6. **No Skip Option**: Encourages thoughtful participation - players must contribute or wait

## Addressing Imposter Gameplay Concerns

### The Challenge

When an imposter starts first and doesn't have a word, it can be extremely difficult for them to blend in.

### Implemented Solutions

1. **Random Turn Order**: Starting player is randomly selected, so imposters aren't always disadvantaged
2. **Strategic Waiting**: Imposters can use their turn to ask clarifying questions like:
   - "Should we focus on the physical aspects?"
   - "Are we thinking about the modern version or traditional?"
   - "Is this something you'd find indoors or outdoors?"

### Additional Gameplay Suggestions (for future implementation)

1. **Question Rounds**: Allow imposters to ask questions before giving clues
2. **Hint System**: Give imposters subtle hints about the category
3. **Observation Phase**: Allow 1-2 players to speak first before the imposter's turn
4. **Theme Clues**: Provide imposters with the general theme/category

## Technical Implementation

### New State Variables

- `currentTurnPlayerId`: ID of player whose turn it is
- `currentTurnPlayerName`: Name of current player
- `turnDuration`: Seconds per turn
- `turnTimeLeft`: Countdown timer
- `isTurnSystemActive`: Whether turn system is running

### New Socket Events

- `playerTurn`: Notifies all players of current turn
- `turnSystemStopped`: When discussion phase ends

### CSS Classes Added

- `.turn-indicator`: Main turn display container
- `.your-turn`/`.other-turn`: Turn status indicators
- `.timer-bar`/`.timer-progress`: Visual countdown
- `.waiting-turn-message`: Message when not your turn

## Usage

1. Game starts normally with word distribution
2. Turn system automatically initializes when discussion begins
3. Players take turns speaking in random order
4. Each player has 30 seconds to give a clue
5. Players must either speak or wait for timeout
6. System automatically advances to next player
7. Turn system stops when voting begins

## Benefits

- **Reduced Chaos**: No more overlapping conversations
- **Equal Participation**: Everyone gets a chance to speak
- **Strategic Depth**: Players must be more thoughtful with limited time
- **Better Mobile Experience**: Easier to follow on small screens
- **Imposter Balance**: Random turn order prevents consistent disadvantage
- **Encourages Engagement**: No skip option means players must think and contribute
