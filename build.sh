#!/usr/bin/env bash

yarn install && \
  cd core && \
  ./build.sh && \
  cd ../demo && \
  ./build.sh
