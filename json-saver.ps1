$config = (Get-Content .\config.json -Encoding UTF8) -join "`n" | ConvertFrom-Json

Set-Location $config.downloads_path

while($true){
    foreach($match in $config.matches){
        foreach($file in Get-ChildItem){
            if($file.Name -match $match.filename_expression -and
            ((Get-Content (".\" + $file.Name )-Encoding UTF8) -join "`n" | 
            ConvertFrom-Json).URL -match $match.url_expression){
                Write-Host "Moved $file!"
                $file | Move-Item -Destination $match.path
            }
        }
    }
    Start-Sleep -Seconds $config.frequency
}
