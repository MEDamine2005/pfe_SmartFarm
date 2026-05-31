# Smart Farm — tests PHPUnit + preparation SonarQube
# Usage: .\scripts\run-tests-and-sonar.ps1
# SonarQube: installer SonarScanner puis lancer depuis la racine:
#   sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.token=VOTRE_TOKEN

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backend = Join-Path $root "backend"

Write-Host "=== PHPUnit (Laravel) ===" -ForegroundColor Cyan
Push-Location $backend

New-Item -ItemType Directory -Force -Path "build\coverage" | Out-Null

php artisan test --coverage-clover=build/coverage/clover.xml
$testExit = $LASTEXITCODE

Pop-Location

if ($testExit -ne 0) {
    Write-Host "Tests echoues (code $testExit)" -ForegroundColor Red
    exit $testExit
}

Write-Host "`n=== Tests OK ===" -ForegroundColor Green
Write-Host "Couverture: backend\build\coverage\clover.xml"
Write-Host "`nPour SonarQube (apres demarrage du serveur SonarQube):" -ForegroundColor Yellow
Write-Host "  cd $root"
Write-Host "  sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.token=VOTRE_TOKEN"

exit 0
