#!/bin/bash

IFS=$'\n'

echo "Empty directories:"
for dir in `find files -maxdepth 3 -mindepth 3 -type d -empty`
do
    user=$(basename "$dir")
    echo "- $user"
done

rm -rf output
mkdir -p output

for file in `find files -mindepth 3 -maxdepth 3 -type f \( -iname *.docx -o -iname *.txt -o -iname *.rtf \)`
do
    dir=$(dirname "$file")
    user=$(basename "$dir")
    if [ -d "output/$user" ]
    then
        echo "User $user has more than one file"
    else
        mkdir "output/$user"
    fi
    cp "$file" "output/$user"
done

for file in `find output -name *.docx`
do
    dir=$(dirname "$file")
    pandoc "$file" -o "${file%.docx}.txt"
done

for file in `find output -name *.rtf`
do
    dir=$(dirname "$file")
    pandoc "$file" -o "output/${file%.rtf}.txt"
done
