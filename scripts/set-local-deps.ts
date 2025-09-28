// scripts/set-local-deps.ts
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const file = resolve(process.argv[2] ?? 'package.json')
const raw = readFileSync(file, 'utf8')

const replaced = raw
    // Replace values wherever they appear (deps or devDeps)
    .replace(
        /"@fencyai\/js"\s*:\s*"[^"]*"/g,
        `"@fencyai/js": "file:../fency-js-packages/packages/js"`
    )
    .replace(
        /"@fencyai\/react"\s*:\s*"[^"]*"/g,
        `"@fencyai/react": "file:../fency-js-packages/packages/react"`
    )

// Validate JSON after replacement (throws if broken)
try {
    JSON.parse(replaced)
} catch (e) {
    console.error('Resulting package.json is invalid JSON:', e)
    process.exit(1)
}

if (replaced !== raw) {
    writeFileSync(file, replaced)
    console.log(`Updated ${file} to use local fency packages.`)
} else {
    console.log(
        `No changes made to ${file}. (Keys may be missing or already correct.)`
    )
}
