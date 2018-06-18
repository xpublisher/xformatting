/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Attribute, Element,  Node } from 'libxmljs';
import { FormatResult } from '../FormatResult';
import { Processor } from './Processor';
import { ProcessorResolver } from './ProcessorResolver';

/**
 * Processor to process elements. This processor builds a result for the current element and all its
 * children elements using the passed ProcessResolver
 *
 * @export
 * @class ElementProcessor
 * @implements {Processor}
 * @author kpalatzky
 * @since 1.0
 */
export class ElementProcessor implements Processor {

	/**
	 * Resolver to resolve the required processors
	 *
	 * @protected
	 * @type {ProcessorResolver}
	 * @memberof ElementProcessor
	 * @since 1.0
	 */
	protected resolver: ProcessorResolver;

	/**
	 * Creates an instance of ElementProcessor.
	 *
	 * @param {ProcessorResolver} resolver
	 * @memberof ElementProcessor
	 * @since 1.0
	 */
	constructor(resolver: ProcessorResolver) {
		this.resolver = resolver;
	}

	/**
	 * Processes the passed node
	 *
	 * @param {Node} node
	 * Node to be processed
	 * @param {FormatResult} result
	 * Result in which the result is to be written
	 * @param {boolean} preserveSpace
	 * True to preserve the whitespace, false otherwise
	 * @memberof ElementProcessor
	 * @since 1.0
	 */
	public process(node: Node, result: FormatResult, preserveSpace: boolean): void {
		// only handle elements
		if (!(node instanceof Element)) {
			return;
		}
		const element = node as Element;

		// start tag & attributes
		result.lineBreak();
		result.append('<' + element.name());
		const attributes = this.processAttributes(element, result);

		// may handle children
		const childNodes = element.childNodes();
		if (childNodes.length) {
			// close start tag and indent
			result.append('>');
			result.indent();

			const xmlSpace =  attributes.get('xml:space');
			let nodePreserveSpace = preserveSpace;
			if (xmlSpace) {
				nodePreserveSpace = xmlSpace.value() === 'preserve';
			}

			// handle all children
			for (const childNode of childNodes) {
				this.resolver.process(childNode, result, nodePreserveSpace);
			}

			// outdent and close tag
			result.outdent();
			if (!nodePreserveSpace) {
				result.lineBreak();
			}
			result.append('</' + element.name() + '>');
		} else {
			// no children - close tag
			result.append('/>');
		}
	}

	protected processAttributes(element: Element, result: FormatResult): Map<string, Attribute> {
		const attributeMap = new Map<string, Attribute>();

		// process all attributes
		const attrs = element.attrs();
		for (const attr of attrs) {
			result.append(' ');
			const fullName = this.processAttribute(attr, result);
			attributeMap.set(fullName, attr);
		}

		return attributeMap;
	}

	protected processAttribute(attr: Attribute, result: FormatResult): string {
		const namespace = attr.namespace();
		let name = attr.name();
		if (namespace) {
			name = namespace.prefix() + ':' + name;
		}
		result.append(name + '="' + attr.value() + '"');

		return name;
	}
}
