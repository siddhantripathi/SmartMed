#!/bin/bash

# SmartMed Android Emulator Setup Script

echo "📱 Setting up SmartMed Medium Phone Emulator..."

# Check if Android SDK is installed
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME environment variable not set"
    echo "Please set ANDROID_HOME to your Android SDK path"
    exit 1
fi

# Check if Android emulator is available
if ! command -v emulator &> /dev/null; then
    echo "❌ Android emulator not found in PATH"
    echo "Please add Android SDK tools to your PATH"
    exit 1
fi

# Create AVD if it doesn't exist
AVD_NAME="SmartMed_Medium_Phone"

if ! $ANDROID_HOME/tools/bin/avdmanager list avd | grep -q "$AVD_NAME"; then
    echo "📱 Creating AVD: $AVD_NAME"

    # Create AVD with specified configuration
    $ANDROID_HOME/tools/bin/avdmanager create avd \
        -n "$AVD_NAME" \
        -k "system-images;android-34;google_apis;x86_64" \
        --device "Medium Phone"

    if [ $? -ne 0 ]; then
        echo "❌ Failed to create AVD"
        exit 1
    fi

    echo "✅ AVD $AVD_NAME created successfully"
else
    echo "✅ AVD $AVD_NAME already exists"
fi

echo "🚀 Starting Android Emulator..."
echo "📋 Emulator will be available at: emulator-5554"
echo "🌐 You can access it via Android Studio or adb"

# Start emulator in background
emulator -avd "$AVD_NAME" -no-window -no-audio -no-boot-anim &
EMULATOR_PID=$!

echo "⏳ Waiting for emulator to boot..."
# Wait for emulator to be ready
$ANDROID_HOME/platform-tools/adb wait-for-device

if [ $? -eq 0 ]; then
    echo "✅ Emulator is ready!"
    echo "🔗 You can now run: npx react-native run-android"
else
    echo "❌ Emulator failed to start"
    exit 1
fi

# Keep script running to maintain emulator
echo "🔄 Emulator running with PID: $EMULATOR_PID"
echo "🛑 Press Ctrl+C to stop the emulator"
wait $EMULATOR_PID
