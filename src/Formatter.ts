/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Attribute, Document, Node, parseXml } from 'libxmljs';
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
	linebreak?: string;
	indentation?: string;
	preserveSpace?(node: Node, attrs: Map<string, Attribute>): boolean;
	preserveSpaceAttribute?: string;
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
		this.options = options || {};
		this.options.debug = this.options.debug || false;
		this.options.linebreak = this.options.linebreak || '\r\n';
		this.options.indentation = this.options.indentation || '\t';
		this.options.preserveSpaceAttribute = this.options.preserveSpaceAttribute || 'xml:space';

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
	 * Formats the passed XML into a better readable format by inserting linebreaks and indents.
	 *
	 * @param {string} xml
	 * XML to be formatted
	 * @returns {string}
	 * Formatted xml
	 * @memberof Formatter
	 * @since 1.0
	 */
	public format(xml: string): string {
		const parseResult = parseXml(xml);
		return this.formatDocument(parseResult).getContent();
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
