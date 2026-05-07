#!/bin/bash
set -e

GODS_DIR="/Users/kristismac/longevityone-web/longevityone-web/longevityone-web/public/videos/gods"
ORIGINAL_DIR="$GODS_DIR/original"
BOOMERANG_DIR="$GODS_DIR/boomerang"
CROSSFADE_DIR="$GODS_DIR/crossfade"

mkdir -p "$BOOMERANG_DIR" "$CROSSFADE_DIR"

for video in "$ORIGINAL_DIR"/*.mp4; do
    filename=$(basename "$video" .mp4)
    base_name="${filename%-original}"
    base_name="${base_name%}"
    
    echo "=========================================="
    echo "Processing: $filename"
    echo "=========================================="
    
    # Get video duration
    duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$video")
    echo "Duration: ${duration}s"
    
    # ==========================================
    # BOOMERANG VERSION (original + reversed)
    # ==========================================
    echo "Creating boomerang version..."
    
    # Create reversed video (requires re-encoding for reverse)
    ffmpeg -y -i "$video" \
        -vf "reverse" \
        -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
        -an \
        "$BOOMERANG_DIR/${filename}-reversed-temp.mp4"
    
    # Create concat file
    echo "file '$video'" > "$BOOMERANG_DIR/concat-${filename}.txt"
    echo "file '${filename}-reversed-temp.mp4'" >> "$BOOMERANG_DIR/concat-${filename}.txt"
    
    # Concatenate using concat demuxer (no re-encoding for original part)
    # But since reversed was re-encoded, we need to ensure matching params
    # Re-encode original to match for seamless concat
    ffmpeg -y -i "$video" \
        -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
        -an \
        "$BOOMERANG_DIR/${filename}-forward-temp.mp4"
    
    # Update concat file with temp forward
    echo "file '${filename}-forward-temp.mp4'" > "$BOOMERANG_DIR/concat-${filename}.txt"
    echo "file '${filename}-reversed-temp.mp4'" >> "$BOOMERANG_DIR/concat-${filename}.txt"
    
    # Concat without re-encoding
    ffmpeg -y -f concat -safe 0 -i "$BOOMERANG_DIR/concat-${filename}.txt" \
        -c copy \
        "$BOOMERANG_DIR/${filename}-boomerang.mp4"
    
    # Cleanup temp files
    rm -f "$BOOMERANG_DIR/${filename}-reversed-temp.mp4"
    rm -f "$BOOMERANG_DIR/${filename}-forward-temp.mp4"
    rm -f "$BOOMERANG_DIR/concat-${filename}.txt"
    
    echo "✓ Boomerang created: ${filename}-boomerang.mp4"
    
    # ==========================================
    # CROSSFADE VERSION (1.5s dissolve at loop)
    # ==========================================
    echo "Creating crossfade version..."
    
    # For crossfade loop: we need to blend the end into the beginning
    # Using xfade filter with offset = duration - crossfade_duration
    crossfade_duration=1.5
    offset=$(echo "$duration - $crossfade_duration" | bc)
    
    ffmpeg -y -i "$video" -i "$video" \
        -filter_complex "[0:v][1:v]xfade=transition=fade:duration=${crossfade_duration}:offset=${offset},format=yuv420p[v]" \
        -map "[v]" \
        -c:v libx264 -preset slow -crf 18 \
        -an \
        "$CROSSFADE_DIR/${filename}-crossfade.mp4"
    
    echo "✓ Crossfade created: ${filename}-crossfade.mp4"
    
done

echo ""
echo "=========================================="
echo "All videos processed!"
echo "Boomerang versions: $BOOMERANG_DIR"
echo "Crossfade versions: $CROSSFADE_DIR"
echo "=========================================="
