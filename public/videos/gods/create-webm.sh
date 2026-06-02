#!/bin/bash
set -e

GODS_DIR="/Users/kristismac/longevityone-web/longevityone-web/longevityone-web/public/videos/gods"
BOOMERANG_DIR="$GODS_DIR/boomerang"
WEBM_DIR="$GODS_DIR/webm"

mkdir -p "$WEBM_DIR"

echo "Creating WebM VP9 versions of boomerang videos..."
echo ""

for video in "$BOOMERANG_DIR"/*.mp4; do
    filename=$(basename "$video" .mp4)
    
    echo "Converting: $filename"
    
    # VP9 two-pass encoding for best quality
    # Pass 1
    ffmpeg -y -i "$video" \
        -c:v libvpx-vp9 -b:v 0 -crf 24 -pass 1 \
        -row-mt 1 -threads 8 \
        -an -f null /dev/null
    
    # Pass 2
    ffmpeg -y -i "$video" \
        -c:v libvpx-vp9 -b:v 0 -crf 24 -pass 2 \
        -row-mt 1 -threads 8 \
        -an \
        "$WEBM_DIR/${filename}.webm"
    
    echo "✓ Created: ${filename}.webm"
    echo ""
done

# Cleanup pass log files
rm -f ffmpeg2pass-0.log

echo "=========================================="
echo "WebM VP9 versions created in: $WEBM_DIR"
echo "=========================================="
