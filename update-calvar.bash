#!/bin/bash

# 引数の確認
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <input_file>"
  exit 1
fi

# 入力ファイル
INPUT_FILE="$1"

# ファイルの存在確認
if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: File '$INPUT_FILE' not found."
  exit 1
fi

# 一時ファイル
TEMP_FILE="temp.json"

# 現在の日付を取得 (例: 2024.12.24)
TODAY=$(date '+%Y.%m.%d')

# 現在のバージョンを取得
CURRENT_VERSION=$(jq -r '.version' "$INPUT_FILE")

# 現在のバージョンの日付部分と連番部分を分解
CURRENT_DATE=$(echo "$CURRENT_VERSION" | cut -d. -f1-3)
CURRENT_SEQ=$(echo "$CURRENT_VERSION" | cut -d. -f4)

# 日付が異なる場合は連番をリセット、同じ場合はインクリメント
if [[ "$CURRENT_DATE" == "$TODAY" ]]; then
  NEW_SEQ=$((CURRENT_SEQ + 1))
else
  NEW_SEQ=1
fi

# 新しいバージョンを作成
NEW_VERSION="$TODAY.$NEW_SEQ"

# JSON を更新
jq --arg new_version "$NEW_VERSION" '.version = $new_version' "$INPUT_FILE" > "$TEMP_FILE" && mv "$TEMP_FILE" "$INPUT_FILE"

# 結果を表示
echo "Updated version in '$INPUT_FILE' to: $NEW_VERSION"
