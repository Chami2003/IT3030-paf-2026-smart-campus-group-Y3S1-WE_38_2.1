$ErrorActionPreference = "Continue"

# The original commits in order
$commits = @(
    "245ace7", # feat: implement core user management with entity and repository
    "a40da13", # feat: add user roles for access control
    "67a4ecc", # feat: integrate OAuth2 authentication with JWT support
    "88cc70d", # feat: implement notification service for campus alerts
    "fc4fe2d", # feat: add notification controller for API access
    "5b3b2dc"  # fix: align OAuth flow with backend port 8081
)

# Start from the base commit (origin/main is 1d73df3)
git checkout 1d73df3
git branch -D temp-rewrite-branch 2>$null
git checkout -b temp-rewrite-branch

foreach ($c in $commits) {
    Write-Host "Cherry-picking $c..."
    git cherry-pick $c
    
    $file = "backend/src/main/resources/application.properties"
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        $replaced = $false
        if ($content -match "1007431784909") {
            $content = $content -replace "1007431784909-jjq9ojgav1l37df1u3vsb0ik5lkjndnm\.apps\.googleusercontent\.com", "YOUR_CLIENT_ID_HERE"
            $replaced = $true
        }
        if ($content -match "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") {
            $content = $content -replace "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", "YOUR_CLIENT_SECRET_HERE"
            $replaced = $true
        }
        
        if ($replaced) {
            Write-Host "Removing secrets from $c"
            Set-Content -Path $file -Value $content -NoNewline
            git add $file
            git commit --amend --no-edit
        }
    }
}

Write-Host "Done rewriting history!"
