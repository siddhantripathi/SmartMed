#!/bin/bash

# SmartMed Firebase Emulator Setup Script

echo "🚀 Setting up SmartMed Firebase Emulators..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Installing..."
    npm install -g firebase-tools
fi

# Check if we're in the project root
if [ ! -f "firebase.json" ]; then
    echo "❌ firebase.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies for functions
echo "📦 Installing Firebase Functions dependencies..."
cd functions
npm install
cd ..

# Install dependencies for mobile app
echo "📱 Installing mobile app dependencies..."
cd mobile
npm install
cd ..

# Start Firebase Emulators
echo "🔥 Starting Firebase Emulators..."
echo "📋 Services: Auth, Firestore, Functions, Storage"
echo "🌐 Emulator UI: http://localhost:4000"
echo "📖 Auth Emulator: http://localhost:9099"
echo "🔧 Functions Emulator: http://localhost:5001"
echo "💾 Firestore Emulator: http://localhost:8080"
echo "📦 Storage Emulator: http://localhost:9199"

firebase emulators:start --only firestore,auth,functions,storage
