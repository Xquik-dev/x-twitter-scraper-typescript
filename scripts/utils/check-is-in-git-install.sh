#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2026 Xquik contributors
#
# SPDX-License-Identifier: Apache-2.0

# Check if you happen to call prepare for a repository that's already in node_modules.
[ "$(basename "$(dirname "$PWD")")" = 'node_modules' ] ||
# The name of the containing directory that 'npm` uses, which looks like
# $HOME/.npm/_cacache/git-cloneXXXXXX
[ "$(basename "$(dirname "$PWD")")" = 'tmp' ] ||
# The name of the containing directory that 'yarn` uses, which looks like
# $(yarn cache dir)/.tmp/XXXXX
[ "$(basename "$(dirname "$PWD")")" = '.tmp' ]
