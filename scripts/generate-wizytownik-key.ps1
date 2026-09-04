$keyBytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($keyBytes)
$rng.Dispose()
$key = [Convert]::ToBase64String($keyBytes)

Write-Host "Skopiuj poniższą wartość do Vercel jako WIZYTOWNIK_ENCRYPTION_KEY_V1:"
Write-Host ""
Write-Host $key
Write-Host ""
Write-Host "Zachowaj drugą kopię w menedżerze haseł. Utrata klucza oznacza brak możliwości odczytania notatek."
