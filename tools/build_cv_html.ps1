$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$sourcePath = Join-Path $repoRoot "cv.md"
$expandedPath = Join-Path $repoRoot "_cv_expanded.md"
$outputHtmlPath = Join-Path $repoRoot "cv.html"

if (-not (Test-Path -LiteralPath $sourcePath)) {
    throw "Source markdown file not found: $sourcePath"
}

$sourceLines = Get-Content -LiteralPath $sourcePath
$includePattern = '^\s*\{\{< include ([^>\r\n]+) >\}\}\s*$'
$expandedLines = [System.Collections.Generic.List[string]]::new()

foreach ($line in $sourceLines) {
    $match = [regex]::Match($line, $includePattern)

    if ($match.Success) {
        $relativeIncludePath = $match.Groups[1].Value.Trim()
        $includePath = Join-Path $repoRoot $relativeIncludePath

        if (-not (Test-Path -LiteralPath $includePath)) {
            throw "Include target file not found: $relativeIncludePath (resolved to: $includePath)"
        }

        $includeLines = Get-Content -LiteralPath $includePath
        foreach ($includeLine in $includeLines) {
            $expandedLines.Add($includeLine)
        }
    }
    else {
        $expandedLines.Add($line)
    }
}

Set-Content -LiteralPath $expandedPath -Value $expandedLines

$expandedText = Get-Content -LiteralPath $expandedPath -Raw
if ($expandedText -like '*{{< include*') {
    Write-Error "Include expansion failed: '_cv_expanded.md' still contains '{{< include'."
    exit 1
}

pandoc $expandedPath --standalone -o $outputHtmlPath
