#!/bin/bash

# Import required modules
source ./fetch.sh
source ./fs.sh

# Declare variables
data=""
filename=""

# Fetch data from API
res=$(fetch "https://itell-strapi-um5h.onrender.com/api/pages?populate=*" "{cache: \"no-store\"}")
data=$(echo "$res" | jq -r '.data')

# Handle errors
if [[ -n "$res" && "$res" != "null" ]]; then
  echo "$res"
  exit 1
fi

# Loop through data
for ((i=0; i<$(echo "$data" | jq -r '. | length'); i++)); do
  curData=$(echo "$data" | jq -r '.['"$i"'].attributes')
  filename="output/$(echo "$curData" | jq -r '.Title' | tr '[:upper:]' '[:lower:]' | tr -d '[:space:]').txt"

  # Write to file
  fs.writeFile "$filename" "---"
  fs.writeFile "$filename" "$(echo "$curData" | jq -r '.Title')"
  fs.writeFile "$filename" "---"

  # Loop through content
  for ((j=0; j<$(echo "$curData" | jq -r '.Content | length'); j++)); do
    curContent=$(echo "$curData" | jq -r '.Content['"$j"']')

    if [[ "$(echo "$curContent" | jq -r '.__component')" == "page.chunk" ]]; then
      inputString="<div className=\"content-chunk\" data-subsection-id = \"$(echo "$curContent" | jq -r '.Header')\">"
      fs.writeFile "$filename" "$inputString"
      fs.writeFile "$filename" "$(echo "$curContent" | jq -r '.MDX')"
      fs.writeFile "$filename" "</div>"
    elif [[ "$(echo "$curContent" | jq -r '.__component')" == "page.video" ]]; then
      # Handle page.video component
      :
    fi
  done
done
