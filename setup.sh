#!/bin/bash

set -e

echo " Starforge Setup Mode: Flask Bootstrapper"

# Step 1: Bootstrap pip if needed
echo " Checking for pip..."
if ! python3 -m pip --version &>/dev/null; then
  echo " pip not found. Bootstrapping with ensurepip..."
  if ! python3 -m ensurepip --upgrade &>/dev/null; then
    echo " ensurepip failed. Using get-pip.py fallback..."
    curl -sS https://bootstrap.pypa.io/get-pip.py | python3
  fi
fi

# Step 2: Create virtual environment
echo " Creating virtual environment in ./venv"
python3 -m venv venv
source venv/bin/activate

# Step 3: Upgrade tooling
echo " Upgrading pip, setuptools, wheel"
pip install --upgrade pip setuptools wheel

# Step 4: Install requirements or just Flask
if [ -f requirements.txt ]; then
  echo " Installing from requirements.txt..."
  pip install -r requirements.txt
else
  echo " requirements.txt not found  installing Flask manually"
  pip install flask
fi

# Step 5: Run the app?
if [ -f run.py ]; then
  echo " Launching app..."
  python run.py
else
  echo " Setup complete. You can now run your Flask app manually."
fi

