@echo off
setlocal
title BoolStudio Launcher
cd /d "%~dp0"

if exist "%LOCALAPPDATA%\BoolStudio\boolstudio.exe" (
    start "" "%LOCALAPPDATA%\BoolStudio\boolstudio.exe"
    exit /b 0
)

if exist "%~dp0src-tauri\target\release\boolstudio.exe" (
    start "" "%~dp0src-tauri\target\release\boolstudio.exe"
    exit /b 0
)

echo BoolStudio executable not found. Building release binary...
call npm run tauri:build
start "" "%~dp0src-tauri\target\release\boolstudio.exe"
