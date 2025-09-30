# SmartMed Android Emulator Setup Script (PowerShell)

param(
    [string]$AvdName = "SmartMed_Medium_Phone"
)

Write-Host "📱 Setting up SmartMed Medium Phone Emulator..." -ForegroundColor Green

# Check if ANDROID_HOME is set
if (-not $env:ANDROID_HOME) {
    Write-Host "❌ ANDROID_HOME environment variable not set" -ForegroundColor Red
    Write-Host "Please set ANDROID_HOME to your Android SDK path" -ForegroundColor Yellow
    exit 1
}

# Check if avdmanager exists
$avdManager = Join-Path $env:ANDROID_HOME "tools\bin\avdmanager.bat"
if (-not (Test-Path $avdManager)) {
    Write-Host "❌ avdmanager not found at $avdManager" -ForegroundColor Red
    Write-Host "Please check your Android SDK installation" -ForegroundColor Yellow
    exit 1
}

# Check if emulator exists
$emulator = Join-Path $env:ANDROID_HOME "tools\emulator.exe"
if (-not (Test-Path $emulator)) {
    Write-Host "❌ emulator not found at $emulator" -ForegroundColor Red
    Write-Host "Please check your Android SDK installation" -ForegroundColor Yellow
    exit 1
}

# Check if AVD exists
$avdList = & $avdManager list avd
$avdExists = $avdList | Where-Object { $_ -match $AvdName }

if (-not $avdExists) {
    Write-Host "📱 Creating AVD: $AvdName" -ForegroundColor Blue

    # Create AVD with specified configuration
    & $avdManager create avd -n $AvdName -k "system-images;android-34;google_apis;x86_64" --device "Medium Phone"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create AVD" -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ AVD $AvdName created successfully" -ForegroundColor Green
} else {
    Write-Host "✅ AVD $AvdName already exists" -ForegroundColor Green
}

Write-Host "🚀 Starting Android Emulator..." -ForegroundColor Green
Write-Host "📋 Emulator will be available at: emulator-5554" -ForegroundColor Cyan
Write-Host "🌐 You can access it via Android Studio or adb" -ForegroundColor Cyan

# Start emulator
$emulatorProcess = Start-Process -FilePath $emulator -ArgumentList "-avd", $AvdName, "-no-window", "-no-audio", "-no-boot-anim" -PassThru

Write-Host "⏳ Waiting for emulator to boot..." -ForegroundColor Yellow

# Wait for emulator to be ready
$adb = Join-Path $env:ANDROID_HOME "platform-tools\adb.exe"
if (Test-Path $adb) {
    & $adb wait-for-device
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Emulator is ready!" -ForegroundColor Green
        Write-Host "🔗 You can now run: npx react-native run-android" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Emulator failed to start" -ForegroundColor Red
        exit 1
    }
}

Write-Host "🔄 Emulator running with PID: $($emulatorProcess.Id)" -ForegroundColor Blue
Write-Host "🛑 Press Ctrl+C to stop the emulator" -ForegroundColor Yellow

try {
    $emulatorProcess.WaitForExit()
} catch {
    Write-Host "🛑 Emulator stopped" -ForegroundColor Yellow
}
