@echo off
echo Starting Store Frontend - Full Stack Development Environment
echo.
echo This will start both the frontend (port 8000) and backend (port 3000) servers
echo.
echo Frontend: http://localhost:8000
echo Backend API: http://localhost:3000
echo.

REM Start backend server in background
start "Backend Server" cmd /c "cd /d %~dp0\..\backend && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend server
echo Starting frontend server...
python server.py