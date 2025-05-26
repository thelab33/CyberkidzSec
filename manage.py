#!/usr/bin/env python
"""Developer Management CLI"""

import subprocess
import sys
import os
import logging
import argparse
from src.app import create_app

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

app = create_app()

def run(port: int = 5000, debug: bool = True):
    """Run the Flask Dev Server"""
    logging.info(f"Starting Flask dev server on 0.0.0.0:{port} with debug={debug}")
    app.run(host="0.0.0.0", port=port, debug=debug)

def test():
    """Run Pytest"""
    logging.info("Running pytest on tests/ ...")
    try:
        subprocess.run(["pytest", "tests/"], check=True)
        logging.info("Tests completed successfully.")
    except subprocess.CalledProcessError as e:
        logging.error(f"Tests failed: {e}")
        sys.exit(e.returncode)

def lint():
    """Run Ruff and Black on the project"""
    logging.info("Running ruff linting...")
    try:
        subprocess.run(["ruff", "src", "tests"], check=True)
        logging.info("Ruff linting completed successfully.")
    except subprocess.CalledProcessError as e:
        logging.error(f"Ruff linting failed: {e}")
        sys.exit(e.returncode)

    logging.info("Running black formatting...")
    try:
        subprocess.run(["black", "src", "tests"], check=True)
        logging.info("Black formatting completed successfully.")
    except subprocess.CalledProcessError as e:
        logging.error(f"Black formatting failed: {e}")
        sys.exit(e.returncode)

def combine():
    """Combine JS files"""
    logging.info("Running combine-js.py script...")
    try:
        subprocess.run([sys.executable, "src/combine-js.py"], check=True)
        logging.info("JS combine completed successfully.")
    except subprocess.CalledProcessError as e:
        logging.error(f"JS combine script failed: {e}")
        sys.exit(e.returncode)

def seed():
    """Seed the database or mock data (future)"""
    logging.info("Seeding database... [Coming soon!]")
    print("Seeding database... [Coming soon!]")

def main():
    parser = argparse.ArgumentParser(
        description="Developer Management CLI for running dev tasks"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # run command
    run_parser = subparsers.add_parser("run", help="Run the Flask dev server")
    run_parser.add_argument(
        "--port", type=int, default=5000, help="Port number to run the server on"
    )
    run_parser.add_argument(
        "--no-debug", action="store_true", help="Disable debug mode"
    )

    # other commands
    subparsers.add_parser("test", help="Run pytest")
    subparsers.add_parser("lint", help="Run Ruff and Black")
    subparsers.add_parser("combine", help="Combine JS files")
    subparsers.add_parser("seed", help="Seed the database or mock data")

    args = parser.parse_args()

    if args.command == "run":
        run(port=args.port, debug=not args.no_debug)
    elif args.command == "test":
        test()
    elif args.command == "lint":
        lint()
    elif args.command == "combine":
        combine()
    elif args.command == "seed":
        seed()
    else:
        parser.print_help()
        sys.exit(1)

if __name__ == "__main__":
    main()

