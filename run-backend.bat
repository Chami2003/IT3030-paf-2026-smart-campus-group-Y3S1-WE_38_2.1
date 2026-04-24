@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Loading backend/.env...
if exist "backend\.env" (
    for /f "usebackq tokens=1,* delims==" %%a in ("backend\.env") do (
        set "%%a=%%b"
        echo   [OK] Loaded %%a
    )
) else (
    echo   [ERROR] backend\.env file not found!
)

echo.
echo Verifying and setting environment variables:
if not "!GOOGLE_CLIENT_ID!"=="" (
    echo   [PASS] GOOGLE_CLIENT_ID is set
    set "SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID=!GOOGLE_CLIENT_ID!"
) else (
    echo   [FAIL] GOOGLE_CLIENT_ID is MISSING
)

if not "!GOOGLE_CLIENT_SECRET!"=="" (
    echo   [PASS] GOOGLE_CLIENT_SECRET is set
    set "SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET=!GOOGLE_CLIENT_SECRET!"
) else (
    echo   [FAIL] GOOGLE_CLIENT_SECRET is MISSING
)
echo ========================================
echo Starting Backend...
cd backend
set MVN_PATH=C:\Users\chami\Downloads\apache-maven-3.9.15-bin\apache-maven-3.9.15\bin\mvn.cmd

call "!MVN_PATH!" spring-boot:run
cd ..

endlocal
