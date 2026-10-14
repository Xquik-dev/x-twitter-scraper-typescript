// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"encoding/json"
	"errors"
	"io"
	"os"
	"regexp"
	"strings"
)

func checkSource(expected string) (manifest, error) {
	if !regexp.MustCompile(`^[a-f0-9]{40}$`).MatchString(expected) {
		return manifest{}, errors.New("Supply the full qualified source SHA.")
	}
	status, err := command("git", "status", "--porcelain", "--untracked-files=all")
	if err != nil || len(status) != 0 {
		return manifest{}, errors.New("Source has changes or cannot be inspected. Use the clean qualified checkout.")
	}
	head, err := command("git", "rev-parse", "HEAD")
	if err != nil || strings.TrimSpace(string(head)) != expected {
		return manifest{}, errors.New("Source SHA differs from HEAD. Check out the qualified source commit.")
	}
	if _, err := command("git", "merge-base", "--is-ancestor", expected, "refs/remotes/origin/main"); err != nil {
		return manifest{}, errors.New("Source is not in origin/main. Fetch main and use its qualified merged commit.")
	}
	file, err := os.Open("package.json")
	if err != nil {
		return manifest{}, errors.New("Source package.json is missing. Use the package checkout.")
	}
	defer file.Close()
	var source manifest
	if err := decodeManifest(file, &source); err != nil || source.Name != packageName || !regexp.MustCompile(`^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$`).MatchString(source.Version) {
		return manifest{}, errors.New("Source package name or release version is invalid. Fix package.json before qualification.")
	}
	tag, err := command("git", "rev-parse", "--verify", "refs/tags/v"+source.Version+"^{commit}")
	if err != nil || strings.TrimSpace(string(tag)) != expected {
		return manifest{}, errors.New("Version tag differs from the source SHA. Use the qualified release tag.")
	}
	return source, nil
}

func decodeManifest(reader io.Reader, value *manifest) error {
	decoder := json.NewDecoder(reader)
	if err := decoder.Decode(value); err != nil {
		return err
	}
	var trailing json.RawMessage
	if err := decoder.Decode(&trailing); !errors.Is(err, io.EOF) {
		return errors.New("Package manifest has trailing content.")
	}
	return nil
}
