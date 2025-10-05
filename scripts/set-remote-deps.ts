#!/usr/bin/env ts-node
// scripts/set-remote-deps.ts
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

function run(cmd: string): string {
    return execSync(cmd, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'inherit'],
    }).trim()
}

function getLatestVersion(pkg: string): string {
    try {
        // clear cache for safety
        run('npm cache clean --force')
        // fetch latest version
        const version = run(`npm show ${pkg} version`)
        return `^${version}`
    } catch (err) {
        console.error(`❌ Failed to fetch version for ${pkg}`, err)
        process.exit(1)
    }
}

const file = resolve(process.argv[2] ?? 'package.json')
const raw = readFileSync(file, 'utf8')

const latestJs = getLatestVersion('@fencyai/js')
const latestReact = getLatestVersion('@fencyai/react')

// Parse the package.json to properly handle adding missing dependencies
const pkg = JSON.parse(raw)

// Ensure dependencies object exists
if (!pkg.dependencies) {
    pkg.dependencies = {}
}

// Add or update the fency packages
pkg.dependencies['@fencyai/js'] = latestJs
pkg.dependencies['@fencyai/react'] = latestReact

// Convert back to JSON with proper formatting
const replaced = JSON.stringify(pkg, null, 4) + '\n'

// Validate JSON after replacement (throws if broken)
try {
    JSON.parse(replaced)
} catch (e) {
    console.error('Resulting package.json is invalid JSON:', e)
    process.exit(1)
}

if (replaced !== raw) {
    writeFileSync(file, replaced)
    console.log(
        `✅ Updated ${file} to use remote npm versions:\n` +
            `  @fencyai/js     -> ${latestJs}\n` +
            `  @fencyai/react  -> ${latestReact}`
    )
} else {
    console.log(
        `No changes made to ${file}. (Packages may already be set correctly.)`
    )
}
