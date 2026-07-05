# Unified CV update tool
# Guided wrapper for the canonical CV workflow. Publishing still requires
# typing PUBLISH in the underlying publish script.

param(
    [string]$Command = "help",
    [string]$Section
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

function Show-Help {
    Write-Host "CV Update Tool"
    Write-Host "---------------"
    Write-Host "Guided wrapper for the canonical preview and publish workflow"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  edit [section]   Edit CV section (cv, pubs, pres)"
    Write-Host "  preview           Preview changes locally"
    Write-Host "  test-publish      Test publish without pushing"
    Write-Host "  publish           Publish approved changes after typed confirmation"
    Write-Host "  help              Show this help"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\tools\cv-tool.ps1 edit cv"
    Write-Host "  .\tools\cv-tool.ps1 preview"
    Write-Host "  .\tools\cv-tool.ps1 test-publish"
}

function Edit-Section {
    param([string]$section)
    
    $fileMap = @{
        "cv"   = "cv.md"
        "pubs" = "cv/publications.md"
        "pres" = "cv/presentations.md"
    }
    
    if (-not $fileMap.ContainsKey($section)) {
        Write-Host "Invalid section. Valid options: cv, pubs, pres"
        exit 1
    }
    
    $filePath = Join-Path $repoRoot $fileMap[$section]
    if (-not (Test-Path $filePath)) {
        Write-Host "File not found: $filePath"
        exit 1
    }
    
    Write-Host "Opening $($fileMap[$section]) for editing..."
    Start-Process (Get-Command code).Source -ArgumentList $filePath -Wait
    
    $previewChoice = Read-Host "Would you like to preview your changes? (Y/N)"
    if ($previewChoice -eq "Y" -or $previewChoice -eq "y") {
        Preview-Changes
    }
}

function Preview-Changes {
    Write-Host "Running preview..."
    & (Join-Path $PSScriptRoot "preview_cv.ps1")
}

function Publish-Changes {
    param([switch]$DryRun)
    
    if ($DryRun) {
        Write-Host "Running SAFE TEST publish (no changes pushed)..."
        & (Join-Path $PSScriptRoot "publish_cv.ps1") -DryRun
    }
    else {
        Write-Host "Running publish. This still requires typing PUBLISH."
        & (Join-Path $PSScriptRoot "publish_cv.ps1")
    }
}

switch ($Command.ToLower()) {
    "edit" {
        if (-not $Section) {
            Write-Host "Please specify a section to edit (cv, pubs, pres)"
            exit 1
        }
        Edit-Section $Section
    }
    "preview" { Preview-Changes }
    "test-publish" { Publish-Changes -DryRun }
    "publish" { Publish-Changes }
    "help" { Show-Help }
    default {
        Write-Host "Unknown command: $Command"
        Show-Help
        exit 1
    }
}
