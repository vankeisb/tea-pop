#!/usr/bin/env bash

echo "Building tea-pop"

node -v

npm i
ll node_modules

npm install && \
  npm run bomlint && \
  cd core && \
  ./build.sh && \
  cd ../menu && \
  ./build.sh && \
  cd ../dropdown && \
  ./build.sh && \
  cd ../combobox && \
  ./build.sh && \
  cd ../demo && \
  ./build.sh
