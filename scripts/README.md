# @alg/isbn scripts

Group elements are allocated by the ISBN Registration Authority. These define
the valid (although, not necessarily assigned) GS1, Group, and Registrant
element ranges.

The currently assigned ranges can be downloaded from the International ISBN
Agency website[^1]. A copy of these has been downloaded and converted to a
JSON format used to validate ISBN strings. The `rangeMessageToJson.js` script
is a Deno script that converts the `RangeMessage.xml` download to a JSON file
in the `src` directory. `sizes.sh` is a convenience script to display the
uncompressed and compressed sizes of this file.

These ranges do not indicate assigned Registrants, and there is no convenient
format containing the currently registered registrants. However, the ISBN
website provides search functionality[^2] that allows registered publishers to
be searched with the GS1, group, and registrant prefix.

[^1]: https://www.isbn-international.org/range_file_generation

[^2]: https://grp.isbn-international.org/search
