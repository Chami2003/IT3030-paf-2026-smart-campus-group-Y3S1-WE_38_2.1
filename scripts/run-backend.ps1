param(
  [Parameter(Mandatory = $false)]
  [string]$JavaHome,

  [Parameter(Mandatory = $false)]
  [string]$Profile = "",

  [Parameter(Mandatory = $false)]
  [int]$Port = 8080
)

$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$backendDir = Join-Path $root "backend"
$pomPath = Join-Path $backendDir "pom.xml"

if (-not (Test-Path -LiteralPath $pomPath)) {
  throw "Can't find backend/pom.xml at: $pomPath"
}

$javaCmd = $null

if ($JavaHome) {
  $candidate = Join-Path $JavaHome (Join-Path "bin" "java.exe")
  if (Test-Path -LiteralPath $candidate) {
    $javaCmd = $candidate
  } else {
    throw "Provided -JavaHome does not contain bin\\java.exe: $JavaHome"
  }
}

if (-not $javaCmd) {
  $cmd = Get-Command java -ErrorAction SilentlyContinue
  if ($cmd) {
    $javaCmd = $cmd.Source
  }
}

if (-not $javaCmd -and $env:JAVA_HOME) {
  $candidate = Join-Path $env:JAVA_HOME (Join-Path "bin" "java.exe")
  if (Test-Path -LiteralPath $candidate) {
    $javaCmd = $candidate
  }
}

if (-not $javaCmd) {
  $where = & where.exe java 2>$null
  if ($LASTEXITCODE -eq 0 -and $where) {
    $javaCmd = ($where | Select-Object -First 1)
  }
}

if (-not $javaCmd) {
  Write-Host "Java not found from inside script."
  Write-Host "JAVA_HOME=$env:JAVA_HOME"
  Write-Host "Tip: run 'where java' in this same terminal."
  throw "Java not found. Install JDK 11+ and make sure 'java' is in PATH (or set JAVA_HOME), then re-run."
}

$prevEap = $ErrorActionPreference
$ErrorActionPreference = "Continue"
try {
  # `java -version` prints to stderr; don't treat that as a fatal error.
  $java = & $javaCmd -version 2>&1
} finally {
  $ErrorActionPreference = $prevEap
}

Write-Host "Java detected:"
$java | ForEach-Object { Write-Host "  $_" }

$mavenBootstrap = Join-Path $root "scripts\\maven-local.ps1"
. $mavenBootstrap

if (-not $mavenHome) {
  throw "Maven bootstrap did not set `$mavenHome. Check: $mavenBootstrap"
}

$env:MAVEN_HOME = $mavenHome
$env:Path = "$mavenHome\\bin;$env:Path"

Push-Location $backendDir
try {
  Write-Host "Running Spring Boot backend..."
  $portArg = "--server.port=$Port"
  if ([string]::IsNullOrWhiteSpace($Profile)) {
    & mvn -q -DskipTests "-Dspring-boot.run.arguments=$portArg" spring-boot:run
  } else {
    & mvn -q -DskipTests "-Dspring-boot.run.profiles=$Profile" "-Dspring-boot.run.arguments=$portArg" spring-boot:run
  }
} finally {
  Pop-Location
}

