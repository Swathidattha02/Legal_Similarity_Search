# AI Legal Case Similarity Platform - Multi-Service Launcher
# Launches the FastAPI AI Service, Express Backend, and React Frontend in separate console windows.

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "  AI Legal Case Similarity & Research Platform" -ForegroundColor Yellow
Write-Host "  Launching all 3 full-stack microservices..." -ForegroundColor Green
Write-Host "==============================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. FastAPI AI Service
Write-Host "`n[1/3] Starting FastAPI AI Service on http://localhost:8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend\ai-service'; .\venv\Scripts\activate; Write-Host '--- FastAPI AI Service (Port 8000) ---' -ForegroundColor Yellow; uvicorn main:app --reload --port 8000"

# 2. Express Backend
Write-Host "[2/3] Starting Express.js Backend on http://localhost:5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend'; Write-Host '--- Express Backend API (Port 5000) ---' -ForegroundColor Yellow; npm run dev"

# 3. React Frontend
Write-Host "[3/3] Starting Vite React Frontend on http://localhost:5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\frontend'; Write-Host '--- Vite React Frontend (Port 5173) ---' -ForegroundColor Yellow; npm run dev"

Write-Host "`n==============================================================" -ForegroundColor Green
Write-Host "  All services launched in separate windows!" -ForegroundColor Green
Write-Host "  Frontend URL : http://localhost:5173" -ForegroundColor White
Write-Host "  Backend API  : http://localhost:5000" -ForegroundColor White
Write-Host "  AI Docs      : http://localhost:8000/docs" -ForegroundColor White
Write-Host "==============================================================`n" -ForegroundColor Green
