#!/usr/bin/env bash
database=~/Documents/rai-fancy-site/gallery/art-database.json
art_folder=~/Documents/rai-fancy-site/media/Artwork

npx -y avif --input $1 --output $art_folder

#sed -i -e 's/        }\n    ]\n}/big/g' $database

