#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2026 Xquik contributors
#
# SPDX-License-Identifier: Apache-2.0

set -euo pipefail

: "${GITHUB_REF_TYPE:?}"
: "${GITHUB_REF_NAME:?}"
: "${GITHUB_SHA:?}"
: "${DEFAULT_BRANCH:?}"
: "${EXPECTED_PACKAGE_NAME:?}"

if [[ "$GITHUB_REF_TYPE" != "tag" ]]; then
  echo "Release event is not a tag. Publish from a version tag." >&2
  exit 1
fi

if [[ ! "$GITHUB_REF_NAME" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Release tag is invalid. Use vMAJOR.MINOR.PATCH." >&2
  exit 1
fi

package_name="$(node -p "require('./package.json').name")"
package_version="$(node -p "require('./package.json').version")"
if [[ "$package_name" != "$EXPECTED_PACKAGE_NAME" ]]; then
  echo "Package name mismatch: ${package_name}. Use ${EXPECTED_PACKAGE_NAME}." >&2
  exit 1
fi

expected_tag="v${package_version}"
if [[ "$GITHUB_REF_NAME" != "$expected_tag" ]]; then
  echo "Tag mismatch: ${GITHUB_REF_NAME}. Use ${expected_tag}." >&2
  exit 1
fi

tag_commit="$(git rev-parse "refs/tags/${GITHUB_REF_NAME}^{commit}")"
if [[ "$tag_commit" != "$GITHUB_SHA" ]]; then
  echo "Release tag targets another commit. Tag the workflow commit." >&2
  exit 1
fi

git fetch --no-tags origin "$DEFAULT_BRANCH"
if ! git merge-base --is-ancestor "$GITHUB_SHA" "origin/${DEFAULT_BRANCH}"; then
  echo "Release commit is outside ${DEFAULT_BRANCH}. Merge it first." >&2
  exit 1
fi
