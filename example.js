import getCurrentLine, {
	getFilenameFromError,
} from './edition-node-esm/index.js'

console.dir(new Error().stack)

console.dir(getFilenameFromError(new Error()))

console.dir(
	getCurrentLine(/* optional offset number of lines to skip if your caller is wrapped */),
)
