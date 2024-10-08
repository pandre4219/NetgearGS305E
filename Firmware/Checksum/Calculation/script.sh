#!/bin/bash

file=$1
mode=$2
extrainput=$3


if [ $# -lt 1 ]; then
        echo "Error: no arguments"
        echo "Usage: ./script.sh <file.bin> [mode] <additional>"
	echo "h / header	header mode"
	echo "p / print 	print header from file"
	echo "w / write	[value]	write value as header checksum"
	exit 1
fi



#check dependencies
if ! command -v xxd &> /dev/null; then
        echo "Error: xxd is not installed pls install to use this script"
	exit 1
fi



#filesize in base10
filesize=$(stat -c%s "$file")
hexsize=$(printf "%X\n" $filesize)
sum=0
selectedbyte=0
count=0



#headervars read from  file
magic_number_rff=$(xxd -p -s 0 -l 4 "$file")
length_rff=$(xxd -p -s 4 -l 4 "$file")
header_chksum_rff=$(xxd -p -s 8 -l 4 "$file")
payload_chksum_rff=$(xxd -p -s 12 -l 4 "$file")
reserved_rff=$(xxd -p -s 16 -l 4 "$file")



#functions
hexpad() {
    local hex=$1
    printf "%08x\n" $((16#$hex))
}

writebytes() {
        local inputfile="$1"
        local HEX_VALUE="$2"
        local startwriteat="$3"
        local lengthtowrite="$4"
        local oldbytes=$(xxd -p -s "$startwriteat" -l "$lengthtowrite" "$inputfile")
        if [ ${#HEX_VALUE} -ne 8 ]; then
                echo "Hexvalue must be 4 bytes"
                exit 1
        fi
BIN_DATA=$(echo "$HEX_VALUE" | sed 's/../\\x&/g')
#write in file
printf "$BIN_DATA" | dd of="$inputfile" bs=1 seek="$startwriteat" count="$lengthtowrite" conv=notrunc >/dev/null 2>&1
echo "0x$oldbytes at 0x$startwriteat-0x$(($startwriteat + $lengthtowrite)) was replaced with 0x$HEX_VALUE"
}




#header mode
if [ "$mode" = "h" ] || [ "$mode" = "header" ]; then
	echo "header mode:"
	if [ $filesize -lt 19 ]; then
		echo "Error: file to smol to contain 20 byte header"
		exit 69
	fi
        while [ $count -ne 20 ]; do
        	selectedbyte=$(hexpad $(xxd -p -s $count -l 1 "$file"))
		if [ $count -gt 7 ]  && [ $count -lt 12 ]; then
			selectedbyte=0
		fi
        	count=$((count + 1))
		echo "$count/$filesize : 0x$sum + 0x$selectedbyte"
		sum=$(printf "%X\n" $((16#$sum + 16#$selectedbyte)))
		#echo "$count 0x$sum + 0x$selectedbyte"
	done
	echo "header_chksum : 0x$(hexpad $sum)"
	read -p "Want to overwrite old chksum? Y/N  " yn
	case $yn in
		[Yy]* ) writebytes "$file" "$(hexpad $sum)" 8 4; exit 0;;
		[Nn]* ) exit 0;;
        	* ) echo "Process failed successfully";;
	esac
	exit 0
fi



#print header
if [ "$mode" = "p" ] || [ "$mode" = "print" ]; then
	echo "magic_number:             0x$hexpad$magic_number_rff"
	echo "length:                   0x$hexpad$length_rff"
	echo "header_chksum:            0x$hexpad$header_chksum_rff"
	echo "payload_chksum_rff:       0x$hexpad$payload_chksum_rff"
	echo "reserved:	          0x$hexpad$reserved_rff"
	exit 0
fi

if [ "$mode" = "w" ] || [ "$mode" = "write" ]; then
	writebytes "$file" "$extrainput" 8 4
	exit 0
fi



#defult mode
while [ $count -ne $filesize ]; do
	selectedbyte=$(xxd -p -s $count -l 1 "$file")
	count=$((count + 1))
	echo "$count/$filesize : 0x$sum + 0x$selectedbyte"
	sum=$(printf "%X\n" $((16#$sum + 16#$selectedbyte)))
	#echo "$count 0x$sum + 0x$selectedbyte"
done


echo "filesize: $filesize = 0x$hexsize"
echo "chksum : 0x$(hexpad $sum)"
