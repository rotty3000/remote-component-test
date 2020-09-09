#!/bin/bash

set -e

DIST=$(git rev-parse --show-toplevel)/packages/simple-react-app/dist

yarn run rollup -c

if git diff --quiet -- "$DIST"; then
	echo 'Build finished, but there were no changes in the output.'
else
	git commit \
		-m 'chore: commit simple-react-app build artifacts (autogenerated)' \
		-- "$DIST"

	git --paginate log -1 --pretty=format:%B
fi