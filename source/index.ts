/** The combination of details about the line that was executing at the time */
export interface LineInfo {
	/** the line number that was executing at the time */
	line: number
	/** the method that was executing at the time */
	method: string
	/** the file that was executing at the time */
	file: string
}

/**
 * If provided, continue skipping until:
 *
 * 1. The file or method is found
 * 2. Once found, will continue until neither the file nor method are found anymore
 * 3. Once exited, the frame offset will then apply
 *
 * If you wish to capture the method or the file, combine them with `frames: -1`.
 *
 * If you wish for more customisation than this, create an issue requesting passing a custom skip handler function, as more variance to this interface is too much customisation complexity.
 */
export interface LineOffset {
	/**
	 * if provided, continue until a method containing or matching this string is exited
	 * if provided alongside a file, will continue until neither the file nor method are found
	 * this allows file and method to act as fallbacks for each other, such that if one is not found, it doesn't skip everything
	 */
	method?: RegExp | string | null
	/**
	 * if provided, continue until a file containing or matching this string is exited
	 * if provided alongside a method, will continue until neither the file nor method are found
	 * this allows file and method to act as fallbacks for each other, such that if one is not found, it doesn't skip everything
	 */
	file?: RegExp | string | null
	/**
	 * once we have satisfied the found condition, if any, then apply this index offset to the frames
	 * e.g. 1 would mean next frame, and -1 would mean the previous frame
	 * Use -1 to go back to the found method or file
	 */
	frames?: number
}

/**
 * Get the information about the line that called this method.
 * @param offset continue until these offset conditions are met, used to continue to the caller
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
export default function getCurrentLine(
	offset: LineOffset = {
		file: __filename,
		method: 'getCurrentLine',
		frames: 0,
	}
): LineInfo {
	// prepare
	const result: LineInfo = {
		line: -1,
		method: 'unknown',
		file: 'unknown',
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

		// Continue
		let found: boolean = !offset.file && !offset.method
		let exited: boolean = found

		// Parse our lines
		let i = 0
		while (i < lines.length) {
			const line = lines[i]

			// continue
			if (found && exited) {
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
				// found and exited, but not a valid entry, so continue
				++i
				continue
			}

			// continue until found and exited
			if (
				(offset.file &&
					(typeof offset.file === 'string'
						? line.includes(offset.file)
						: offset.file.test(line))) ||
				(offset.method &&
					(typeof offset.method === 'string'
						? line.includes(offset.method)
						: offset.method.test(line)))
			) {
				found = true
				// next item
				++i
				continue
			} else if (found) {
				// exited, apply frame offset and call it a day
				i += offset.frames || 0
				exited = true
				continue
			} else {
				// nothing found yet, next item
				++i
				continue
			}
		}
	} catch (err) {
		throw new Error(`get-current-line: Failed to parse the error stack: ${err}`)
	}

	// Return
	return result
}
