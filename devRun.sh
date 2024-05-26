#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use v16.20.2

export $(cat ~/dev/env/.env | xargs)

PORT=9050 npm start "simulator"