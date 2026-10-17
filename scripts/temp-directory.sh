# shellcheck shell=bash

# SPDX-FileCopyrightText: 2026 Xquik contributors
#
# SPDX-License-Identifier: Apache-2.0

remove_work_directory() {
  if [[ -n "${work_directory:-}" && -d "$work_directory" ]]; then
    chmod -R u+w -- "$work_directory" 2>/dev/null || true
    rm -rf -- "$work_directory"
  fi
}

work_directory="$(mktemp -d "${TMPDIR:-/tmp}/${1}.XXXXXX")"
exit_handler="${2:-remove_work_directory}"
trap '"$exit_handler"' EXIT
trap 'trap - INT; kill -INT "$$"' INT
trap 'exit 143' TERM
trap 'exit 129' HUP
export TMPDIR="${work_directory}/tmp"
mkdir "$TMPDIR"
