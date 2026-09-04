$keyBytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($keyBytes)
$key = [Convert]::ToBase64String($keyBytes)

Write-Host "Skopiuj poniższą wartość do Vercel jako WIZYTOWNIK_ENCRYPTION_KEY_V1:"
Write-Host ""
Write-Host $key
Write-Host ""
Write-Host "Zachowaj drugą kopię w menedżerze haseł. Utrata klucza oznacza brak możliwości odczytania notatek."
