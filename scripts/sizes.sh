#!/bin/sh

set -e

xml="RangeMessage.xml"
file="../src/range.json"

deno run -R -W rangeMessageToJson.js

xml_b=$(wc $xml -c | cut -d' ' -f1)
xml_kb=$(echo "scale=0 ; $xml_b / 1024" | bc)
gzip_xml_b=$(gzip $xml -c | wc -c | cut -d' ' -f1)
gzip_xml_kb=$(echo "scale=0 ; $gzip_xml_b / 1024" | bc)

echo "Uncompressed XML: $xml_b bytes ($xml_kb KB)"
echo "  compressed XML: $gzip_xml_b bytes ($gzip_xml_kb KB)"

b=$(wc $file -c | cut -d' ' -f1)
kb=$(echo "scale=0 ; $b / 1024" | bc)
gzip_b=$(gzip $file -c | wc -c | cut -d' ' -f1)
gzip_kb=$(echo "scale=0 ; $gzip_b / 1024" | bc)

echo "Uncompressed JSON: $b bytes ($kb KB)"
echo "  compressed JSON: $gzip_b bytes ($gzip_kb KB)"
