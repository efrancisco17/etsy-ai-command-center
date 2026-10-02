# ============================================================================
# Etsy AI Command Center - PowerShell Installation Script
# ============================================================================
# This script installs dependencies, configures environment, and starts the app
# with full animation support (sidebar, transitions, card glows)
# ============================================================================

param(
    [switch]$SkipNodeCheck = $false,
    [switch]$DevMode = $true,
    [switch]$SkipBuild = $false
)

# Console colors
$colors = @{
    Header = [System.ConsoleColor]::Cyan
    Success = [System.ConsoleColor]::Green
    Error = [System.ConsoleColor]::Red
    Warning = [System.ConsoleColor]::Yellow
    Info = [System.ConsoleColor]::Magenta
    Text = [System.ConsoleColor]::White
}

function Write-Header($text) {
    Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor $colors.Header
    Write-Host "║ $($text.PadRight(62)) ║" -ForegroundColor $colors.Header
    Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor $colors.Header
}

function Write-Success($text) {
    Write-Host "✅ $text" -ForegroundColor $colors.Success
}

function Write-Error-Custom($text) {
    Write-Host "❌ $text" -ForegroundColor $colors.Error
}

function Write-Warning-Custom($text) {
    Write-Host "⚠️  $text" -ForegroundColor $colors.Warning
}

function Write-Info($text) {
    Write-Host "ℹ️  $text" -ForegroundColor $colors.Info
}

function Check-Command($cmdName) {
    $cmd = Get-Command $cmdName -ErrorAction SilentlyContinue
    return $null -ne $cmd
}

function Verify-Node {
    Write-Header "Step 1: Checking Node.js & npm"

    if ($SkipNodeCheck) {
        Write-Info "Skipping Node.js check..."
        return $true
    }

    # Check Node.js
    if (Check-Command "node") {
        $nodeVersion = node --version
        Write-Success "Node.js found: $nodeVersion"
    }
    else {
        Write-Error-Custom "Node.js is not installed!"
        Write-Host "`nTo install Node.js:"
        Write-Host "  • Download from https://nodejs.org (LTS recommended)"
        Write-Host "  • Or use: choco install nodejs`n"
        return $false
    }

    # Check npm
    if (Check-Command "npm") {
        $npmVersion = npm --version
        Write-Success "npm found: $npmVersion"
    }
    else {
        Write-Error-Custom "npm is not installed!"
        return $false
    }

    return $true
}

function Install-Dependencies {
    Write-Header "Step 2: Installing Dependencies"

    if (-not (Test-Path "node_modules")) {
        Write-Info "Running: npm install"
        npm install

        if ($LASTEXITCODE -eq 0) {
            Write-Success "Dependencies installed successfully"
        }
        else {
            Write-Error-Custom "Failed to install dependencies"
            return $false
        }
    }
    else {
        Write-Success "Dependencies already installed"
    }

    return $true
}

function Setup-Environment {
    Write-Header "Step 3: Setting Up Environment"

    $envFile = ".env"
    $envExampleFile = ".env.example"

    if (-not (Test-Path $envFile)) {
        if (Test-Path $envExampleFile) {
            Copy-Item $envExampleFile -Destination $envFile
            Write-Success "Created .env from .env.example"
        }
        else {
            Write-Info "Creating .env file with default configuration"
            $envContent = @"
# Etsy AI Command Center - Environment Configuration
VITE_APP_NAME=Etsy AI Command Center
VITE_API_URL=http://localhost:5000
VITE_CLAUDE_API_KEY=your_claude_api_key_here
NODE_ENV=development
"@
            Set-Content -Path $envFile -Value $envContent
            Write-Success "Created .env file"
        }
        Write-Warning-Custom "Please update .env with your actual API keys"
    }
    else {
        Write-Success ".env file already exists"
    }

    return $true
}

function Build-Project {
    Write-Header "Step 4: Building Project"

    if ($SkipBuild) {
        Write-Info "Skipping build as requested"
        return $true
    }

    Write-Info "Running: npm run build"
    npm run build

    if ($LASTEXITCODE -eq 0) {
        Write-Success "Project built successfully"
        return $true
    }
    else {
        Write-Warning-Custom "Build had issues, continuing anyway..."
        return $true
    }
}

function Show-Animation-Features {
    Write-Header "Animation Features Enabled"

    Write-Host "✨ Sidebar Animation" -ForegroundColor $colors.Info
    Write-Host "   • Smooth slide-in/slide-out transitions (400ms)"
    Write-Host "   • Cubic-bezier easing for natural feel`n" -ForegroundColor $colors.Text

    Write-Host "🎬 Page Transitions" -ForegroundColor $colors.Info
    Write-Host "   • Fade-in with subtle Y-axis movement"
    Write-Host "   • 400ms entrance, 300ms exit animations`n" -ForegroundColor $colors.Text

    Write-Host "✨ Card Glows" -ForegroundColor $colors.Info
    Write-Host "   • Emerald glow on hover (primary cards)"
    Write-Host "   • Blue glow for secondary cards"
    Write-Host "   • 3-second pulsing animation`n" -ForegroundColor $colors.Text

    Write-Host "🎨 Additional Effects" -ForegroundColor $colors.Info
    Write-Host "   • Staggered list animations (up to 8 items)"
    Write-Host "   • Button press effects with scale animation"
    Write-Host "   • Text glow for important elements`n" -ForegroundColor $colors.Text
}

function Start-DevServer {
    Write-Header "Step 5: Starting Development Server"

    if ($DevMode) {
        Write-Info "Starting development server with animations enabled..."
        Write-Host "`n🚀 Watch for these animations when the app opens:" -ForegroundColor $colors.Success
        Write-Host "   • Sidebar slides in from the left"
        Write-Host "   • Dashboard cards fade in with staggered timing"
        Write-Host "   • Cards glow on hover with emerald/blue effect"
        Write-Host "   • Page transitions smooth when navigating`n" -ForegroundColor $colors.Text

        Write-Info "Running: npm run dev"
        npm run dev
    }
    else {
        Write-Info "Dev mode disabled. Run 'npm run dev' to start the server."
        return $true
    }
}

function Main {
    Clear-Host
    Write-Host "
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║        🚀 ETSY AI COMMAND CENTER - PRODUCTION SETUP 🚀           ║
║                                                                   ║
║  • 5 Advanced AI Phases (Analysis, Creator, Manager, etc)       ║
║  • Claude API Integration                                       ║
║  • Dark Theme with Premium Animations                           ║
║  • Sidebar Slides • Page Fades • Card Glows                      ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
" -ForegroundColor $colors.Header

    # Check system requirements
    if (-not (Verify-Node)) {
        Write-Error-Custom "`nSetup aborted. Please install Node.js first."
        exit 1
    }

    # Install dependencies
    if (-not (Install-Dependencies)) {
        Write-Error-Custom "`nSetup aborted. Failed to install dependencies."
        exit 1
    }

    # Setup environment
    if (-not (Setup-Environment)) {
        Write-Error-Custom "`nSetup aborted. Failed to setup environment."
        exit 1
    }

    # Build project
    if (-not (Build-Project)) {
        Write-Error-Custom "`nBuild completed with warnings. Continuing..."
    }

    # Show animation features
    Show-Animation-Features

    # Start dev server
    if ($DevMode) {
        Write-Header "Final Step: Starting Application"
        Write-Info "Press Ctrl+C to stop the server"
        Write-Host ""
        Start-DevServer
    }
    else {
        Write-Header "Installation Complete!"
        Write-Success "All setup steps completed successfully"
        Write-Info "To start the dev server, run: npm run dev"
        Write-Info "To build for production, run: npm run build"
    }
}

# Run main function
Main
