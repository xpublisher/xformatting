/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Formatter } from './Formatter';
import { FormatterOptions } from './types';

/**
 * Formats the passed XML into a better readable format by inserting linebreaks and indents.
 *
 * @export
 * @param {string} xml
 * Xml to format
 * @param {FormatterOptions} [options]
 * Options to handle the output of the formatter
 * @returns {Promise<string>} Formatted XML string
 */
export async function format(xml: string, options?: FormatterOptions): Promise<string> {
	const formatter = new Formatter(options);
	return formatter.format(xml);
}

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
export function formatSync(xml: string, options?: FormatterOptions): string {
	const formatter = new Formatter(options);
	return formatter.formatSync(xml);
}

export { Formatter } from './Formatter';
