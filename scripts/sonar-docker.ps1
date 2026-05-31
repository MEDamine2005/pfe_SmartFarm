# Smart Farm — SonarQube via Docker (sans installer sonar-scanner sur Windows)
# Usage:
#   .\scripts\sonar-docker.ps1
#   .\scripts\sonar-docker.ps1 -SonarToken "squ_xxxxxxxx"

param(
    [string]$SonarToken = $env:SONAR_TOKEN,
    [string]$SonarUrl = "http://host.docker.internal:9000"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backend = Join-Path $root "backend"

# Docker Desktop (ajouter au PATH si besoin)
$dockerBin = "C:\Program Files\Docker\Docker\resources\bin"
if (Test-Path $dockerBin) {
    $env:Path = "$dockerBin;" + $env:Path
}

$docker = (Get-Command docker -ErrorAction SilentlyContinue).Source
if (-not $docker) {
    Write-Host "Docker introuvable. Demarrez Docker Desktop puis relancez." -ForegroundColor Red
    exit 1
}

Write-Host "=== 1/4 Demarrage SonarQube (Docker) ===" -ForegroundColor Cyan
Push-Location $root
& $docker compose -f docker-compose.sonar.yml up -d
Pop-Location

Write-Host "Attente SonarQube sur http://localhost:9000 ..." -ForegroundColor Yellow
$ready = $false
for ($i = 0; $i -lt 40; $i++) {
    try {
        $status = Invoke-RestMethod -Uri "http://localhost:9000/api/system/status" -TimeoutSec 5
        if ($status.status -eq "UP") {
            $ready = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 5
    }
}

if (-not $ready) {
    Write-Host "SonarQube pas encore pret. Ouvrez http://localhost:9000 dans le navigateur." -ForegroundColor Red
    exit 1
}
Write-Host "SonarQube OK" -ForegroundColor Green

if (-not $SonarToken) {
    Write-Host ""
    Write-Host "=== Token SonarQube requis ===" -ForegroundColor Yellow
    Write-Host "1. Ouvrir http://localhost:9000"
    Write-Host "2. Login: admin / admin (changer le mot de passe si demande)"
    Write-Host "3. Creer projet 'smart-farm-web' ou utiliser celui existant"
    Write-Host "4. My Account > Security > Generate Token"
    Write-Host "5. Relancer: .\scripts\sonar-docker.ps1 -SonarToken `"VOTRE_TOKEN`""
    Write-Host ""
    exit 0
}

Write-Host "=== 2/4 Tests PHPUnit + couverture ===" -ForegroundColor Cyan
Push-Location $backend
Remove-Item Env:COMPOSER -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path "build\coverage" | Out-Null
php artisan test --coverage-clover=build/coverage/clover.xml
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    exit $LASTEXITCODE
}
Pop-Location
Write-Host "Tests OK" -ForegroundColor Green

Write-Host "=== 3/4 Analyse SonarScanner (Docker) ===" -ForegroundColor Cyan
& $docker run --rm `
    -v "${root}:/usr/src" `
    -w /usr/src `
    sonarsource/sonar-scanner-cli:latest `
    "-Dsonar.host.url=$SonarUrl" `
    "-Dsonar.login=$SonarToken"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Analyse SonarQube echouee" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "=== 4/4 Termine ===" -ForegroundColor Green
Write-Host "Resultats: http://localhost:9000/dashboard?id=smart-farm-web"
