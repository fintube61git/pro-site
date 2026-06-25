[CmdletBinding()]
param(
    [string]$CommitMessage = "Update professional CV",

    [switch]$DryRun,

    [switch]$ConfirmPublish
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$allowedFiles = @(
    "cv.md",
    "cv/publications.md",
    "cv/presentations.md"
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
    ) | Where-Object { $_ } | Sort-Object -Unique

    $disallowedChanges = @(
        $trackedChanges | Where-Object { $allowedFiles -notcontains $_ }
    )
    if ($disallowedChanges.Count -gt 0) {
        throw "Refusing to publish with tracked changes outside the CV sources: $($disallowedChanges -join ', ')"
    }

    $changedCvFiles = @(
        $trackedChanges | Where-Object { $allowedFiles -contains $_ }
    )
    if ($changedCvFiles.Count -eq 0) {
        throw "No CV source changes were found."
    }

    Write-Host "Running repository integrity tests..."
    & python run_tests.py
    if ($LASTEXITCODE -ne 0) {
        throw "Repository tests failed. Nothing was published."
    }

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
    & git diff -- $allowedFiles
    & git diff --cached -- $allowedFiles

    if ($DryRun) {
        Write-Host ""
        Write-Host "Dry run passed. Nothing was staged, committed, or pushed."
        return
    }

    if (-not $ConfirmPublish) {
        $confirmation = Read-Host "Type PUBLISH to commit and push these CV changes to the public site"
        if ($confirmation -cne "PUBLISH") {
            throw "Publication cancelled. Nothing was committed or pushed."
        }
    }

    Invoke-Git add -- $allowedFiles
    & git diff --cached --quiet
    if ($LASTEXITCODE -eq 0) {
        throw "No staged CV changes remain to commit."
    }
    if ($LASTEXITCODE -ne 1) {
        throw "Unable to verify staged CV changes."
    }

    Invoke-Git commit -m $CommitMessage
    Invoke-Git push origin main

    $head = (& git rev-parse --short HEAD).Trim()
    Write-Host ""
    Write-Host "Published commit $head to origin/main."
    Write-Host "Verify the live CV at https://www.tdawsonwoodrum.com/cv/#cv"
}
finally {
    Pop-Location
}
