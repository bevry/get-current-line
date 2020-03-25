import { equal } from 'assert-helpers'
import kava from 'kava'
import getCurrentLine from './index.js'

function wrapper() {
	return getCurrentLine()
}

function wrapmethod() {
	return getCurrentLine({ method: 'wrapmethod' })
}

function wrapline() {
	return getCurrentLine({ line: 2 })
}

kava.suite('get-current-line', function (suite, test) {
	test('success', function named() {
		const { line, method, file } = getCurrentLine()
		equal(file.includes('test'), true, 'file includes test')
		equal(method.includes('named'), true, 'method includes name')
		const secondLine = getCurrentLine().line
		equal(line < secondLine, true, 'second line was laster than the first line')
	})
	test('wrapper', function named() {
		const a = wrapper()
		const b = wrapper()
		equal(a.file.includes('test'), true, 'file includes test')
		equal(a.method.includes('wrapper'), true, 'method includes wrapper')
		equal(
			a.line,
			b.line,
			'both lines were the same due to the lack of offset in the wrapper'
		)
	})
	test('wrapmethod', function named() {
		const { line, method, file } = wrapmethod()
		equal(file.includes('test'), true, 'file includes test')
		equal(method.includes('named'), true, 'method includes name')
		const secondLine = wrapmethod().line
		equal(line < secondLine, true, 'second line was laster than the first line')
	})
	test('wrapline', function named() {
		const { line, method, file } = wrapline()
		equal(file.includes('test'), true, 'file includes test')
		equal(method.includes('named'), true, 'method includes name')
		const secondLine = wrapline().line
		equal(line < secondLine, true, 'second line was laster than the first line')
	})
})
