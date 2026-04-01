#!/bin/bash
# Replace emojis with text alternatives in all tsx/ts files

find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e "s/📋/[CA]/g" \
  -e "s/📜/[DOC]/g" \
  -e "s/🎮/[GAME]/g" \
  -e "s/📈/[CHART]/g" \
  -e "s/🖼️/[IMG]/g" \
  -e "s/📝/[TXT]/g" \
  -e "s/🗑️/[BIN]/g" \
  -e "s/💬/[MSG]/g" \
  -e "s/💣/[BOMB]/g" \
  -e "s/🐍/[SNAKE]/g" \
  -e "s/🎨/[PAINT]/g" \
  -e "s/😈/[X]/g" \
  -e "s/📎/[CLIP]/g" \
  -e "s/⚠️/[!]/g" \
  -e "s/🪟/[WIN]/g" \
  -e "s/🔊/[VOL]/g" \
  -e "s/🌐/[NET]/g" \
  -e "s/🔇/[MUTE]/g" \
  -e "s/📵/[X]/g" \
  -e "s/😵/X_X/g" \
  -e "s/😎/B)/g" \
  -e "s/🙂/:)/g" \
  -e "s/🚩/[F]/g" \
  -e "s/💥/[BOOM]/g" \
  -e "s/🚨/[!]/g" \
  -e "s/💎/[D]/g" \
  -e "s/👛/[W]/g" \
  -e "s/📄/[F]/g" \
  -e "s/📊/[G]/g" \
  -e "s/🔑/[K]/g" \
  -e "s/✨/[*]/g" \
  -e "s/💔/[</3]/g" \
  -e "s/😭/T_T/g" \
  -e "s/🧾/[R]/g" \
  -e "s/💨/~/g" \
  -e "s/🐦/[TW]/g" \
  -e "s/📱/[PH]/g" \
  -e "s/🎉//g" \
  -e "s/🏆/[1]/g" \
  -e "s/🔄/~/g" \
  -e "s/✓/OK/g" \
  -e "s/🎰//g" \
  -e "s/🦎/[CG]/g" \
  -e "s/🔴//g" \
  -e "s/🟢//g" \
  -e "s/🛏️/[BED]/g" \
  -e "s/🎯/[DO]/g" \
  -e "s/🚀/[GO]/g" \
  -e "s/🪞/~/g" \
  -e "s/🔢/1337/g" \
  -e "s/⏰/[T]/g" \
  -e "s/✏️/[P]/g" \
  -e "s/🖱️/[M]/g" \
  {} \;
echo "Done removing emojis"
