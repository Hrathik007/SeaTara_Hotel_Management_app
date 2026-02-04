#!/bin/bash

echo "🚂 Railway Deployment - Quick Start Script"
echo "=========================================="
echo ""

# Check if git remote exists
if git remote get-url origin &> /dev/null; then
    echo "✅ Git remote already configured"
    git remote -v
else
    echo "⚠️  No git remote found"
    echo ""
    echo "Please create a GitHub repository and run:"
    echo "  git remote add origin https://github.com/YOUR-USERNAME/sitara-hotel-backend.git"
    echo ""
    exit 1
fi

echo ""
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://railway.app"
echo "2. Sign in with GitHub"
echo "3. Click '+ New' → 'Database' → 'MySQL'"
echo "4. Click '+ New' → 'GitHub Repo' → Select your repo"
echo "5. Go to 'Variables' tab and add:"
echo "   - SPRING_PROFILES_ACTIVE=railway"
echo "   - JWT_SECRET=<generate-with-command-below>"
echo ""
echo "Generate JWT Secret:"
echo "  openssl rand -base64 64"
echo ""
echo "6. Go to 'Settings' → 'Networking' → 'Generate Domain'"
echo ""
echo "🎉 Your backend will be live at: https://your-app.up.railway.app"

