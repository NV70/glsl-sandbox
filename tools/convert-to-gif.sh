#!/bin/sh

start_time=00:00:00
duration=00:00:03

palette="/tmp/palette.png"

filters="fps=40,scale=512:-1:flags=lanczos"

ffmpeg -v warning -ss $start_time -t $duration -i $1 -vf "$filters,palettegen" -y $palette
ffmpeg -v warning -ss $start_time -t $duration -i $1 -i $palette -lavfi "$filters [x]; [x][1:v] paletteuse" -y $2
