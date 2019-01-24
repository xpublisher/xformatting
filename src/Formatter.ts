/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Document, Node, parseXmlString } from 'libxmljs';
import { FormatResult } from './FormatResult';
import { ContentProcessor } from './processor/ContentProcessor';
import { ElementProcessor } from './processor/ElementProcessor';
import { ProcessorResolver } from './processor/ProcessorResolver';
import { TextProcessor } from './processor/TextProcessor';
import { FormatterOptions } from './types';

/**
 * Formats XML into a better readable format by inserting linebreaks and indents.
 *
 * @export
 * @class Formatter
 * @author kpalatzky
 * @since 1.0
 */
export class Formatter {

	/**
	 * Options to control the result of this formatter
	 *
	 * @protected
	 * @type {FormatterOptions}
	 * @memberof Formatter
	 * @since 1.0
	 */
	protected options: FormatterOptions;

	/**
	 * Resolver to resolve the required processors
	 *
	 * @protected
	 * @type {ProcessorResolver}
	 * @memberof Formatter
	 * @since 1.0
	 */
	protected processorResolver: ProcessorResolver;

	/**
	 * Creates an instance of Formatter.
	 *
	 * @param {FormatterOptions} [options]
	 * Options to control the result of this formatter
	 * @memberof Formatter
	 */
	constructor(options?: FormatterOptions) {
		this.options = options || {};

		// add all resolver
		const processorResolver = new ProcessorResolver();
		processorResolver.add('element', new ElementProcessor(processorResolver, this.options));

		const textProcessor = new TextProcessor();
		processorResolver.add('text', textProcessor);
		processorResolver.add('cdata', textProcessor);

		// for the most known types just copy the content
		const contentProcessor = new ContentProcessor();
		processorResolver.add('dtd', contentProcessor);
		processorResolver.add('comment', contentProcessor);
		processorResolver.add('pi', contentProcessor);

		// copy content on unknown types
		processorResolver.setFallback(contentProcessor);
		this.processorResolver = processorResolver;
	}

	/**
	 * Formats the passed XML into a better readable format by inserting linebreaks and indents.
	 *
	 * @param {string} xml
	 * XML to be formatted
	 * @returns {string}
	 * Formatted xml
	 * @memberof Formatter
	 * @since 1.0
	 */
	public formatSync(xml: string): string {
		// @ts-ignore
		const parseResult = parseXmlString(xml);
		return this.formatDocument(parseResult).getContent();
	}

	/**
	 * Formats the passed XML into a better readable format by inserting linebreaks and indents.
	 * This function is just a wrapper for formatSync.
	 *
	 * @param {string} xml
	 * XML to be formatted
	 * @returns {Promise<string>}
	 * Formatted xml
	 * @memberof Formatter
	 * @since 1.0
	 */
	public async format(xml: string): Promise<string> {
		// make the sync fn async
		return new Promise<string>((resolve, reject) => {
			try {
				const result = this.formatSync(xml);
				resolve(result);
			} catch (e) {
				reject(e);
			}
		});
	}

	/**
	 * Formats the given document.
	 *
	 * @protected
	 * @param {libxmljs.Document} doc
	 * Document to be formatted
	 * @returns {FormatResult}
	 * Formatted xml document
	 * @memberof Formatter
	 * @since 1.0
	 */
	protected formatDocument(doc: Document): FormatResult {
		const formatResult = new FormatResult();

		// add xml declaration
		const version = doc.version() || '1.0';
		formatResult.append('<?xml version="' + version + '"');
		const encoding = doc.encoding();
		if (encoding) {
			formatResult.append(' encoding="' + encoding + '"');
		}
		formatResult.append('?>');

		// find first node, this is required for doctype
		let firstChild: Node = doc.root();
		let currentElement: Node = firstChild;
		while (currentElement = currentElement.prevSibling()) {
			firstChild = currentElement;
		}

		// go trough all nodes
		currentElement = firstChild;
		do {
			this.processorResolver.process(currentElement, formatResult, false);
		} while (currentElement = currentElement.nextSibling());

		return formatResult;
	}
}
