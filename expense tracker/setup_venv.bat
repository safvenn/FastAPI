@echo off
echo ========================================
echo Python Virtual Environment Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo Step 1: Removing old virtual environment...
if exist .venv (
    rmdir /s /q .venv
    echo Old .venv deleted successfully!
) else (
    echo No existing .venv found.
)
echo.

echo Step 2: Creating new virtual environment...
python -m venv .venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)
echo Virtual environment created successfully!
echo.

echo Step 3: Activating virtual environment...
call .venv\Scripts\activate.bat
echo.

echo Step 4: Upgrading pip...
python -m pip install --upgrade pip
echo.

echo Step 5: Installing requirements...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install requirements
    pause
    exit /b 1
)
echo.

echo ========================================
echo Setup Complete! ✓
echo ========================================
echo.
echo Virtual environment is now active.
echo.
echo To activate it manually in the future, run:
echo   .venv\Scripts\activate
echo.
echo To deactivate, run:
echo   deactivate
echo.
echo To run your FastAPI server:
echo   uvicorn main:app --reload
echo.
pause
