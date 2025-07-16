#! /bin/bash

# Add local dependencies to the package.json file

# Get the directory of the script
SCRIPT_DIR=$(dirname "$0")

# Add the local dependencies to the package.json file
sed -i '' 's/"@fencyai\/js": "[^"]*"/"@fencyai\/js": "file:..\/fency-js-packages\/packages\/js"/' "$SCRIPT_DIR/package.json"
sed -i '' 's/"@fencyai\/react": "[^"]*"/"@fencyai\/react": "file:..\/fency-js-packages\/packages\/react"/' "$SCRIPT_DIR/package.json"