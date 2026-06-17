#!/usr/bin/env python3
import time
import sys
import os

WORK_MINUTES = 25
SHORT_BREAK = 5
LONG_BREAK = 15
SESSIONS_BEFORE_LONG = 4

def clear():
    os.system('clear')

def countdown(label, total_seconds):
    start = time.time()
    while True:
        elapsed = time.time() - start
        remaining = total_seconds - elapsed
        if remaining <= 0:
            break
        mins, secs = divmod(int(remaining), 60)
        bar_len = 30
        filled = int(bar_len * elapsed / total_seconds)
        bar = "█" * filled + "░" * (bar_len - filled)
        clear()
        print(f"\n  ⏱  {label}")
        print(f"\n  [{bar}]  {mins:02d}:{secs:02d}\n")
        print("  Press Ctrl+C to skip to next phase.\n")
        time.sleep(0.5)
    clear()

def beep():
    print("\a", end="", flush=True)

def run():
    session = 0
    streak = 0
    print("\n  🍅 Focus Timer — Pomodoro Style")
    print("  Press Enter to start, Ctrl+C to quit.\n")
    try:
        input("  > ")
    except KeyboardInterrupt:
        print("\n  Bye!\n")
        return

    while True:
        session += 1
        label = f"Work Session #{session}  (streak: {streak})"
        try:
            countdown(label, WORK_MINUTES * 60)
            streak += 1
            beep()
            print(f"\n  ✅ Session #{session} done! Streak: {streak}\n")
        except KeyboardInterrupt:
            streak = 0
            print(f"\n  ⏭  Skipped. Streak reset.\n")

        if session % SESSIONS_BEFORE_LONG == 0:
            break_label = f"Long Break ({LONG_BREAK} min)"
            break_secs = LONG_BREAK * 60
        else:
            break_label = f"Short Break ({SHORT_BREAK} min)"
            break_secs = SHORT_BREAK * 60

        print(f"  Starting {break_label}. Press Enter to skip.\n")
        try:
            countdown(break_label, break_secs)
            beep()
        except KeyboardInterrupt:
            print("  Break skipped.\n")

        print("  Press Enter for next session, or Ctrl+C to quit.\n")
        try:
            input("  > ")
        except KeyboardInterrupt:
            print(f"\n  Done! Total sessions: {session}, Final streak: {streak}\n")
            return

if __name__ == "__main__":
    run()
