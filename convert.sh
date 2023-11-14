#!/bin/bash

# This script fetches data from a remote API and writes it to files

# Fetch data from the API
data=$(curl -X GET "https://itell-strapi-um5h.onrender.com/api/pages?populate=*" -H "Cache-Control: no-store")

# Loop through the data
for i in $(seq 0 $(echo $data | jq '.data | length')); do
  curData=$(echo $data | jq ".data[$i].attributes")
  chapterID=$(echo $curData | jq -r '.chapter.data.id')

  # Fetch chapter data
  chapterData=$(curl -X GET "https://itell-strapi-um5h.onrender.com/api/chapters/$chapterID?populate=*" -H "Cache-Control: no-store")

  # Extract attributes from chapter data
  chapterDataAttributes=$(echo $chapterData | jq '.data.attributes')
  moduleTitle=$(echo $chapterDataAttributes | jq -r '.module.data.attributes.Title')
  chapterTitle=$(echo $chapterDataAttributes | jq -r '.Title')

  # Generate file path
  filePath=$(echo "$moduleTitle/$chapterTitle" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
  outputPath="output/$filePath"

  # Create the output subdirectory
  mkdir -p "$outputPath"

  # Create the filename
  filename="$outputPath/$(echo $curData | jq -r '.Title' | tr '[:upper:]' '[:lower:]' | tr ' ' '-').mdx"

  # Write data to file
  echo "---" > "$filename"
  echo "title: $(echo $curData | jq -r '.Title')" >> "$filename"
  echo "---" >> "$filename"

  # Loop through content
  for j in $(seq 0 $(echo $curData | jq '.Content | length')); do
    content=$(echo $curData | jq ".Content[$j]")

    if [[ $(echo $content | jq -r '.__component') == "page.chunk" ]]; then
      inputString="<div className=\"content-chunk\" data-subsection-id = \"$(echo $content | jq -r '.Header')\">"
      echo $inputString >> $filename
      echo $(echo $content | jq -r '.MDX') >> $filename
      echo "</div>" >> $filename
    elif [[ $(echo $content | jq -r '.__component') == "page.video" ]]; then
      # Handle video component
      :
    fi
  done
done
