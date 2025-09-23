#!/usr/bin/env bash

echo "Publishing tea-pop-core..."
cd core && npm publish
echo "Publishing tea-pop-menu..."
cd menu && npm publish
echo "Publishing tea-pop-dropdown..."
cd dropdown && npm publish
echo "Publishing tea-pop-combobox..."
cd combobox && publish
