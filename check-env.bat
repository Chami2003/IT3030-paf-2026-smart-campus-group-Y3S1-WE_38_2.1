@echo off
setlocal
for /f "usebackq tokens=1,* delims==" %%a in ("backend\.env") do (
  if not "%%a"=="" if not "%%b"=="" (
    set %%a=%%b
  )
)
echo GOOGLE_CLIENT_ID=%GOOGLE_CLIENT_ID%
echo GOOGLE_CLIENT_SECRET=%GOOGLE_CLIENT_SECRET%
endlocal
