param(
  [Parameter(Mandatory = $false)]
  [string]$MavenVersion = "3.9.9",

  [Parameter(Mandatory = $false)]
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

function Get-MavenHome {
  param([string]$Root, [string]$Version)
  return (Join-Path $Root (Join-Path ".tools" (Join-Path "maven" ("apache-maven-" + $Version))))
}

function Ensure-Directory {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function Ensure-Maven {
  param([string]$Root, [string]$Version)

  $toolsDir = Join-Path $Root ".tools"
  $mavenDir = Join-Path $toolsDir "maven"
  $mavenHome = Get-MavenHome -Root $Root -Version $Version
  $mvnCmd = Join-Path $mavenHome (Join-Path "bin" "mvn.cmd")

  if (Test-Path -LiteralPath $mvnCmd) {
    return $mavenHome
  }

  Ensure-Directory -Path $mavenDir

  $zipName = "apache-maven-$Version-bin.zip"
  $zipPath = Join-Path $mavenDir $zipName
  $downloadUrl = "https://archive.apache.org/dist/maven/maven-3/$Version/binaries/$zipName"

  if (-not (Test-Path -LiteralPath $zipPath)) {
    Write-Host "Downloading Maven $Version..."
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath
  }

  Write-Host "Extracting Maven..."
  Expand-Archive -LiteralPath $zipPath -DestinationPath $mavenDir -Force

  if (-not (Test-Path -LiteralPath $mvnCmd)) {
    throw "Maven download/extract failed. Expected to find: $mvnCmd"
  }

  return $mavenHome
}

$mavenHome = Ensure-Maven -Root $ProjectRoot -Version $MavenVersion

Write-Host "MAVEN_HOME=$mavenHome"
Write-Host "To use in this terminal:"
Write-Host "  `$env:MAVEN_HOME = `"$mavenHome`""
Write-Host "  `$env:Path = `"$mavenHome\bin;`$env:Path`""

