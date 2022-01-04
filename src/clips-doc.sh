#!/usr/bin/env bash
FILE=$1
OUT=$2
echo clips-file: $FILE
./scan.x < $FILE > clips-doc.out && node clips-doc.js && cp out.html $OUT
