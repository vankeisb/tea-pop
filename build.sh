#!/usr/bin/env bash

echo "Building tea-pop"

yarn install && \
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
