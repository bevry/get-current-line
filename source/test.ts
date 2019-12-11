import { equal } from 'assert-helpers'
import kava from 'kava'
import getCurrentLine from './index.js'

kava.suite('get-current-line', function(suite, test) {
	test('success', function named() {
		const { line, method, file } = getCurrentLine()
		equal(file.includes('test'), true, 'file includes test')
		equal(method.includes('named'), true, 'method includes name')
		const secondLine = getCurrentLine().line
		equal(line < secondLine, true, 'second line was laster than the first line')
	})
})
