#!/bin/bash
set -euo pipefail

export DATABASE_URL=op://development/FENCY/fency_react_examples_neon_database_url_prod
echo "Running migrations against prod Neon database..."
op run -- npx drizzle-kit migrate
echo "Prod migrations complete."
