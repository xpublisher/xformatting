/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Attribute, Element,  Node } from 'libxmljs';
import { FormatResult } from '../FormatResult';
import { ElementProcessorOptions } from '../types';
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
	 * Options of this element processor
	 *
	 * @protected
	 * @type {ElementProcessorOptions}
	 * @memberof ElementProcessor
	 * @since 1.0
	 */
	protected options: ElementProcessorOptions;

	/**
	 * Creates an instance of ElementProcessor.
	 *
	 * @param {ProcessorResolver} resolver
	 * @memberof ElementProcessor
	 * @since 1.0
	 */
	constructor(resolver: ProcessorResolver, options?: ElementProcessorOptions) {
		this.options = options || {};
		this.options.preserveSpace = this.options.preserveSpace || this.checkPreserveSpaceDefault.bind(this);
		this.options.preserveSpaceAttribute = this.options.preserveSpaceAttribute || 'xml:space';
		this.resolver = resolver;
	}

	/**
	 * Processes the passed node and executes the appropriate processor for all child elements.
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
		if (!preserveSpace) {
			result.lineBreak();
		}
		result.append('<' + element.name());
		const attributes = this.processAttributes(element, result);

		// may handle children
		const childNodes = element.childNodes();
		if (childNodes.length) {
			// close start tag and indent
			result.append('>');
			result.indent();

			// check preserve white space
			const nodePreserveSpace = this.options.preserveSpace(element, attributes, preserveSpace);

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

	/**
	 * Processes the attribute of the passed element for adds the corresponding result to the passed result
	 *
	 * @protected
	 * @param {Element} element
	 * Element for which attributes should to be processed.
	 * @param {FormatResult} result
	 * Result in which the result is to be written
	 * @returns {Map<string, Attribute>}
	 * Map of attribute name and attributes. The attribute name consists of namespace and name
	 * @memberof ElementProcessor
	 * @since 1.0
	 */
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

	/**
	 * Processes the passed attribute by adding it to the result. In addition,
	 * the complete name of the attribute will returned
	 *
	 * @protected
	 * @param {Attribute} attr
	 * Attribute to be processed
	 * @param {FormatResult} result
	 * Result in which the result is to be written
	 * @returns {string}
	 * Full name of the attribute consists of namespace and name
	 * @memberof ElementProcessor
	 * @since 1.0
	 */
	protected processAttribute(attr: Attribute, result: FormatResult): string {
		// build full name
		const namespace = attr.namespace();
		let name = attr.name();
		if (namespace) {
			name = namespace.prefix() + ':' + name;
		}

		// append result
		result.append(name + '="' + attr.value() + '"');
		return name;
	}

	/**
	 *
	 *
	 * @protected
	 * @param {Element} element
	 * @param {Map<string, Attribute>} attrs
	 * @param {boolean} preserveSpace
	 * @returns {boolean}
	 * @memberof ElementProcessor
	 */
	protected checkPreserveSpaceDefault(element: Element, attrs: Map<string, Attribute>, preserveSpace: boolean): boolean {
		// get xml space attribute
		const xmlSpace =  attrs.get(this.options.preserveSpaceAttribute);
		let nodePreserveSpace = preserveSpace;
		if (xmlSpace) {
			nodePreserveSpace = xmlSpace.value() === 'preserve';
		}
		return nodePreserveSpace;
	}
}
