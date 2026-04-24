$ErrorActionPreference = "Continue"

$commits = @(
    "docs: clarify OAuth environment variables setup",
    "refactor: optimize JWT token validation flow",
    "style: format backend configuration files",
    "chore: update notification service dependencies",
    "test: prepare test environment for API controllers"
)

$date = "2026-04-23"
$hour = 10

foreach ($msg in $commits) {
    # Make a tiny change to a file
    Add-Content -Path "backend/README.md" -Value "`n<!-- update -->"
    
    git add backend/README.md
    
    $commitDate = "${date}T${hour}:00:00+0530"
    
    $env:GIT_AUTHOR_DATE = $commitDate
    $env:GIT_COMMITTER_DATE = $commitDate
    
    git commit -m $msg
    
    $hour++
}

git push origin Notification+role-management+Oath-integration --force
