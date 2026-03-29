#!/bin/bash
export http_proxy="http://127.0.0.1:7890" && export https_proxy="http://127.0.0.1:7890"

echo "Map:"
curl -L -s "https://unsplash.com/s/photos/vintage-map" | grep -o 'photo-[0-9]\{13\}-[0-9a-f]\{12\}' | head -n 3
echo "Relation:"
curl -L -s "https://unsplash.com/s/photos/editorial-conversation" | grep -o 'photo-[0-9]\{13\}-[0-9a-f]\{12\}' | head -n 3
echo "Profile:"
curl -L -s "https://unsplash.com/s/photos/minimal-journal" | grep -o 'photo-[0-9]\{13\}-[0-9a-f]\{12\}' | head -n 3
echo "Tact:"
curl -L -s "https://unsplash.com/s/photos/wax-seal-letter" | grep -o 'photo-[0-9]\{13\}-[0-9a-f]\{12\}' | head -n 3
echo "Summary:"
curl -L -s "https://unsplash.com/s/photos/elegant-gift" | grep -o 'photo-[0-9]\{13\}-[0-9a-f]\{12\}' | head -n 3

