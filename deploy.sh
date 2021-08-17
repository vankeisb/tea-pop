#!/usr/bin/env bash

echo "Publishing tea-pop-core..."
yarn --cwd core publish
echo "Publishing tea-pop-menu..."
yarn --cwd menu publish
echo "Publishing tea-pop-dropdown..."
yarn --cwd dropdown publish
echo "Publishing tea-pop-combobox..."
yarn --cwd combobox publish
