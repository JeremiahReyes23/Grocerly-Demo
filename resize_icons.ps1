# PowerShell script to resize the Grocerly brand icon to PWA-compliant sizes
Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Mr. Reyes\.gemini\antigravity-ide\scratch\grocerly\new_logo.png"
$destDir = "C:\Users\Mr. Reyes\.gemini\antigravity-ide\scratch\grocerly"

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$sizes = @(
    @{ Width = 512; Height = 512; Name = "icon-512x512.png" },
    @{ Width = 192; Height = 192; Name = "icon-192x192.png" },
    @{ Width = 180; Height = 180; Name = "apple-touch-icon.png" },
    @{ Width = 32;  Height = 32;  Name = "favicon-32x32.png" }
)

Write-Host "Resizing icons..."
foreach ($size in $sizes) {
    $width = $size.Width
    $height = $size.Height
    $name = $size.Name
    $destPath = Join-Path $destDir $name
    
    $srcImg = [System.Drawing.Image]::FromFile($srcPath)
    $destImg = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($destImg)
    
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $g.DrawImage($srcImg, 0, 0, $width, $height)
    
    $destImg.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $g.Dispose()
    $destImg.Dispose()
    $srcImg.Dispose()
    
    Write-Host "Generated: $name ($width`x$height)"
}

# Also copy the 32x32 icon as favicon.ico in the root directory
$rootFavicon = "C:\Users\Mr. Reyes\.gemini\antigravity-ide\scratch\grocerly\favicon.ico"
Copy-Item (Join-Path $destDir "favicon-32x32.png") $rootFavicon -Force
Write-Host "Copied favicon.ico to root."
