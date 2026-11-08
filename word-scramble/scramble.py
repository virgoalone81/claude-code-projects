#!/usr/bin/env python3
import random

WORDS = [
    # easy (4-5 letters)
    ("cat", "easy"), ("dog", "easy"), ("fish", "easy"), ("frog", "easy"),
    ("kite", "easy"), ("lamp", "easy"), ("moon", "easy"), ("rock", "easy"),
    # medium (6-7 letters)
    ("puzzle", "medium"), ("jungle", "medium"), ("castle", "medium"),
    ("bridge", "medium"), ("frozen", "medium"), ("planet", "medium"),
    ("rocket", "medium"), ("wizard", "medium"),
    # hard (8+ letters)
    ("elephant", "hard"), ("keyboard", "hard"), ("umbrella", "hard"),
    ("calendar", "hard"), ("champion", "hard"), ("discover", "hard"),
    ("language", "hard"), ("thousand", "hard"),
]

DIFFICULTY_COLORS = {
    "easy":   "\033[92m",  # green
    "medium": "\033[93m",  # yellow
    "hard":   "\033[91m",  # red
    "reset":  "\033[0m",
}

GUESSES = 3

def scramble(word):
    letters = list(word)
    while True:
        random.shuffle(letters)
        candidate = "".join(letters)
        if candidate != word:
            return candidate

def hint(word):
    revealed = list("_" * len(word))
    indices = random.sample(range(len(word)), max(1, len(word) // 3))
    for i in indices:
        revealed[i] = word[i]
    return " ".join(revealed)

def play():
    win_streak = 0
    total = 0
    wins = 0

    print("\n  🔤 Word Scramble")
    print("  Unscramble the word — you have 3 guesses and 1 hint per round.")
    print("  Type 'quit' to exit.\n")

    random.shuffle(WORDS)
    pool = WORDS[:]

    while True:
        if not pool:
            pool = WORDS[:]
            random.shuffle(pool)

        word, difficulty = pool.pop()
        scrambled = scramble(word)
        c = DIFFICULTY_COLORS[difficulty]
        reset = DIFFICULTY_COLORS["reset"]
        hint_used = False
        total += 1

        print(f"  Round {total} | Streak: {win_streak} | {c}{difficulty.upper()}{reset} ({len(word)} letters)")
        print(f"\n  Scrambled: {c}{scrambled.upper()}{reset}\n")

        guessed = False
        for attempt in range(1, GUESSES + 1):
            try:
                guess = input(f"  Guess {attempt}/{GUESSES} (or 'hint'): ").strip().lower()
            except KeyboardInterrupt:
                print(f"\n\n  Final score: {wins}/{total} | Streak: {win_streak}\n")
                return

            if guess in ("quit", "exit", "q"):
                print(f"\n  Final score: {wins}/{total}\n")
                return

            if guess == "hint" and not hint_used:
                hint_used = True
                print(f"  Hint: {hint(word)}\n")
                continue
            elif guess == "hint":
                print("  (hint already used)\n")
                continue

            if guess == word:
                wins += 1
                win_streak += 1
                print(f"\n  ✅ Correct! +1 streak → {win_streak}\n")
                guessed = True
                break
            else:
                print(f"  ✗ Nope.\n")

        if not guessed:
            win_streak = 0
            print(f"  ❌ The word was: {c}{word.upper()}{reset} | Streak reset.\n")

        try:
            input("  Press Enter for next word (Ctrl+C to quit)...\n")
        except KeyboardInterrupt:
            print(f"\n  Final score: {wins}/{total}\n")
            return

if __name__ == "__main__":
    play()
