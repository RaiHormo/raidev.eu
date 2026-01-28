#!/usr/bin/env bash
database=~/Documents/rai-fancy-site/gallery/art-database.json
art_folder=~/Documents/rai-fancy-site/media/Artwork

filename=$(basename $1)
date=$(date -r $1 "+%Y-%b-%d")
cp $1 $art_folder
cd $art_folder
npx -y avif
rm $filename
wl-copy ',
		{"filename":"'${filename/.png/}'",
		"title":"'${filename/.png/}'",
		"date":"$date",
		"tags": []
		}'
wl-paste
