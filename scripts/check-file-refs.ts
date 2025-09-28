#!/usr/bin/env node
// scripts/check-file-refs.ts

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

type DepMap = Record<string, unknown>

interface PackageJson {
    dependencies?: DepMap
    devDependencies?: DepMap
    peerDependencies?: DepMap
    // allow other fields without caring about them
    [key: string]: unknown
}

function isString(x: unknown): x is string {
    return typeof x === 'string'
}

function collectFileRefs(sectionName: string, deps?: DepMap): string[] {
    if (!deps) return []
    const hits: string[] = []

    for (const [name, version] of Object.entries(deps)) {
        if (isString(version) && version.startsWith('file:../')) {
            hits.push(`${sectionName}.${name}: ${version}`)
        }
    }
    return hits
}

export function checkFileRefs(
    pkgPath = path.join(process.cwd(), 'package.json')
): number {
    if (!existsSync(pkgPath)) {
        console.error('❌ package.json not found')
        return 1
    }

    let pkg: PackageJson
    try {
        pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
    } catch (e) {
        console.error('❌ Failed to parse package.json:', e)
        return 1
    }

    const refs = [
        ...collectFileRefs('dependencies', pkg.dependencies),
        ...collectFileRefs('devDependencies', pkg.devDependencies),
        ...collectFileRefs('peerDependencies', pkg.peerDependencies),
    ]

    if (refs.length > 0) {
        console.error('❌ Found file:../ references in package.json:')
        for (const r of refs) console.error(`   - ${r}`)
        console.error(
            '\n🚫 Pre-commit blocked: file:../ references are not allowed in production builds.'
        )
        console.error(
            '   Please use published versions or relative paths within the same repository.'
        )
        return 1
    }

    console.log('✅ No file:../ references found in package.json')
    return 0
}

// Run when executed directly (not when imported)
const isDirectRun =
    import.meta.url === pathToFileURL(process.argv[1] ?? '').href
if (isDirectRun) {
    const code = checkFileRefs()
    // Use process.exit only on direct run, not when imported.
    process.exit(code)
}
