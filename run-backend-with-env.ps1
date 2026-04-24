# Load .env file
$envPath = ".\backend\.env"
if (Test-Path $envPath) {
    Write-Host "Loading environment variables from $envPath..." -ForegroundColor Green
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*?)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [System.Environment]::SetEnvironmentVariable($name, $value)
            Write-Host "  Set: $name" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "Warning: .env file not found at $envPath" -ForegroundColor Yellow
}

# Verify environment variables are set
Write-Host "`nVerifying OAuth credentials..." -ForegroundColor Green
if ([System.Environment]::GetEnvironmentVariable("GOOGLE_CLIENT_ID")) {
    Write-Host "  ✓ GOOGLE_CLIENT_ID is set" -ForegroundColor Green
} else {
    Write-Host "  ✗ GOOGLE_CLIENT_ID is NOT set" -ForegroundColor Red
}

if ([System.Environment]::GetEnvironmentVariable("GOOGLE_CLIENT_SECRET")) {
    Write-Host "  ✓ GOOGLE_CLIENT_SECRET is set" -ForegroundColor Green
} else {
    Write-Host "  ✗ GOOGLE_CLIENT_SECRET is NOT set" -ForegroundColor Red
}

# Start the backend
Write-Host "`nStarting backend..." -ForegroundColor Green
cd backend
.\mvnw.cmd spring-boot:run
