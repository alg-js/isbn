#!/bin/sh
# Copyright 2025 @alg/isbn contributors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

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
