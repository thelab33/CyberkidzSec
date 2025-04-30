#!/usr/bin/env python
"""Developer Management CLI"""

import subprocess
import sys
import os

from src.app import create_app

app = create_app()

def run():
    """Run the Flask Dev Server"""
    app.run(host="0.0.0.0", port=5000, debug=True)

def test():
    """Run Pytest"""
    subprocess.run(["pytest", "tests/"], check=True)

def lint():
    """Run Ruff and Black on the project"""
    subprocess.run(["ruff", "src", "tests"], check=True)
    subprocess.run(["black", "src", "tests"], check=True)

def combine():
    """Combine JS files"""
    subprocess.run(["python", "src/combine-js.py"], check=True)

def seed():
    """Seed the database or mock data (future)"""
    print("Seeding database... [Coming soon!]")

commands = {
    "run": run,
    "test": test,
    "lint": lint,
    "combine": combine,
    "seed": seed,
}

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in commands:
        print("Available commands:")
        for cmd in commands:
            print(f"  {cmd}")
        sys.exit(1)

    cmd = sys.argv[1]
    commands[cmd]()

