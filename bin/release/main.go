// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"os/exec"
	"time"
)

const packageName = "x-twitter-scraper"

type manifest struct {
	Name    string `json:"name"`
	Version string `json:"version"`
	GitHead string `json:"gitHead"`
	Dist    struct {
		Integrity string `json:"integrity"`
	} `json:"dist"`
}

type result struct {
	Status    string `json:"status"`
	Name      string `json:"name"`
	Version   string `json:"version"`
	Source    string `json:"source"`
	Integrity string `json:"integrity,omitempty"`
}

func main() {
	output, err := run(os.Args[1:])
	if err != nil {
		_ = json.NewEncoder(os.Stderr).Encode(struct {
			Error string `json:"error"`
		}{err.Error()})
		os.Exit(1)
	}
	if err := json.NewEncoder(os.Stdout).Encode(output); err != nil {
		os.Exit(1)
	}
}

func run(args []string) (result, error) {
	if len(args) < 2 || (args[0] != "check" && args[0] != "publish") {
		return result{}, errors.New("Use check <source SHA> or publish <source SHA> <archive> <sha512 integrity>.")
	}
	if (args[0] == "check" && len(args) != 2) || (args[0] == "publish" && len(args) != 4) {
		return result{}, errors.New("Supply the source SHA and, when publishing, the qualified archive and integrity.")
	}
	source, err := checkSource(args[1])
	if err != nil {
		return result{}, err
	}
	output := result{Status: "ready", Name: source.Name, Version: source.Version, Source: args[1]}
	if args[0] == "check" {
		if _, err := authenticatedRegistry(); err != nil {
			return result{}, err
		}
		return output, nil
	}
	archive, cleanup, err := qualifiedArchive(args[2], args[3], source, args[1])
	if err != nil {
		return result{}, err
	}
	defer cleanup()
	output.Integrity = args[3]
	registry, err := authenticatedRegistry()
	if err != nil {
		return result{}, err
	}
	registered, exists, err := registryVersion(registry, source)
	if err != nil {
		return result{}, err
	}
	if exists {
		if err := checkRegistry(registered, output); err != nil {
			return result{}, err
		}
		output.Status = "already-published"
		return output, nil
	}
	if _, err := checkSource(args[1]); err != nil {
		return result{}, err
	}
	if _, err := npmCommand(registry, "publish", archive, "--ignore-scripts", "--dry-run=false", "--provenance=false", "--access=public", "--tag=latest", "--json", "--loglevel=error"); err != nil {
		return result{}, errors.New("npm publication failed. Check the registry before retrying this qualified archive.")
	}
	registered, exists, err = registryVersion(registry, source)
	if err != nil {
		return result{}, err
	}
	if !exists {
		return result{}, errors.New("Published version is missing from the registry. Check the registry before retrying.")
	}
	if err := checkRegistry(registered, output); err != nil {
		return result{}, err
	}
	output.Status = "published"
	return output, nil
}

func command(name string, args ...string) ([]byte, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	cmd := exec.CommandContext(ctx, name, args...)
	cmd.WaitDelay = time.Second
	return cmd.Output()
}
