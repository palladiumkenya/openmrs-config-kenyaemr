# Automatic Release Sync Setup

This repository is configured to automatically sync releases to a public repository. Any changes you make to releases in the private repo are automatically reflected in the public repo.

## Quick Start

**Before the workflow can run, you must:**

1. Create a GitHub Personal Access Token with `repo` scope
2. Add it as a secret named `PUBLIC_REPO_TOKEN` in your private repository
3. Add your public repo name as a secret named `PUBLIC_REPO` (format: `username/repo-name`)

Then simply manage releases in this private repo - all changes automatically sync to the public repo!

## How It Works

The workflow automatically syncs your releases in the following scenarios:

### ✅ When you PUBLISH a release:
- The workflow creates the same release in the public repository
- All assets (zip files, etc.) are transferred automatically

### ✅ When you EDIT a release:
- Update release notes, title, or description → syncs to public repo
- Add new assets → automatically uploaded to public repo
- Remove assets → automatically removed from public repo
- Change release status (prerelease, draft) → syncs to public repo

### ✅ When you DELETE a release:
- The release is automatically deleted from the public repository

**All changes happen automatically - no manual intervention needed!**

## Setup Instructions

### 1. Create a Personal Access Token

You need a GitHub Personal Access Token with the following permissions:
- `repo` (Full control of private and public repositories)

**Steps to create the token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Release Transfer Token")
4. Select scopes:
   - ✅ Check `repo` (this includes all sub-permissions)
5. Click "Generate token"
6. **Copy the token immediately** (you won't be able to see it again!)

### 2. Add Repository Secrets

Go to your **private repository** settings: `Settings > Secrets and variables > Actions`

Add the following **two** secrets:

#### `PUBLIC_REPO_TOKEN` ⚠️ REQUIRED
- **Value**: Your Personal Access Token from step 1
- **Purpose**: Allows the workflow to create releases in the public repository
- **Important**: This must be a Personal Access Token, NOT the default GitHub Actions token

#### `PUBLIC_REPO` ⚠️ REQUIRED
- **Value**: The name of your public repository in format `username/repo-name`
- **Example**: `palladiumkenya/kenyahmis-releases`
- **Purpose**: Specifies where to transfer the releases

### 3. Create Release in Private Repository

Now you can create releases as usual:

1. Go to your private repository
2. Click on "Releases" → "Draft a new release"
3. Fill in:
   - **Tag**: Version number (e.g., `v1.0.0`)
   - **Title**: Release name (e.g., `Version 1.0.0`)
   - **Description**: Release notes
   - **Assets**: Upload your zip package
4. Click "Publish release"

### 4. Automatic Sync

Once you interact with releases, the workflow automatically handles everything:

**Publishing a new release:**
- The workflow starts immediately (watch in "Actions" tab)
- Within 1-2 minutes, the release appears in your public repo
- All assets are transferred automatically

**Editing an existing release:**
- Update the title, description, or notes
- Add/remove/replace asset files
- Click "Update release"
- Changes sync automatically to public repo

**Deleting a release:**
- Delete the release from your private repo
- It's automatically removed from the public repo too

## Manual Transfer (Optional)

If you want to transfer all existing releases or run a manual transfer, you can use the `transfer-releases.sh` script:

```bash
export GITHUB_TOKEN='your_token_here'
export PUBLIC_REPO='username/repo-name'
./transfer-releases.sh
```

## Troubleshooting

### Workflow Not Running

- Check that the workflow file exists at `.github/workflows/transfer-release.yml`
- Make sure you're **publishing** the release, not saving it as a draft
- Check the "Actions" tab for any error messages

### Transfer Failed with 404 Error

This usually means one of the secrets is missing or incorrect:

- Verify that both secrets (`PUBLIC_REPO_TOKEN` and `PUBLIC_REPO`) are set in your **private** repository
- Go to `Settings > Secrets and variables > Actions` and confirm both are listed
- Make sure `PUBLIC_REPO` follows the format: `username/repo-name` (no spaces, no https://)
- Ensure your Personal Access Token has `repo` scope checked
- If you recently created the public repository, make sure it actually exists

### Transfer Failed with Permission Error

- Your Personal Access Token might not have the right permissions
- Create a new token at https://github.com/settings/tokens with `repo` scope
- Update the `PUBLIC_REPO_TOKEN` secret with the new token
- Make sure the token isn't expired

### Assets Not Transferring

- Make sure assets are uploaded before publishing the release
- Check that the asset file size is within GitHub's limits (2GB max)
- Verify the asset uploaded successfully to the private release first

## Example Workflows

### Publishing a New Release

1. Make your code changes
2. Commit and push to your private repository
3. Create a new release:
   - Tag: `v1.2.0`
   - Title: `Release 1.2.0`
   - Upload: `markdown-to-measure-v1.2.0.zip`
4. Click "Publish release"
5. Wait ~1-2 minutes
6. Check your public repository - the release is there with the zip file ✅

### Updating an Existing Release

1. Go to Releases in your private repo
2. Click "Edit" on the release you want to update
3. Make changes:
   - Update release notes
   - Upload additional files or remove old ones
   - Change the title or description
4. Click "Update release"
5. Wait ~1-2 minutes
6. Check your public repository - all changes are synced ✅

### Deleting a Release

1. Go to Releases in your private repo
2. Click on the release you want to delete
3. Click "Delete this release" and confirm
4. Wait ~1-2 minutes
5. Check your public repository - the release is gone ✅

## Workflow Run Names

Each workflow run now has a descriptive name showing what action was performed:
- **"📦 Publishing release v1.0.0"** - When you publish a new release
- **"✏️ Updating release v1.0.0"** - When you edit an existing release
- **"🗑️ Deleting release v1.0.0"** - When you delete a release

This makes it easy to track what each workflow run did in the Actions tab!

## What Gets Synced

The workflow syncs **everything** about your release:
- ✅ Release title and tag
- ✅ Release notes/description
- ✅ Draft status (draft or published)
- ✅ Prerelease status (prerelease or latest)
- ✅ All asset files (zip, tar.gz, etc.)

**Status changes** are fully supported:
- Mark a release as prerelease → syncs to public repo
- Convert prerelease to latest → syncs to public repo
- Change from draft to published → syncs to public repo

## Notes

- The workflow runs on `ubuntu-latest` GitHub runners
- Assets are temporarily downloaded to `/tmp` and cleaned up after upload
- The workflow triggers on three events: `published`, `edited`, and `deleted`
- When editing a release, the public release is deleted and recreated with the latest changes
- The workflow preserves all release metadata (draft status, prerelease flag, etc.)
- Changes typically sync within 1-2 minutes
- Detailed logs show file sizes, upload progress, and any errors
- You can monitor the sync progress in the "Actions" tab of your private repository
- Failed asset uploads are logged but don't stop the workflow
