# Unified CV update tool
# Simplifies CV updates with guided workflow. Supports dry-run testing.

param(
    [string]$Command = "help",
    [string]$Section
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

function Show-Help {
    Write-Host "CV Update Tool"
    Write-Host "---------------"
    Write-Host "Simplifies CV updates with safe testing options"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  edit [section]   Edit CV section (cv, pubs, pres)"
    Write-Host "  preview           Preview changes locally"
    Write-Host "  test-publish      Test publish without pushing"
    Write-Host "  publish           Publish approved changes"
    Write-Host "  phone             Update phone number"
    Write-Host "  license           Update license information"
    Write-Host "  help              Show this help"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  ./cv-tool edit cv"
    Write-Host "  ./cv-tool test-publish"
    Write-Host "  ./cv-tool phone"
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
        Write-Host "Running publish..."
        & (Join-Path $PSScriptRoot "publish_cv.ps1") -ConfirmPublish
    }
}

function Show-PhoneForm {
    $cvPath = Join-Path $repoRoot "cv.md"
    $content = Get-Content $cvPath
    $currentPhoneLine = $content | Select-String -Pattern "Phone: (.+)"
    
    if ($currentPhoneLine) {
        $currentPhone = $currentPhoneLine.Matches.Groups[1].Value
    } else {
        $currentPhone = ""
    }
    
    $newPhone = Read-Host "Enter new phone number [$currentPhone]"
    if (-not $newPhone) { $newPhone = $currentPhone }
    
    $newContent = $content -replace "Phone: .+", "Phone: $newPhone"
    Set-Content -Path $cvPath -Value $newContent
    Write-Host "Phone number updated to: $newPhone"
}

function Show-LicenseForm {
    $cvPath = Join-Path $repoRoot "cv.md"
    $content = Get-Content $cvPath
    $currentLicenseLine = $content | Select-String -Pattern "License: (.+)"
    $currentExpirationLine = $content | Select-String -Pattern "Expiration: (.+)"
    
    if ($currentLicenseLine) {
        $currentLicense = $currentLicenseLine.Matches.Groups[1].Value
    } else {
        $currentLicense = ""
    }
    
    if ($currentExpirationLine) {
        $currentExpiration = $currentExpirationLine.Matches.Groups[1].Value
    } else {
        $currentExpiration = ""
    }
    
    $newLicense = Read-Host "Enter license type [$currentLicense]"
    if (-not $newLicense) { $newLicense = $currentLicense }
    
    $newExpiration = Read-Host "Enter expiration date (MM/DD/YYYY) [$currentExpiration]"
    if (-not $newExpiration) { $newExpiration = $currentExpiration }
    
    $newContent = $content -replace "License: .+", "License: $newLicense"
    $newContent = $newContent -replace "Expiration: .+", "Expiration: $newExpiration"
    Set-Content -Path $cvPath -Value $newContent
    Write-Host "License updated to: $newLicense (Expires: $newExpiration)"
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
    "phone" { Show-PhoneForm }
    "license" { Show-LicenseForm }
    "help" { Show-Help }
    default {
        Write-Host "Unknown command: $Command"
        Show-Help
        exit 1
    }
}