#!/bin/bash
pnpm build
rm -rf ~/Applications/chrome-extension/quick-note
cp -r dist ~/Applications/chrome-extension/quick-note
sed -i '' '/"src\/content_scripts\/styles.css.js",/d' ~/Applications/chrome-extension/quick-note/manifest.json