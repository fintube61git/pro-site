[CmdletBinding()]
param(
    [ValidateRange(1024, 65535)]
    [int]$Port = 8000,

    [switch]$NoOpen
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$cvUrl = "http://127.0.0.1:$Port/cv/#cv"
$healthUrl = "http://127.0.0.1:$Port/cv/"

Push-Location $repoRoot
try {
    Write-Host "Running repository integrity tests..."
    & python run_tests.py
    if ($LASTEXITCODE -ne 0) {
        throw "Repository tests failed. Preview was not opened."
    }

    $existingServer = $false
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri $healthUrl -TimeoutSec 2
        $existingServer = $response.StatusCode -eq 200
    }
    catch {
        $existingServer = $false
    }

    if ($existingServer) {
        Write-Host "Using an existing local server at $healthUrl"
    }
    else {
        $python = (Get-Command python -ErrorAction Stop).Source
        $server = Start-Process `
            -FilePath $python `
            -ArgumentList @("-m", "http.server", $Port, "--bind", "127.0.0.1") `
            -WorkingDirectory $repoRoot `
            -WindowStyle Hidden `
            -PassThru

        $ready = $false
        for ($attempt = 0; $attempt -lt 20; $attempt++) {
            Start-Sleep -Milliseconds 250
            if ($server.HasExited) {
                throw "The local preview server exited before it became ready."
            }

            try {
                $response = Invoke-WebRequest -UseBasicParsing -Uri $healthUrl -TimeoutSec 2
                if ($response.StatusCode -eq 200) {
                    $ready = $true
                    break
                }
            }
            catch {
                # Keep polling until the short readiness window expires.
            }
        }

        if (-not $ready) {
            Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
            throw "The local preview server did not become ready at $healthUrl"
        }

        Write-Host "Preview server process ID: $($server.Id)"
        Write-Host "Stop it later with: Stop-Process -Id $($server.Id)"
    }

    Write-Host "Private preview: $cvUrl"
    Write-Host "Nothing has been committed or published."

    if (-not $NoOpen) {
        Start-Process $cvUrl
    }
}
finally {
    Pop-Location
}
