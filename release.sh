#!/usr/bin/env bash

 # exit if VERSION var not set
[[ -z "$VERSION" ]] && { echo "VERSION not set" ; exit 1; }

echo "Releasing VERSION=$VERSION"

# make sure develop & main are up to date
git co main 
git pull
git co develop
git pull

echo -n "Is it ok (y/n)? "
read answer
if [ "$answer" != "${answer#[Yy]}" ] ;then
    echo "Creating release branch"
else
    echo "Aborting"
    exit
fi

# start release branch
git flow release start $VERSION

# bump versions
node ./bump-version.js

echo "Versions bumped."
git st

echo -n "Commit and finish release (y/n)? "
read answer2
if [ "$answer2" != "${answer2#[Yy]}" ] ;then
    echo "Finishing release"
else
    echo "Aborting"
    exit
fi

git ci -a -m "bump versions $VERSION"
git flow release finish $VERSION

#echo "Pushing"
#git push --follow-tags
#git 






