#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use v22.1.0

export $(cat ~/dev/env/.env | xargs)

PORT=9050 npm start "simulator"
