#!/usr/bin/env bash

echo "Building tea-pop"

npm cache clean --force

node -v

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
