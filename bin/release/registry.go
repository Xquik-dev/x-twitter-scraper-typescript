// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"strings"
)

func authenticatedRegistry() (string, error) {
	data, err := command("npm", "config", "get", "registry", "--loglevel=error", "--update-notifier=false")
	if err != nil {
		return "", errors.New("npm registry configuration cannot be read. Check your approved npm configuration.")
	}
	registry, err := url.Parse(strings.TrimSpace(string(data)))
	if err != nil || registry.Host == "" || (registry.Scheme != "https" && registry.Scheme != "http") || registry.User != nil || registry.RawQuery != "" || registry.Fragment != "" {
		return "", errors.New("npm registry configuration is invalid. Use an HTTP or HTTPS registry without embedded credentials.")
	}
	if _, err := npmCommand(registry.String(), "whoami", "--json", "--loglevel=error"); err != nil {
		return "", errors.New("npm authentication failed. Run npm login, then retry with the approved account.")
	}
	return registry.String(), nil
}

func npmCommand(registry string, args ...string) ([]byte, error) {
	return command("npm", append(args, "--registry="+registry, "--update-notifier=false")...)
}

func registryVersion(registry string, source manifest) (manifest, bool, error) {
	data, err := npmCommand(registry, "view", source.Name+"@"+source.Version, "--json", "--loglevel=error")
	if err != nil {
		var response struct {
			Error struct {
				Code string `json:"code"`
			} `json:"error"`
		}
		if json.Unmarshal(data, &response) == nil && response.Error.Code == "E404" {
			return manifest{}, false, nil
		}
		return manifest{}, false, errors.New("Registry lookup failed. Check registry availability before retrying.")
	}
	var registered manifest
	if err := json.Unmarshal(data, &registered); err != nil {
		return manifest{}, false, errors.New("Registry metadata is invalid. Check the published version before retrying.")
	}
	return registered, true, nil
}

func checkRegistry(registered manifest, expected result) error {
	if registered.Name != expected.Name || registered.Version != expected.Version || registered.GitHead != expected.Source {
		return errors.New("Registry package identity or source SHA differs. Do not republish this immutable version.")
	}
	if registered.Dist.Integrity != expected.Integrity {
		return fmt.Errorf("Registry integrity differs for %s@%s. Do not republish this immutable version.", expected.Name, expected.Version)
	}
	return nil
}
