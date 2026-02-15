# EasyReport Android App

Native Android application for EasyReport, built with Kotlin and Jetpack Compose.

## Prerequisites

- **Java Development Kit (JDK)**: Version 17 or higher recommended.
- **Android SDK**: Installed via Android Studio or command-line tools.
- **ADB (Android Debug Bridge)**: To install and run on devices/emulators.

### Setting up the Gradle Wrapper

If the `gradlew` or `gradlew.bat` files are missing, you need to initialize them. This requires having [Gradle](https://gradle.org/install/) installed globally on your system once to generate the wrapper.

#### Mac / Linux

```bash
# Generate the wrapper
gradle wrapper
```

#### Windows (PowerShell)

```powershell
# Generate the wrapper
gradle wrapper
```

Once generated, you should use `.\gradlew.bat` (Windows) or `./gradlew` (Mac/Linux) for all subsequent commands to ensure you use the project-defined Gradle version.

### Mac / Linux

You can use the provided `Makefile` for common tasks:

```bash
# Build the app
make build

# Install and run on a connected device/emulator
make run

# Clean build artifacts
make clean
```

Alternatively, use `gradlew` directly:
```bash
./gradlew assembleDebug
./gradlew installDebug
```

### Windows (PowerShell / Command Prompt)

On Windows, use the `gradlew.bat` wrapper:

```powershell
# Build the app
.\gradlew.bat assembleDebug

# Install on a connected device/emulator
.\gradlew.bat installDebug

# Clean build artifacts
.\gradlew.bat clean
```

To launch the app via command line (assuming `adb` is in your PATH):
```powershell
adb shell am start -n com.easyreport.app/.MainActivity
```

## Project Structure

- `app/src/main/java`: Source code (Kotlin).
- `app/src/main/res`: Resources (UI layouts, strings, themes).
- `app/src/main/res/raw`: Configuration files (Amplify/Cognito).
- `Makefile`: Convenience commands for Unix-like systems.
