#!/usr/bin/env bash

set -e

JSON_MODE=false
ARGS=()
for arg in "$@"; do
    case "$arg" in
        --json) JSON_MODE=true ;;
        --help|-h) echo "用法：$0 [--json] <功能描述>"; exit 0 ;;
        *) ARGS+=("$arg") ;;
    esac
done

FEATURE_DESCRIPTION="${ARGS[*]}"
if [ -z "$FEATURE_DESCRIPTION" ]; then
    echo "用法：$0 [--json] <功能描述>" >&2
    exit 1
fi

# 通过搜索现有项目标记查找仓库根目录的函数
find_repo_root() {
    local dir="$1"
    while [ "$dir" != "/" ]; do
        if [ -d "$dir/.git" ] || [ -d "$dir/.specify" ]; then
            echo "$dir"
            return 0
        fi
        dir="$(dirname "$dir")"
    done
    return 1
}

# 解析仓库根目录。可用时优先使用 git 信息，但回退到
# 搜索仓库标记，以便工作流程在使用 --no-git 初始化的仓库中仍能正常运行。
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if git rev-parse --show-toplevel >/dev/null 2>&1; then
    REPO_ROOT=$(git rev-parse --show-toplevel)
    HAS_GIT=true
else
    REPO_ROOT="$(find_repo_root "$SCRIPT_DIR")"
    if [ -z "$REPO_ROOT" ]; then
        echo "错误：无法确定仓库根目录。请从仓库内运行此脚本。" >&2
        exit 1
    fi
    HAS_GIT=false
fi

cd "$REPO_ROOT"

SPECS_DIR="$REPO_ROOT/specs"
mkdir -p "$SPECS_DIR"

HIGHEST=0
if [ -d "$SPECS_DIR" ]; then
    for dir in "$SPECS_DIR"/*; do
        [ -d "$dir" ] || continue
        dirname=$(basename "$dir")
        number=$(echo "$dirname" | grep -o '^[0-9]\+' || echo "0")
        number=$((10#$number))
        if [ "$number" -gt "$HIGHEST" ]; then HIGHEST=$number; fi
    done
fi

NEXT=$((HIGHEST + 1))
FEATURE_NUM=$(printf "%03d" "$NEXT")

# 处理功能描述，支持中文
# 如果描述包含中文，保留中文；否则转换为小写并规范化
if echo "$FEATURE_DESCRIPTION" | grep -qP '[\p{Han}]' 2>/dev/null || echo "$FEATURE_DESCRIPTION" | grep -q '[一-龥]' 2>/dev/null; then
    # 包含中文，保留原始描述但清理特殊字符
    CLEAN_DESC=$(echo "$FEATURE_DESCRIPTION" | sed 's/[[:space:]]\+/-/g' | sed 's/[^a-zA-Z0-9一-龥\u4e00-\u9fa5-]/-/g' | sed 's/-\+/-/g' | sed 's/^-//' | sed 's/-$//')
    BRANCH_NAME="${FEATURE_NUM}-${CLEAN_DESC}"
else
    # 纯英文，使用原有逻辑
    BRANCH_NAME=$(echo "$FEATURE_DESCRIPTION" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-//' | sed 's/-$//')
    WORDS=$(echo "$BRANCH_NAME" | tr '-' '\n' | grep -v '^$' | head -3 | tr '\n' '-' | sed 's/-$//')
    BRANCH_NAME="${FEATURE_NUM}-${WORDS}"
fi

if [ "$HAS_GIT" = true ]; then
    git checkout -b "$BRANCH_NAME"
else
    >&2 echo "[specify] 警告：未检测到 Git 仓库；跳过为 $BRANCH_NAME 创建分支"
fi

FEATURE_DIR="$SPECS_DIR/$BRANCH_NAME"
mkdir -p "$FEATURE_DIR"

TEMPLATE="$REPO_ROOT/.specify/templates/spec-template.md"
SPEC_FILE="$FEATURE_DIR/spec.md"
if [ -f "$TEMPLATE" ]; then cp "$TEMPLATE" "$SPEC_FILE"; else touch "$SPEC_FILE"; fi

# 为当前会话设置 SPECIFY_FEATURE 环境变量
export SPECIFY_FEATURE="$BRANCH_NAME"

if $JSON_MODE; then
    printf '{"BRANCH_NAME":"%s","SPEC_FILE":"%s","FEATURE_NUM":"%s"}\n' "$BRANCH_NAME" "$SPEC_FILE" "$FEATURE_NUM"
else
    echo "BRANCH_NAME: $BRANCH_NAME"
    echo "SPEC_FILE: $SPEC_FILE"
    echo "FEATURE_NUM: $FEATURE_NUM"
    echo "SPECIFY_FEATURE 环境变量已设置为：$BRANCH_NAME"
fi
