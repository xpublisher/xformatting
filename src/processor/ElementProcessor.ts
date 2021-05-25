/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Attribute, Element,  Namespace, Node } from 'libxmljs2';
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
		this.options.preserveSpaceFn = this.options.preserveSpaceFn || this.checkPreserveSpaceDefault.bind(this);
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
	public process(node: Node, result: FormatResult, preserveSpace: boolean, lastProcessType?: string): void {
		// only handle elements
		if (!(node instanceof Element)) {
			return;
		}
		const element = node as Element;

		// start tag & attributes
		if (!preserveSpace && lastProcessType !== 'text') {
			result.lineBreak();
		}

		let elementName = element.name();
		const namespace = element.namespace();
		if (namespace && namespace.prefix()) {
			elementName = namespace.prefix() + ':' + elementName;
		}

		result.append('<' + elementName);

		// process namespaces
		this.processNamespaces(element, result);

		// process attributes
		const attributes = this.processAttributes(element, result);

		// may handle children
		const childNodes = element.childNodes();
		if (childNodes.length) {
			// close start tag and indent
			result.append('>');
			result.indent();

			// check preserve white space
			const nodePreserveSpace = this.options.preserveSpaceFn(element, attributes, preserveSpace);

			// handle all children
			let lastNodeType = null;
			for (const childNode of childNodes) {
				lastNodeType = this.resolver.process(childNode, result, nodePreserveSpace, lastNodeType);
			}

			// outdent and close tag
			result.outdent();
			if (!nodePreserveSpace && lastNodeType !== 'text') {
				result.lineBreak();
			}
			result.append('</' + elementName + '>');
		} else {
			// no children - close tag
			result.append('/>');
		}
	}

	/**
	 * Processes the attributes of the passed element for adds the corresponding result to the passed result
	 *
	 * @param {Element} element
	 * Element for which attributes should to be processed.
	 * @param {FormatResult} result
	 * Result in which the result is to be written
	 * @returns {Map<string, Attribute>}
	 * Map of attribute name and attributes. The attribute name consists of namespace and name
	 * @memberof ElementProcessor
	 * @protected
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
	 * @param {Attribute} attr
	 * Attribute to be processed
	 * @param {FormatResult} result
	 * Result in which the result is to be written
	 * @returns {string}
	 * Full name of the attribute consists of namespace and name
	 * @memberof ElementProcessor
	 * @protected
	 * @since 1.0
	 */
	protected processAttribute(attr: Attribute, result: FormatResult): string {
		// build full name
		const namespace = attr.namespace();
		let name = attr.name();
		if (namespace) {
			name = namespace.prefix() + ':' + name;
		}

		// encode xml chars
		const value = attr.value()
						.replace(/\</g, '&lt;')
						.replace(/\>/g, '&gt;')
						.replace(/\&/g, '&amp;')
						.replace(/\"/g, '&quot;')
						.replace(/\'/g, '&apos;');

		// append result
		result.append(name + '="' + value + '"');
		return name;
	}

	/**
	 * Processes the namespaces of the passed element for adds the corresponding result to the passed result
	 *
	 * @param {Element} element
	 * Element for which namespaces should to be processed.
	 * @param {FormatResult} result
	 * Result in which the result is to be written
	 * @memberof ElementProcessor
	 * @protected
	 * @since 1.1
	 */
	protected processNamespaces(element: Element, result: FormatResult): void {
		const namespaces = element.namespaces(true);
		for (const namespace of namespaces) {
			result.append(' ');
			this.processNamespace(namespace, result);
		}
	}

	/**
	 * Processes the passed namespace by adding it to the result.
	 *
	 * @param {Namespace} attr
	 * Attribute to be processed
	 * @param {FormatResult} result
	 * Result in which the result is to be written
	 * @returns {string}
	 * Full name of the attribute consists of namespace and name
	 * @memberof ElementProcessor
	 * @protected
	 * @since 1.1
	 */
	protected processNamespace(ns: Namespace, result: FormatResult): void {
		const prefix = ns.prefix();
		if (prefix) {
			result.append(`xmlns:${prefix}="${ns.href()}"`);
		} else {
			result.append(`xmlns="${ns.href()}"`);
		}
	}

	/**
	 * Checks if perserve whitespace is enabled for the given element
	 *
	 * @param {Element} element
	 * Element to check preserve whitespace
	 * @param {Map<string, Attribute>} attrs
	 * Map of attributes of the element
	 * @param {boolean} preserveSpace
	 * True if currently preserve space is enabled for the element
	 * @returns {boolean}
	 * True if the space of the element should be preserved, false otherwise
	 * @memberof ElementProcessor
	 * @protected
	 * @since 1.0
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
