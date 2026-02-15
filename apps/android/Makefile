# Makefile for Android App

.PHONY: help build clean install run test lint

# Default target
help:
	@echo "Available targets:"
	@echo "  make build           - Build debug APK"
	@echo "  make clean           - Clean build artifacts"
	@echo "  make install         - Install debug APK on connected device"
	@echo "  make run             - Install and launch the app"
	@echo "  make test            - Run unit tests"
	@echo "  make lint            - Run lint checks"
	@echo "  make assemble-release - Build release APK (unsigned)"

# Build debug APK
build:
	./gradlew assembleDebug

# Clean build artifacts
clean:
	./gradlew clean

# Install debug APK
install: build
	./gradlew installDebug

# Run the app
run: install
	@echo "Launching app..."
	adb shell am start -n com.easyreport.app/.MainActivity

# Run unit tests
test:
	./gradlew test

# Run lint checks
lint:
	./gradlew lint

# Build release APK
assemble-release:
	./gradlew assembleRelease
