@echo off
setlocal enabledelayedexpansion

:: Define source and destination directories
set "SOURCE_DIR=%~dp0"
set "SCRIPT_NAME=CopyScriptsToIndesign.bat"

:: Find InDesign Scripts folder - check typical locations
set "INDESIGN_SCRIPTS_DIR="

:: Check Adobe InDesign 2024 location
if exist "%APPDATA%\Adobe\InDesign\Version 19.0\en_US\Scripts\Scripts Panel" (
    set "INDESIGN_SCRIPTS_DIR=%APPDATA%\Adobe\InDesign\Version 19.0\en_US\Scripts\Scripts Panel"
    goto :found
)

:: Check Adobe InDesign 2023 location
if exist "%APPDATA%\Adobe\InDesign\Version 18.0\en_US\Scripts\Scripts Panel" (
    set "INDESIGN_SCRIPTS_DIR=%APPDATA%\Adobe\InDesign\Version 18.0\en_US\Scripts\Scripts Panel"
    goto :found
)

:: Check Adobe InDesign 2022 location
if exist "%APPDATA%\Adobe\InDesign\Version 17.0\en_US\Scripts\Scripts Panel" (
    set "INDESIGN_SCRIPTS_DIR=%APPDATA%\Adobe\InDesign\Version 17.0\en_US\Scripts\Scripts Panel"
    goto :found
)

:: Check Adobe InDesign 2021 location
if exist "%APPDATA%\Adobe\InDesign\Version 16.0\en_US\Scripts\Scripts Panel" (
    set "INDESIGN_SCRIPTS_DIR=%APPDATA%\Adobe\InDesign\Version 16.0\en_US\Scripts\Scripts Panel"
    goto :found
)

:: Check Adobe InDesign 2020 location
if exist "%APPDATA%\Adobe\InDesign\Version 15.0\en_US\Scripts\Scripts Panel" (
    set "INDESIGN_SCRIPTS_DIR=%APPDATA%\Adobe\InDesign\Version 15.0\en_US\Scripts\Scripts Panel"
    goto :found
)

:: Check Adobe InDesign 2019 location
if exist "%APPDATA%\Adobe\InDesign\Version 14.0\en_US\Scripts\Scripts Panel" (
    set "INDESIGN_SCRIPTS_DIR=%APPDATA%\Adobe\InDesign\Version 14.0\en_US\Scripts\Scripts Panel"
    goto :found
)

:: Check Adobe InDesign 2018 location
if exist "%APPDATA%\Adobe\InDesign\Version 13.0\en_US\Scripts\Scripts Panel" (
    set "INDESIGN_SCRIPTS_DIR=%APPDATA%\Adobe\InDesign\Version 13.0\en_US\Scripts\Scripts Panel"
    goto :found
)

:: Prompt user for path if not found
echo InDesign Scripts folder not found in typical locations.
set /p INDESIGN_SCRIPTS_DIR="Please enter the path to your InDesign Scripts folder: "

:found
echo Found InDesign Scripts folder: %INDESIGN_SCRIPTS_DIR%

:: Create target folder named after the repo
set "TARGET_DIR=%INDESIGN_SCRIPTS_DIR%\indesign-scripts"
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

echo.
echo Copying scripts to: %TARGET_DIR%
echo.

:: Copy all JSX files from root
echo Copying JSX files from root directory...
for %%F in ("%SOURCE_DIR%*.jsx") do (
    echo   - Copying %%~nxF
    copy "%%F" "%TARGET_DIR%\" /Y > nul
)

:: Copy lib directory with all subdirectories and files
if exist "%SOURCE_DIR%lib" (
    echo Copying lib directory and contents...
    if not exist "%TARGET_DIR%\lib" mkdir "%TARGET_DIR%\lib"
    xcopy "%SOURCE_DIR%lib" "%TARGET_DIR%\lib" /E /I /Y > nul
)

:: Copy config directory with all subdirectories and files
if exist "%SOURCE_DIR%config" (
    echo Copying config directory and contents...
    if not exist "%TARGET_DIR%\config" mkdir "%TARGET_DIR%\config"
    xcopy "%SOURCE_DIR%config" "%TARGET_DIR%\config" /E /I /Y > nul
)

echo.
echo Files copied successfully to InDesign Scripts folder.
echo Scripts should now be available in InDesign's Scripts panel.
echo.

pause
exit /b 0