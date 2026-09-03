[CmdletBinding()]
param(
  [Parameter(Position = 0)]
  [ValidateSet('install', 'uninstall', 'status')]
  [string]$Action,
  [ValidateSet('pi', 'codex', 'claude')]
  [string[]]$Target = @(),
  [switch]$DryRun,
  [switch]$Force,
  [switch]$Backup
)

$ErrorActionPreference = 'Stop'

function Get-EnvOrDefault([string]$Name, [string]$Default) {
  $value = [Environment]::GetEnvironmentVariable($Name)
  if ([string]::IsNullOrWhiteSpace($value)) { return $Default }
  return $value
}

function Get-CanonicalPath([string]$Path) {
  return (Resolve-Path -LiteralPath $Path).Path
}

function Test-ExistingPath([string]$Path) {
  return $null -ne (Get-Item -LiteralPath $Path -Force -ErrorAction SilentlyContinue)
}

function Test-SymbolicLink([string]$Path) {
  $item = Get-Item -LiteralPath $Path -Force -ErrorAction SilentlyContinue
  return $null -ne $item -and $item.LinkType -eq 'SymbolicLink'
}

function Test-Directory([string]$Path) {
  $item = Get-Item -LiteralPath $Path -Force -ErrorAction SilentlyContinue
  return $null -ne $item -and $item.PSIsContainer
}

function Test-LinkPointsTo([string]$Link, [string]$Source) {
  if (-not (Test-SymbolicLink $Link)) { return $false }

  try {
    return (Get-CanonicalPath $Link) -eq (Get-CanonicalPath $Source)
  } catch {
    return $false
  }
}

function Invoke-FileOperation([scriptblock]$Operation, [string]$Description) {
  if ($DryRun) {
    Write-Output "DRY-RUN: $Description"
  } else {
    & $Operation
  }
}

function Add-Link([string]$Source, [string]$Destination, [string]$Label) {
  $script:Links += [PSCustomObject]@{
    Source = $Source
    Destination = $Destination
    Label = $Label
  }
}

function Add-Skills([string]$Destination, [string]$Harness) {
  Get-ChildItem -LiteralPath $skillsSource -Directory |
    Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'SKILL.md') -PathType Leaf } |
    Sort-Object Name |
    ForEach-Object { Add-Link $_.FullName (Join-Path $Destination $_.Name) "$Harness skill: $($_.Name)" }
}

if ($Force -and $Backup) { throw 'Use only one of -Force or -Backup.' }
if ($Action -ne 'install' -and ($Force -or $Backup)) { throw '-Force and -Backup only apply to install.' }

$repoRoot = Split-Path -Parent $PSScriptRoot
$commonSource = Get-EnvOrDefault 'SPELLBOOK_SOURCE' $repoRoot
$piSource = Get-EnvOrDefault 'SPELLBOOK_PI_SOURCE' $commonSource
$codexSource = Get-EnvOrDefault 'SPELLBOOK_CODEX_SOURCE' $commonSource
$skillsSource = Get-EnvOrDefault 'SPELLBOOK_SKILLS_SOURCE' (Join-Path $commonSource 'source\skills')
$piSource = Get-CanonicalPath $piSource
$codexSource = Get-CanonicalPath $codexSource
$skillsSource = Get-CanonicalPath $skillsSource

$userHome = [Environment]::GetFolderPath('UserProfile')
$piDir = Get-EnvOrDefault 'PI_CODING_AGENT_DIR' (Join-Path $userHome '.pi\agent')
$codexHome = Get-EnvOrDefault 'CODEX_HOME' (Join-Path $userHome '.codex')
$codexSkillsDir = Get-EnvOrDefault 'CODEX_SKILLS_DIR' (Join-Path $codexHome 'skills')
$claudeCodeDir = Get-EnvOrDefault 'CLAUDE_CODE_DIR' (Join-Path $userHome '.claude')
$claudeSkillsDir = Join-Path $claudeCodeDir 'skills'

$selectedTargets = @()
if ($Target.Count -gt 0) {
  $selectedTargets = $Target | Select-Object -Unique
} elseif ($Action -in 'uninstall', 'status') {
  $selectedTargets = @('pi', 'codex', 'claude')
} else {
  foreach ($candidate in 'pi', 'codex', 'claude') {
    $commandName = switch ($candidate) {
      'pi' { Get-EnvOrDefault 'PI_BIN' 'pi' }
      'codex' { Get-EnvOrDefault 'CODEX_BIN' 'codex' }
      'claude' { Get-EnvOrDefault 'CLAUDE_BIN' 'claude' }
    }
    if (Get-Command $commandName -ErrorAction SilentlyContinue) {
      $selectedTargets += $candidate
    } else {
      Write-Output "Skipping ${candidate}: command not found."
    }
  }
}

if ($selectedTargets.Count -eq 0) {
  Write-Output 'No supported agent harnesses found on PATH. Use -Target to configure one explicitly.'
  exit 0
}

$Links = @()
foreach ($candidate in $selectedTargets) {
  switch ($candidate) {
    'pi' {
      Add-Link (Join-Path $piSource 'source\AGENTS.md') (Join-Path $piDir 'AGENTS.md') 'Pi AGENTS.md'
      foreach ($resource in 'extensions', 'skills', 'prompts', 'themes') {
        Add-Link (Join-Path $piSource "source\$resource") (Join-Path $piDir "$resource\spellbook") "Pi $resource"
      }
    }
    'codex' {
      Add-Link (Join-Path $codexSource 'source\AGENTS.md') (Join-Path $codexHome 'AGENTS.md') 'Codex AGENTS.md'
      Add-Link $skillsSource $codexSkillsDir 'Codex skills'
    }
    'claude' { Add-Skills $claudeSkillsDir 'Claude Code' }
  }
}

if ($Action -eq 'install') {
  $hasConflict = $false
  foreach ($link in $Links) {
    if (-not (Test-Path -LiteralPath $link.Source)) {
      Write-Error "Source does not exist: $($link.Source)"
      $hasConflict = $true
    } elseif (-not [IO.Path]::IsPathRooted($link.Destination)) {
      Write-Error "Target must be an absolute path: $($link.Destination)"
      $hasConflict = $true
    } elseif ((Test-ExistingPath $link.Destination) -and -not (Test-SymbolicLink $link.Destination) -and -not (Test-Directory $link.Destination) -and -not $Force -and -not $Backup) {
      Write-Error "Conflict: $($link.Destination) already exists. Re-run with -Backup or -Force."
      $hasConflict = $true
    }
  }
  if ($hasConflict) { exit 1 }
}

foreach ($link in $Links) {
  $exists = Test-ExistingPath $link.Destination
  $isSymbolicLink = Test-SymbolicLink $link.Destination
  $pointsToSource = Test-LinkPointsTo $link.Destination $link.Source

  switch ($Action) {
    'install' {
      if ($pointsToSource) {
        Write-Output "Already installed: $($link.Label)"
        continue
      }
      if ($exists -and -not $isSymbolicLink) {
        if (Test-Directory $link.Destination) {
          Write-Warning "Skipping $($link.Label): $($link.Destination) is an existing directory, not a symbolic link."
          continue
        }
        if ($Backup) {
          $backupPath = "$($link.Destination).bak.$(Get-Date -Format yyyyMMddHHmmss)"
          $suffix = 0
          while (Test-ExistingPath $backupPath) { $suffix++; $backupPath = "$($link.Destination).bak.$(Get-Date -Format yyyyMMddHHmmss).$suffix" }
          Write-Output "Backing up conflict: $($link.Destination) -> $backupPath"
          Invoke-FileOperation { Move-Item -LiteralPath $link.Destination -Destination $backupPath } "Move-Item $($link.Destination) $backupPath"
        } elseif ($Force) {
          Write-Output "Removing conflict: $($link.Destination)"
          Invoke-FileOperation { Remove-Item -LiteralPath $link.Destination -Force } "Remove-Item $($link.Destination)"
        }
      }
      if ($isSymbolicLink) {
        Write-Output "Replacing link: $($link.Label) ($($link.Destination))"
        Invoke-FileOperation { Remove-Item -LiteralPath $link.Destination -Force } "Remove-Item $($link.Destination)"
      }
      Write-Output "Installing: $($link.Label) ($($link.Destination) -> $($link.Source))"
      Invoke-FileOperation { New-Item -ItemType Directory -Path (Split-Path -Parent $link.Destination) -Force | Out-Null } "New-Item directory $(Split-Path -Parent $link.Destination)"
      Invoke-FileOperation { New-Item -ItemType SymbolicLink -Path $link.Destination -Target $link.Source | Out-Null } "New-Item symbolic link $($link.Destination) -> $($link.Source)"
    }
    'uninstall' {
      if ($pointsToSource) {
        Write-Output "Uninstalling: $($link.Label)"
        Invoke-FileOperation { Remove-Item -LiteralPath $link.Destination -Force } "Remove-Item $($link.Destination)"
      } elseif ($exists) {
        Write-Output "Skipping non-spellbook path: $($link.Destination)"
      } else {
        Write-Output "Not installed: $($link.Label)"
      }
    }
    'status' {
      if ($pointsToSource) {
        Write-Output "Installed: $($link.Label) ($($link.Destination) -> $($link.Source))"
      } elseif ($exists) {
        Write-Output "Conflict: $($link.Label) ($($link.Destination))"
      } else {
        Write-Output "Not installed: $($link.Label)"
      }
    }
  }
}
