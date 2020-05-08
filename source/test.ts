import { equal } from 'assert-helpers'
import kava from 'kava'
import getCurrentLine, { LineOffset } from './index.js'

function wrapper(opts?: LineOffset) {
	return getCurrentLine(opts)
}

function wrapmethod() {
	return wrapper({ method: 'wrapmethod' })
}

function wrapline() {
	return wrapper({ method: 'wrapline' })
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
	test('wrapmethod', function named() {
		const { line, method, file } = wrapmethod()
		equal(file.includes('test'), true, `file [${file}] includes test`)
		equal(method.includes('named'), true, `method [${method}] includes name`)
		const secondLine = wrapmethod().line
		equal(
			line < secondLine,
			true,
			`second line [${secondLine}] was later than the first line [${line}]`
		)
	})
	test('wrapline', function named() {
		const { line, method, file } = wrapline()
		equal(file.includes('test'), true, `file [${file}] includes test`)
		equal(method.includes('named'), true, `method [${method}] includes name`)
		const secondLine = wrapline().line
		equal(
			line < secondLine,
			true,
			`second line [${secondLine}] was later than the first line [${line}]`
		)
	})
})
