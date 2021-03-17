#!/usr/bin/env bash

## Core
echo "Bumping tea-pop-core..."
yarn --silent --cwd core version --no-git-tag-version --new-version ${VERSION}

echo "Bumping tea-pop-core in deps..."
yarn --silent --cwd dropdown upgrade "tea-pop-core@${VERSION}"
yarn --silent --cwd menu upgrade "tea-pop-core@${VERSION}"
yarn --silent --cwd demo upgrade "tea-pop-core@${VERSION}"

## Menu
echo "Bumping tea-pop-menu..."
yarn --silent --cwd menu version --no-git-tag-version --new-version ${VERSION}

echo "Bumping tea-pop-menu in deps..."
yarn --silent --cwd demo upgrade "tea-pop-menu@${VERSION}"

## Dropdown
echo "Bumping tea-pop-dropdown..."
yarn --silent --cwd dropdown version --no-git-tag-version --new-version ${VERSION}

echo "Bumping tea-pop-dropdown in deps..."
yarn --silent --cwd demo upgrade "tea-pop-dropdown@${VERSION}"

## End
git status