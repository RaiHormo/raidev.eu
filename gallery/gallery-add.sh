#!/usr/bin/env bash
database=./art-database.json
art_folder=../media/Artwork

filename=$(basename "$1")
date=$(date -r "$1" "+%Y-%b-%d")
cp "$1" "$art_folder"
cd "$art_folder"
avif
rm "$filename"
wl-copy ',
		{"filename":"'${filename/.png/}'",
		"title":"'${filename/.png/}'",
		"date":"'$date'",
		"tags": []
		}'
wl-paste
