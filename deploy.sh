#!/usr/bin/env bash

cd core && \
  yarn publish && \
  cd ../menu && \
  yarn publish && \
  cd ../dropdown && \
  yarn publish
