@echo off
:: ============================================================================
:: Etsy AI Command Center - PowerShell Installation Wrapper
:: ============================================================================
:: This batch file runs the PowerShell installation script with proper settings
:: ============================================================================

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║        ETSY AI COMMAND CENTER - INSTALLATION SETUP            ║
echo ║                                                                ║
echo ║  Starting PowerShell installation script...                   ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

:: Check if PowerShell is available
where powershell >nul 2>nul
if errorlevel 1 (
    echo ERROR: PowerShell is not installed or not in PATH
    echo Please install PowerShell or run the installer manually
    pause
    exit /b 1
)

:: Run the PowerShell installation script
:: -ExecutionPolicy Bypass allows running the script without signing
:: -NoProfile skips loading the user's PowerShell profile
:: -File runs the script directly
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0INSTALL.ps1"

:: Capture the exit code
set EXITCODE=%ERRORLEVEL%

:: If installation failed, show error
if %EXITCODE% neq 0 (
    echo.
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║                    INSTALLATION FAILED                         ║
    echo ║  Exit Code: %EXITCODE%
    echo ║                                                                ║
    echo ║  Please check the error messages above and try again.         ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
    pause
) else (
    :: If installation succeeded, show success message
    echo.
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║              INSTALLATION COMPLETED SUCCESSFULLY               ║
    echo ║                                                                ║
    echo ║  The development server should be running in PowerShell.      ║
    echo ║  Close that window to stop the server.                        ║
    echo ║                                                                ║
    echo ║  To restart the server, run: npm run dev                      ║
    echo ║  To build for production: npm run build                       ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
)

exit /b %EXITCODE%
