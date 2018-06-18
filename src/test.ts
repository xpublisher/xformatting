import * as formatter from './index';

// THIS FILE WILL BE REMOVED LATER

const xml = [
	'<?xml version="1.0" standalone="yes" ?>',
	'<!DOCTYPE author [',
		'<!-- student must have onechild element type id -->',
		'<!ELEMENT author (#PCDATA)>',
		'<!-- student must have onechild element type id -->',
		'<!ENTITY js "Jo Smith">',
	']>',
		'<?test value=31?>',
		'<!-- COMMENT2 -->',
		'<rz:root>',
			'<?test value=3?>',
			'<!-- COMMENT -->',
			'<![CDATA[Charaktere mit Markup]]>',
			'&gt;',
			'<to>',
				'Text',
				'<to>',
				'Text',
			'</to>',
			'<to>',
			'Text',
		'</to>',
		'<to>',
		'Text',
	'</to>',
	'</to>',
	'<codeblock eka:space="peter" xml:space="preserve"><style>for\n(var</style> i \n= 0) {}</codeblock>',
	'</rz:root>',
].join('');
const result = formatter.format(xml);
// tslint:disable-next-line:no-console
console.log(result);
