// Builds a single self-contained dist/index.html that works from file://.
import { build } from 'vite'
process.env.SINGLE_FILE = '1'
await build()
console.log('Single-file build written to dist/index.html')
