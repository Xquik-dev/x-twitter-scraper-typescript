// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"archive/tar"
	"compress/gzip"
	"crypto/sha512"
	"encoding/base64"
	"errors"
	"io"
	"os"
	"path"
	"path/filepath"
	"strings"
)

func qualifiedArchive(archive, integrity string, source manifest, expected string) (string, func(), error) {
	directory, err := os.MkdirTemp("", "npm-release-")
	if err != nil {
		return "", nil, errors.New("Cannot prepare the package copy. Check temporary storage before retrying.")
	}
	cleanup := func() { _ = os.RemoveAll(directory) }
	copyPath := filepath.Join(directory, source.Name+"-"+source.Version+".tgz")
	if err := copyArchive(archive, copyPath, integrity); err != nil {
		cleanup()
		return "", nil, err
	}
	if err := checkArchive(copyPath, source, expected); err != nil {
		cleanup()
		return "", nil, err
	}
	return copyPath, cleanup, nil
}

func copyArchive(archive, destination, integrity string) error {
	input, err := os.Open(archive)
	if err != nil {
		return errors.New("Qualified archive is missing. Supply the existing package archive.")
	}
	defer input.Close()
	output, err := os.OpenFile(destination, os.O_CREATE|os.O_EXCL|os.O_WRONLY, 0400)
	if err != nil {
		return errors.New("Cannot copy the qualified archive. Check temporary storage before retrying.")
	}
	hash := sha512.New()
	_, copyError := io.Copy(io.MultiWriter(output, hash), input)
	closeError := output.Close()
	if copyError != nil || closeError != nil {
		return errors.New("Archive integrity cannot be read. Restore the qualified archive.")
	}
	if "sha512-"+base64.StdEncoding.EncodeToString(hash.Sum(nil)) != integrity {
		return errors.New("Archive integrity differs from qualification. Restore the exact qualified archive.")
	}
	return nil
}

func checkArchive(archive string, source manifest, expected string) error {
	file, err := os.Open(archive)
	if err != nil {
		return errors.New("Copied archive cannot be read. Check temporary storage before retrying.")
	}
	defer file.Close()
	compressed, err := gzip.NewReader(file)
	if err != nil {
		return errors.New("Archive is not an npm gzip package. Rebuild and qualify the package.")
	}
	defer compressed.Close()
	reader := tar.NewReader(compressed)
	found := false
	for {
		header, err := reader.Next()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil || !strings.HasPrefix(header.Name, "package/") || strings.Contains(header.Name, `\`) || path.Clean(header.Name) != strings.TrimSuffix(header.Name, "/") {
			return errors.New("Archive contents are invalid. Rebuild and qualify the package.")
		}
		if header.Name != "package/package.json" {
			continue
		}
		if found || (header.Typeflag != tar.TypeReg && header.Typeflag != tar.TypeRegA) {
			return errors.New("Archive package.json is duplicated or not a file. Rebuild and qualify the package.")
		}
		var packaged manifest
		if err := decodeManifest(reader, &packaged); err != nil || packaged.Name != source.Name || packaged.Version != source.Version || packaged.GitHead != expected {
			return errors.New("Archive name, version or source SHA differs from qualification. Rebuild the qualified source.")
		}
		found = true
	}
	if _, err := io.Copy(io.Discard, compressed); err != nil {
		return errors.New("Archive checksum is invalid. Rebuild and qualify the package.")
	}
	if !found {
		return errors.New("Archive package.json is missing. Rebuild and qualify the package.")
	}
	return nil
}
