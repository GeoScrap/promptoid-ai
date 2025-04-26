#!/bin/bash

# This script increases the file descriptor limits on macOS
# Run with: bash scripts/increase-file-limits.sh

# Check if running on macOS
if [[ "$(uname)" != "Darwin" ]]; then
  echo "This script is for macOS only."
  exit 1
fi

# Get current limits
echo "Current limits:"
ulimit -n
echo ""

# Increase the limit for the current session
ulimit -n 10240
echo "New limits for current session:"
ulimit -n
echo ""

echo "To make this change permanent, create or edit the file ~/.launchd.conf with:"
echo "limit maxfiles 10240 unlimited"
echo ""
echo "Then restart your computer for the changes to take effect."
echo ""
echo "For Next.js development, you can also try running with:"
echo "NODE_OPTIONS=--max-old-space-size=4096 npm run dev"
