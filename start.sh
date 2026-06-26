#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# 灵境占卜 — Quick Start Script
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

cd "$(dirname "$0")"

echo "🔮 灵境占卜平台 — Starting up..."
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Copying from template..."
    cp .env.example .env 2>/dev/null || true
fi

# Build and start
echo "📦 Building Docker images..."
docker compose build --parallel

echo ""
echo "🚀 Starting services..."
docker compose up -d

echo ""
echo "⏳ Waiting for services to become healthy..."
sleep 10

# Health checks
echo ""
echo "───────────────────────────────────────────"
echo "📊 Service Status:"
echo "───────────────────────────────────────────"
docker compose ps

echo ""
echo "✅ 灵境占卜平台 is running!"
echo "   🌐 Frontend:  http://localhost"
echo "   🔌 API:       http://localhost/api"
echo "   📊 Database:  localhost:5432"
echo "   🗄️  Redis:     localhost:6379"
echo ""
echo "   Stop with: docker compose down"
echo "   Logs with: docker compose logs -f"
