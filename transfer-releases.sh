#!/bin/bash

# Script to transfer releases from private repo to public releases repo
# Usage: ./transfer-releases.sh

set -e

echo "==================================================="
echo "  Release Transfer Script"
echo "==================================================="
echo ""

# Check if required environment variables are set
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: GITHUB_TOKEN environment variable is not set"
    echo ""
    echo "Please set your Personal Access Token:"
    echo "  export GITHUB_TOKEN='your_token_here'"
    echo ""
    exit 1
fi

if [ -z "$PUBLIC_REPO" ]; then
    echo "❌ Error: PUBLIC_REPO environment variable is not set"
    echo ""
    echo "Please set your public repository name:"
    echo "  export PUBLIC_REPO='username/repo-name'"
    echo "  Example: export PUBLIC_REPO='enyaencha/markdown-to-measure-releases'"
    echo ""
    exit 1
fi

# Get the current repository (private repo)
PRIVATE_REPO=$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')

if [ -z "$PRIVATE_REPO" ]; then
    echo "❌ Error: Could not determine the current repository"
    exit 1
fi

echo "📦 Private Repository: $PRIVATE_REPO"
echo "🌍 Public Repository: $PUBLIC_REPO"
echo ""

# Fetch all releases from private repo
echo "🔍 Fetching releases from private repository..."
RELEASES=$(curl -s \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$PRIVATE_REPO/releases")

# Check if we got releases
if [ "$RELEASES" == "[]" ]; then
    echo "ℹ️  No releases found in private repository"
    exit 0
fi

# Count releases
RELEASE_COUNT=$(echo "$RELEASES" | jq '. | length')
echo "✅ Found $RELEASE_COUNT release(s) to transfer"
echo ""

# Process each release
echo "$RELEASES" | jq -c '.[]' | while read -r release; do
    TAG_NAME=$(echo "$release" | jq -r '.tag_name')
    RELEASE_NAME=$(echo "$release" | jq -r '.name')
    BODY=$(echo "$release" | jq -r '.body')
    IS_PRERELEASE=$(echo "$release" | jq -r '.prerelease')
    IS_DRAFT=$(echo "$release" | jq -r '.draft')

    echo "----------------------------------------"
    echo "📋 Processing: $RELEASE_NAME ($TAG_NAME)"
    echo "----------------------------------------"

    # Check if release already exists in public repo
    EXISTING=$(curl -s \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$PUBLIC_REPO/releases/tags/$TAG_NAME" \
        2>/dev/null)

    if echo "$EXISTING" | jq -e '.id' > /dev/null 2>&1; then
        echo "⏭️  Release $TAG_NAME already exists in public repo, skipping..."
        echo ""
        continue
    fi

    # Create release in public repo
    echo "📤 Creating release in public repository..."
    CREATE_RESPONSE=$(curl -s -X POST \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$PUBLIC_REPO/releases" \
        -d @- <<EOF
{
    "tag_name": "$TAG_NAME",
    "name": "$RELEASE_NAME",
    "body": $(echo "$BODY" | jq -R -s .),
    "draft": $IS_DRAFT,
    "prerelease": $IS_PRERELEASE
}
EOF
)

    # Check if release was created successfully
    if echo "$CREATE_RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
        echo "✅ Release created successfully"

        # Get upload URL
        UPLOAD_URL=$(echo "$CREATE_RESPONSE" | jq -r '.upload_url' | sed 's/{?name,label}//')

        # Get assets from private repo release
        ASSETS_URL=$(echo "$release" | jq -r '.assets_url')
        ASSETS=$(curl -s \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "$ASSETS_URL")

        ASSET_COUNT=$(echo "$ASSETS" | jq '. | length')

        if [ "$ASSET_COUNT" -gt 0 ]; then
            echo "📎 Transferring $ASSET_COUNT asset(s)..."

            # Transfer each asset
            echo "$ASSETS" | jq -c '.[]' | while read -r asset; do
                ASSET_NAME=$(echo "$asset" | jq -r '.name')
                ASSET_URL=$(echo "$asset" | jq -r '.url')
                CONTENT_TYPE=$(echo "$asset" | jq -r '.content_type')

                echo "  ⬇️  Downloading: $ASSET_NAME"

                # Download asset from private repo
                curl -s -L \
                    -H "Authorization: token $GITHUB_TOKEN" \
                    -H "Accept: application/octet-stream" \
                    "$ASSET_URL" \
                    -o "/tmp/$ASSET_NAME"

                echo "  ⬆️  Uploading to public repo..."

                # Upload to public repo
                curl -s -X POST \
                    -H "Authorization: token $GITHUB_TOKEN" \
                    -H "Content-Type: $CONTENT_TYPE" \
                    --data-binary @"/tmp/$ASSET_NAME" \
                    "${UPLOAD_URL}?name=${ASSET_NAME}" > /dev/null

                # Clean up
                rm -f "/tmp/$ASSET_NAME"

                echo "  ✅ $ASSET_NAME transferred"
            done
        else
            echo "ℹ️  No assets to transfer"
        fi
    else
        echo "❌ Failed to create release"
        echo "$CREATE_RESPONSE" | jq '.'
    fi

    echo ""
done

echo "==================================================="
echo "✨ Transfer complete!"
echo "==================================================="
echo ""
echo "View your public releases at:"
echo "https://github.com/$PUBLIC_REPO/releases"
echo ""