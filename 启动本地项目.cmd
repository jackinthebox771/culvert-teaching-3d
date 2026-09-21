@echo off
setlocal

rem Always enter the project root to prevent package.json lookup errors.
cd /d "%~dp0"

echo ============================================================
echo   Culvert Teaching 3D - Local Development Server
echo ============================================================
echo.
echo Project directory: %CD%

where node >nul 2>&1
if errorlevel 1 goto :node_missing

for /f "delims=" %%v in ('node --version') do set "NODE_VERSION=%%v"
echo Node.js: %NODE_VERSION%

if not exist "node_modules\vite\bin\vite.js" (
  echo.
  echo First run: installing project dependencies...
  where npm.cmd >nul 2>&1
  if errorlevel 1 goto :npm_missing
  call npm.cmd install
  if errorlevel 1 goto :install_failed
)

echo.
echo Local URL: http://localhost:5173/culvert-teaching-3d/
echo Mobile: use the Network URL printed by Vite below.
echo Stop: press Ctrl+C in this window.
echo.

rem Delay browser launch briefly so the development server can start.
rem CULVERT_SKIP_OPEN=1 is used only by automated script checks.
if /i not "%CULVERT_SKIP_OPEN%"=="1" (
  start "" /b powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:5173/culvert-teaching-3d/'"
)

rem Run the project-local Vite directly, without relying on a global npm launcher.
node "node_modules\vite\bin\vite.js" --host 0.0.0.0
goto :end

:node_missing
echo.
echo [ERROR] Node.js was not found.
echo Install Node.js 22 LTS or newer, then run this script again.
echo Download: https://nodejs.org/
goto :pause_end

:npm_missing
echo.
echo [ERROR] Dependencies are missing and npm was not found.
echo Reinstall Node.js 22 LTS or newer, then try again.
goto :pause_end

:install_failed
echo.
echo [ERROR] npm install failed.
echo Check the network, or run npm install in the project directory for details.

:pause_end
echo.
pause

:end
endlocal
