# SmartMed Firebase Emulator Setup Script (PowerShell)

Write-Host "🚀 Setting up SmartMed Firebase Emulators..." -ForegroundColor Green

# Check if Firebase CLI is installed
$firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebaseInstalled) {
    Write-Host "❌ Firebase CLI is not installed. Installing..." -ForegroundColor Red
    npm install -g firebase-tools
}

# Check if we're in the project root
if (-not (Test-Path "firebase.json")) {
    Write-Host "❌ firebase.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Install dependencies for functions
Write-Host "📦 Installing Firebase Functions dependencies..." -ForegroundColor Blue
Set-Location functions
npm install
Set-Location ..

# Install dependencies for mobile app
Write-Host "📱 Installing mobile app dependencies..." -ForegroundColor Blue
Set-Location mobile
npm install
Set-Location ..

# Start Firebase Emulators
Write-Host "🔥 Starting Firebase Emulators..." -ForegroundColor Green
Write-Host "📋 Services: Auth, Firestore, Functions, Storage" -ForegroundColor Cyan
Write-Host "🌐 Emulator UI: http://localhost:4000" -ForegroundColor Cyan
Write-Host "📖 Auth Emulator: http://localhost:9099" -ForegroundColor Cyan
Write-Host "🔧 Functions Emulator: http://localhost:5001" -ForegroundColor Cyan
Write-Host "💾 Firestore Emulator: http://localhost:8080" -ForegroundColor Cyan
Write-Host "📦 Storage Emulator: http://localhost:9199" -ForegroundColor Cyan

firebase emulators:start --only firestore,auth,functions,storage
