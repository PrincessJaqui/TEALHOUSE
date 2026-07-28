#!/usr/bin/env bash
# Sets the git identity for THIS repo only. Vercel rejects deploys from any
# other commit email, so run this once after cloning.
set -euo pipefail

EXPECTED_EMAIL="jaquimccarthy@gmail.com"

git config user.email "$EXPECTED_EMAIL"
git config user.name "Jaqui McCarthy"

echo "Repo-scoped git identity set:"
echo "  user.name  = $(git config user.name)"
echo "  user.email = $(git config user.email)"
