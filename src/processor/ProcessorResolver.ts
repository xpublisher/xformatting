/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Node } from 'libxmljs2';
import { FormatResult } from '../FormatResult';
import { Processor } from './Processor';

/**
 * Resolves
 *
 * @export
 * @class ProcessorResolver
 * @implements {Processor}
 * @author kpalatzky
 * @since 1.0
 */
export class ProcessorResolver implements Processor {

	/**
	 * Map to store the processors with their identifiers
	 *
	 * @protected
	 * @type {Map<string, Processor>}
	 * @memberof ProcessorResolver
	 * @since 1.0
	 */
	protected processors: Map<string, Processor>;

	/**
	 * Fallback processor of this resolver
	 *
	 * @protected
	 * @type {Processor}
	 * @memberof ProcessorResolver
	 * @since 1.0
	 */
	protected fallback: Processor;

	/**
	 * Creates an instance of ProcessorResolver.
	 *
	 * @memberof ProcessorResolver
	 */
	constructor() {
		this.processors = new Map<string, Processor>();
	}

	/**
	 * Adds a new processor to this resolver.
	 *
	 * @param {string} key
	 * Key to identify the processor
	 * @param {Processor} processor
	 * Processor to be added
	 * @memberof ProcessorResolver
	 * @since 1.0
	 */
	public add(key: string, processor: Processor): void {
		this.processors.set(key, processor);
	}

	/**
	 * Returns the processor for the given key.
	 *
	 * @param {string} key
	 * Key to which the processor is to be returned
	 * @returns {Processor}
	 * Processor for the given key or undefined if no processor was found
	 * @memberof ProcessorResolver
	 * @since 1.0
	 */
	public resolve(key: string): Processor {
		return this.processors.get(key);
	}

	/**
	 * Processes the given node by determining which processor is needed. If no suitable processor is found,
	 * the fallback processor is used.
	 *
	 * @param {Node} node
	 * Node to be processed
	 * @param {FormatResult} result
	 * Result in which the result is to be written
	 * @param {boolean} preserveSpace
	 * True to preserve the whitespace, false otherwise
	 * @memberof ProcessorResolver
	 * @since 1.0
	 */
	public process(node: Node, result: FormatResult, preserveSpace: boolean, lastProcessType?: string): string {
		// get processor for type of node
		const type = node.type();
		let processor = this.resolve(type);

		// if no processor was found use the fallback
		if (!processor) {
			processor = this.fallback;
		}

		// call processor if possible
		if (processor) {
			processor.process(node, result, preserveSpace, lastProcessType);
		}

		return type;
	}

	/**
	 * Sets an fallback for this resolver. The given processor will be used if no other processor is useable.
	 *
	 * @param {Processor} processor
	 * Fallback processor
	 * @memberof ProcessorResolver
	 * @since 1.0
	 */
	public setFallback(processor: Processor): void {
		this.fallback = processor;
	}
}
