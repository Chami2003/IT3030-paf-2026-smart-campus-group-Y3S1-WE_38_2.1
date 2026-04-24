$ErrorActionPreference = "Continue"

$commits = @(
    "2580649", "7eeaf54", "798a2b8", "4b9c79e", "0e4aef2", "e67664c", "ee1c6c1",
    "411de00", "d017ace", "c0e11c5", "3117da4", "7177839"
)

git checkout 1d73df3
git branch -D temp-date-branch 2>$null
git checkout -b temp-date-branch

$hour = 10
foreach ($c in $commits) {
    if ($hour -lt 17) {
        $date = "2026-04-24"
        $commitDate = "${date}T${hour}:00:00+0530"
    } else {
        $date = "2026-04-23"
        $h2 = $hour - 7 + 10
        $commitDate = "${date}T${h2}:00:00+0530"
    }
    
    $env:GIT_AUTHOR_DATE = $commitDate
    $env:GIT_COMMITTER_DATE = $commitDate
    
    git cherry-pick $c
    git commit --amend --no-edit --date=$commitDate
    
    $hour++
}

git branch -f Notification+role-management+Oath-integration HEAD
git checkout Notification+role-management+Oath-integration
git push origin Notification+role-management+Oath-integration --force
