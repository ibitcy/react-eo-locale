import { ETokenType, tokenStream } from '../token_stream';

describe('TokenStream', () => {
	it('Should return text token', () => {
		const stream = tokenStream('abc');

		expect(stream.next().value).toEqual({
			type: ETokenType.Text,
			value: 'abc',
		});
		expect(stream.next().done).toBeTruthy();
	});

	it('Should return variable token', () => {
		const stream = tokenStream('{a}');

		expect(stream.next().value).toEqual({
			type: ETokenType.Variable,
			value: 'a',
		});
		expect(stream.next().done).toBeTruthy();
	});

	it('Should return tokens', () => {
		const stream = tokenStream('Hello {name}!');

		expect(stream.next().value).toEqual({
			type: ETokenType.Text,
			value: 'Hello ',
		});
		expect(stream.next().value).toEqual({
			type: ETokenType.Variable,
			value: 'name',
		});
		expect(stream.next().value).toEqual({
			type: ETokenType.Text,
			value: '!',
		});
		expect(stream.next().done).toBeTruthy();
	});

	it('Should return plural token', () => {
		const stream = tokenStream('{count, plural, one {One, item} other {{count} ite,ms}}');
		const options = new Map();

		options.set('one', [{
			type: ETokenType.Text,
			value: 'One, item',
		}]);

		options.set('other', [{
			type: ETokenType.Variable,
			value: 'count',
		},{
			type: ETokenType.Text,
			value: ' ite,ms',
		}])

		expect(stream.next().value).toEqual({
			options,
			type: ETokenType.Plural,
			value: 'count',
		});
		expect(stream.next().done).toBeTruthy();
	});

});
