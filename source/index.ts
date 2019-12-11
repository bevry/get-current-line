/** The combination of details about the line that was executing at the time */
export interface LineInfo {
	/** the line number that was executing at the time */
	line: number
	/** the method that was executing at the time */
	method: string
	/** the file that was executing at the time */
	file: string
}

export type LineOffset = Partial<LineInfo>

/**
 * Get the information about the line that called this method.
 * @param offset set this to the distance between this method and the true caller
 * @throws if a failure occured creating the line info
 * @example Input
 * ``` javascript
 * import getCurrentLine from 'get-current-line'
 * console.log(getCurrentLine())
 * ```
 * @example Result
 * ``` json
 * {
 * 	"line": "2",
 * 	"method": "Object.<anonymous>",
 * 	"file": "/Users/balupton/some-project/calling-file.js"
 * }
 * ```
 */
export default function getCurrentLine(offset: LineOffset = {}): LineInfo {
	// Prepare
	if (offset.file == null) offset.file = __filename
	if (offset.method == null) offset.method = 'getCurrentLine'
	if (offset.line == null) offset.line = 0
	const result: LineInfo = {
		line: -1,
		method: 'unknown',
		file: 'unknown'
	}

	try {
		// Create an error
		const err = new Error()
		let stack: Error['stack'] | null, lines: any[]

		// And attempt to retrieve it's stack
		// https://github.com/winstonjs/winston/issues/401#issuecomment-61913086
		try {
			stack = err.stack
		} catch (error1) {
			try {
				// @ts-ignore
				const previous = err.__previous__ || err.__previous
				stack = previous && previous.stack
			} catch (error2) {
				stack = null
			}
		}

		// Handle different stack formats
		if (stack) {
			if (Array.isArray(stack)) {
				lines = Array(stack)
			} else {
				lines = stack.toString().split('\n')
			}
		} else {
			lines = []
		}

		// Handle different line formats
		lines = lines
			// Ensure each line item is a string
			.map((line: any) => (line || '').toString())
			// Filter out empty line items
			.filter((line: string) => line.length !== 0)

		// Parse our lines
		for (const line of lines) {
			// offset
			if (line.includes(offset.file) || line.includes(offset.method)) continue
			if (offset.line !== 0) {
				--offset.line
				continue
			}

			// extract
			const parts = line.split(':')
			if (parts.length >= 2) {
				if (parts[0].indexOf('(') === -1) {
					result.method = 'unknown'
					result.file = parts[0].replace(/^.+?\s+at\s+/, '')
				} else {
					result.method = parts[0]
						.replace(/^.+?\s+at\s+/, '')
						.replace(/\s+\(.+$/, '')
					result.file = parts[0].replace(/^.+?\(/, '')
				}
				result.line = Number(parts[1])
				break
			}
		}
	} catch (err) {
		throw new Error(`get-current-line: Failed to parse the error stack: ${err}`)
	}

	// Return
	return result
}
