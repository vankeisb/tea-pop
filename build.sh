#!/usr/bin/env bash

yarn install && \
  cd core && \
  ./build.sh && \
  cd ../menu && \
  ./build.sh && \
  cd ../dropdown && \
  ./build.sh && \
  cd ../demo && \
  ./build.sh
