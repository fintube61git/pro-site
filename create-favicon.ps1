# create-favicon.ps1
# Circle (green) with high-contrast white center dot — clearly visible

Add-Type -AssemblyName System.Drawing

$outputPath = "C:\Projects\pro-site\assets\img\favicon.ico"
$imgDir = "C:\Projects\pro-site\assets\img"
if (-not (Test-Path $imgDir)) { New-Item -ItemType Directory -Path $imgDir | Out-Null }

$size = 32
$bitmap = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.SmoothingMode = "AntiAlias"
$g.Clear([System.Drawing.Color]::Transparent)

# Brushes
$greenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0x2C, 0x5F, 0x2D))
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)

# Outer circle: centered at (16,16), diameter 24 → x=4, y=4, width=24, height=24
$g.FillEllipse($greenBrush, 4, 4, 24, 24)

# Center dot: diameter 8 → x=12, y=12, width=8, height=8
$g.FillEllipse($whiteBrush, 12, 12, 8, 8)

# Save as PNG
$tempPng = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "favicon_temp.png")
$bitmap.Save($tempPng, [System.Drawing.Imaging.ImageFormat]::Png)

# Build ICO
$pngBytes = [System.IO.File]::ReadAllBytes($tempPng)
$ico = New-Object System.IO.MemoryStream
$w = New-Object System.IO.BinaryWriter($ico)

$w.Write([UInt16]0); $w.Write([UInt16]1); $w.Write([UInt16]1)
$w.Write([Byte]32); $w.Write([Byte]32); $w.Write([Byte]0); $w.Write([Byte]0)
$w.Write([UInt16]1); $w.Write([UInt16]32)
$w.Write([UInt32]$pngBytes.Length); $w.Write([UInt32]22)
$w.Write($pngBytes); $w.Flush()

[System.IO.File]::WriteAllBytes($outputPath, $ico.ToArray())

# Cleanup
$greenBrush.Dispose(); $whiteBrush.Dispose()
$g.Dispose(); $bitmap.Dispose(); $w.Close(); $ico.Dispose()
Remove-Item $tempPng -ErrorAction SilentlyContinue

Write-Host "✅ Favicon with visible white dot created at: $outputPath"