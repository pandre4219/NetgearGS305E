#!/bin/bash

file=$1

#filesize in base10
filesize=$(stat -c%s "$file")
hexsize=$(printf "%X\n" $filesize)
sum=0
selectedbyte=0
count=0
#selectedbyte=$(xxd -p -s $count -l 1 "$file")
while [ $count -ne $filesize ]; do
	selectedbyte=$(xxd -p -s $count -l 1 "$file")
	echo "$count/$filesize : 0x$sum + 0x$selectedbyte"
	sum=$(printf "%X\n" $((16#$sum + 16#$selectedbyte)))
	#echo "$count 0x$sum + 0x$selectedbyte"
	count=$((count + 1))
done
echo "filesize: $filesize = 0x$hexsize"
echo "chksum : 0x$sum"
