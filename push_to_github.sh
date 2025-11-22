#!/bin/bash

echo "🚀 Pushing Backend..."
cd backend
git push -u origin main

echo "-----------------------------------"

echo "🚀 Pushing Frontend..."
cd ../frontend
git push -u origin main

echo "✅ Done!"
