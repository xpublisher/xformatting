/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as libxmljs from 'libxmljs';
import { FormatResult } from './FormatResult';
import { ContentProcessor } from './processor/ContentProcessor';
import { ElementProcessor } from './processor/ElementProcessor';
import { ProcessorResolver } from './processor/ProcessorResolver';

/**
 * Defines the possible options for the formatter
 *
 * @export
 * @interface FormatterOptions
 * @author kpalatzky
 * @since 1.0
 */
export interface FormatterOptions {
	debug?: boolean;
}

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
		this.options = options || {
			debug: false
		};

		// add all resolver
		const processorResolver = new ProcessorResolver();
		processorResolver.add('element', new ElementProcessor(processorResolver));

		// for the most known types just copy the content
		const contentProcessor = new ContentProcessor();
		processorResolver.add('dtd', contentProcessor);
		processorResolver.add('text', contentProcessor);
		processorResolver.add('comment', contentProcessor);
		processorResolver.add('cdata', contentProcessor);
		processorResolver.add('pi', contentProcessor);

		// copy content on unknown types
		processorResolver.setFallback(contentProcessor);
		this.processorResolver = processorResolver;
	}

	/**
	 * Formats the
	 *
	 * @param {string} xml
	 * @returns {Promise<string>}
	 * @memberof Formatter
	 */
	public format(xml: string): string {
		const parseResult = libxmljs.parseXml(xml);
		const result = this.formatDocument(parseResult).getContent();
		return result;
	}

	/**
	 *
	 *
	 * @protected
	 * @param {libxmljs.Document} doc
	 * @returns {FormatResult}
	 * @memberof Formatter
	 */
	protected formatDocument(doc: libxmljs.Document): FormatResult {
		const formatResult = new FormatResult();

		// find first node
		let firstChild: libxmljs.Node = doc.root();
		let currentElement: libxmljs.Node = firstChild;
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
