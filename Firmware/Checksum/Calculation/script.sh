#!/bin/bash
if [ $# -lt 1 ]; then
	echo "Error: no arguments"
	echo "Usage: ./script.sh <file.bin> [mode]"
	exit 1
fi
file=$1
mode=$2


#filesize in base10
filesize=$(stat -c%s "$file")
hexsize=$(printf "%X\n" $filesize)
sum=0
selectedbyte=0
count=0


#functions
hexpad() {
    local hex=$1
    printf "%08x\n" $((16#$hex))
}

#check dependencies
if ! command -v xxd &> /dev/null; then
	echo "Error: xxd is not installed pls install to use this script"
	exit 1
fi

#header mode
if [ "$mode" = "h" ] | [ "$mode" = "header" ]; then
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
	exit 1
fi


while [ $count -ne $filesize ]; do
	selectedbyte=$(xxd -p -s $count -l 1 "$file")
	count=$((count + 1))
	echo "$count/$filesize : 0x$sum + 0x$selectedbyte"
	sum=$(printf "%X\n" $((16#$sum + 16#$selectedbyte)))
	#echo "$count 0x$sum + 0x$selectedbyte"
done
echo "filesize: $filesize = 0x$hexsize"
echo "chksum : 0x$(hexpad $sum)"
