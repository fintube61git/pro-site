[CmdletBinding()]
param(
    [string]$CommitMessage = "Update professional CV",

    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$allowedFiles = @(
    "cv.md",
    "cv/publications.md",
    "cv/presentations.md",
    "cv/index.html",
    "resume.md",
    "resume/index.html",
    "index.html",
    "404.html",
    "about.html",
    "research.html",
    "apps.html",
    "assets/img/apps-tools-hero-480.webp",
    "assets/img/apps-tools-hero-960.webp",
    "assets/img/apps-tools-hero-1536.webp",
    "contact.html",
    "privacy.html",
    "sitemap.xml",
    "practice/index.html",
    "practice/approach.html",
    "practice/services.html",
    "practice/fees-policies.html",
    "practice/faq.html",
    "practice/contact.html",
    "practice/privacy.html",
    "css/styles.v2.css",
    "js/markdown.js",
    "js/analytics.js",
    "tests/test_site_integrity.py",
    "tests/e2e/application-export.spec.ts",
    "tests/e2e/navigation.spec.ts",
    "tests/e2e/professional-research.spec.ts",
    "tests/e2e/public-boundary.spec.ts",
    "tests/e2e/analytics-consent.spec.ts",
    "tests/test_public_packaging.py",
    "tools/build_public_site.py",
    "tools/check_public_site.py",
    "tools/preview_cv.ps1",
    "tools/publish_cv.ps1",
    "tools/cv-tool.ps1",  # Add new tool to allowed files
    "README.md",
    "public-files.json"
)
$allowedDeletions = @(
    "tools/build_cv_html.ps1",
    "assets/documents/cctp-ii-certificate-exp-2028.pdf"
)

function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)

    & git @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Git command failed: git $($Arguments -join ' ')"
    }
}

Push-Location $repoRoot
try {
    $branch = (& git branch --show-current).Trim()
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to determine the current Git branch."
    }
    if ($branch -ne "main") {
        throw "CV publishing must run from the main branch. Current branch: $branch"
    }

    $trackedChanges = @(
        & git diff --name-only HEAD --
        & git diff --cached --name-only --
        & git ls-files --others --exclude-standard --
    ) | Where-Object { $_ } | Sort-Object -Unique

    $disallowedChanges = @(
        $trackedChanges | Where-Object {
            $allowedFiles -notcontains $_ -and -not (
                $allowedDeletions -contains $_ -and -not (Test-Path -LiteralPath (Join-Path $repoRoot $_))
            )
        }
    )
    if ($disallowedChanges.Count -gt 0) {
        throw "Refusing to publish with tracked changes outside the CV sources: $($disallowedChanges -join ', ')"
    }

    $changedCvFiles = @(
        $trackedChanges | Where-Object {
            $allowedFiles -contains $_ -or (
                $allowedDeletions -contains $_ -and -not (Test-Path -LiteralPath (Join-Path $repoRoot $_))
            )
        }
    )
    if ($changedCvFiles.Count -eq 0) {
        throw "No CV source changes were found."
    }

    Write-Host "Running repository integrity tests..."
    & python run_tests.py
    if ($LASTEXITCODE -ne 0) {
        throw "Repository tests failed. Nothing was published."
    }
    & python tools/build_public_site.py
    if ($LASTEXITCODE -ne 0) { throw "Public packaging failed. Nothing was published." }
    & python tools/check_public_site.py
    if ($LASTEXITCODE -ne 0) { throw "Public package verification failed. Nothing was published." }

    Write-Host "Refreshing origin/main..."
    Invoke-Git fetch origin main

    $divergence = (& git rev-list --left-right --count origin/main...HEAD).Trim() -split "\s+"
    if ($LASTEXITCODE -ne 0 -or $divergence.Count -ne 2) {
        throw "Unable to compare the local branch with origin/main."
    }
    if ($divergence[0] -ne "0" -or $divergence[1] -ne "0") {
        throw "Local main and origin/main have diverged or are not synchronized. Resolve that before publishing."
    }

    Write-Host ""
    Write-Host "CV files that will be published:"
    $changedCvFiles | ForEach-Object { Write-Host "  $_" }
    Write-Host ""
    & git diff -- $changedCvFiles
    & git diff --cached -- $changedCvFiles

    if ($DryRun) {
        Write-Host ""
        Write-Host "Dry run passed. Nothing was staged, committed, or pushed."
        return
    }

    $confirmation = Read-Host "Type PUBLISH to commit and push these CV changes to the public site"
    if ($confirmation -cne "PUBLISH") {
        throw "Publication cancelled. Nothing was committed or pushed."
    }

    # Already staged deletions have no remaining index entry for git add.
    $indexFiles = @(& git ls-files)
    if ($LASTEXITCODE -ne 0) { throw "Unable to inspect the publication index." }
    $filesToStage = @($changedCvFiles | Where-Object {
        (Test-Path -LiteralPath (Join-Path $repoRoot $_)) -or $indexFiles -contains $_
    })
    if ($filesToStage.Count -gt 0) { Invoke-Git add -- @filesToStage }
    & git diff --cached --quiet
    if ($LASTEXITCODE -eq 0) {
        throw "No staged CV changes remain to commit."
    }
    if ($LASTEXITCODE -ne 1) {
        throw "Unable to verify staged CV changes."
    }

    Invoke-Git commit -m $CommitMessage
    Invoke-Git push

    $head = (& git rev-parse --short HEAD).Trim()
    Write-Host ""
    Write-Host "Published commit $head to origin/main."
    Write-Host "Verify the live CV at https://www.tdawsonwoodrum.com/cv/#cv"
}
finally {
    Pop-Location
}
