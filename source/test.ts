import { equal } from 'assert-helpers'
import kava from 'kava'
import getCurrentLine, { Offset } from './index.js'

function wrapper(opts?: Offset) {
	return getCurrentLine(opts)
}

function wrapMethod() {
	return wrapper({ method: 'wrapMethod' })
}

function wrapLine() {
	return wrapper({ method: /wrapline/i })
}

kava.suite('get-current-line', function (suite, test) {
	test('success', function named() {
		const { line, method, file } = getCurrentLine()
		equal(file.includes('test'), true, `file [${file}] includes test`)
		equal(method.includes('named'), true, `method [${method}] includes name`)
		const secondLine = getCurrentLine().line
		equal(
			line < secondLine,
			true,
			`second line [${secondLine}] was later than the first line [${line}]`
		)
	})
	test('wrapper', function named() {
		const a = wrapper()
		const b = wrapper()
		equal(a.file.includes('test'), true, `file [${a.file}] includes test`)
		equal(
			a.method.includes('wrapper'),
			true,
			`method [${a.method}] includes wrapper`
		)
		equal(
			a.line,
			b.line,
			'both lines were the same due to the lack of offset in the wrapper'
		)
	})
	test('wrapMethod', function named() {
		const { line, method, file } = wrapMethod()
		equal(file.includes('test'), true, `file [${file}] includes test`)
		equal(method.includes('named'), true, `method [${method}] includes name`)
		const secondLine = wrapMethod().line
		equal(
			line < secondLine,
			true,
			`second line [${secondLine}] was later than the first line [${line}]`
		)
	})
	test('wrapLine', function named() {
		const { line, method, file } = wrapLine()
		equal(file.includes('test'), true, `file [${file}] includes test`)
		equal(method.includes('named'), true, `method [${method}] includes name`)
		const secondLine = wrapLine().line
		equal(
			line < secondLine,
			true,
			`second line [${secondLine}] was later than the first line [${line}]`
		)
	})
})
