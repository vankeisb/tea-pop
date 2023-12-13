#!/usr/bin/env bash

set -e

echo "Building tea-pop"

npm install && \
  cd core && \
  ./build.sh && \
  cd ../components/menu && \
  ./build.sh && \
  cd ../sandbox && \
  ./build.sh

#yarn install && \
#yarn bomlint && \
#  cd core && \
#  ./build.sh && \
#  cd ../menu && \
#  ./build.sh && \
#  cd ../dropdown && \
#  ./build.sh && \
#  cd ../combobox && \
#  ./build.sh && \
#  cd ../demo && \
#  ./build.sh