/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Formatter, FormatterOptions } from './Formatter';

/**
 * Formats the passed XML into a better readable format by inserting linebreaks and indents.
 *
 * @export
 * @param {string} xml
 * Xml to format
 * @param {FormatterOptions} [options]
 * Options to handle the output of the formatter
 * @returns {string} Formatted XML string
 */
export function format(xml: string, options?: FormatterOptions): string {
	const formatter = new Formatter({
		debug: true
	});

	return formatter.format(xml);
}

export { Formatter } from './Formatter';
