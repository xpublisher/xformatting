/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Node } from 'libxmljs2';
import { FormatResult } from '../FormatResult';

/**
 * Describes the processor interface
 *
 * @export
 * @interface Processor
 * @author kpalatzky
 * @since 1.0
 */
export interface Processor {

	/**
	 * Processes the passed node and adds the result to the result.
	 *
	 * @param {Node} node
	 * Node to be processed
	 * @param {FormatResult} result
	 * Result in which the result is to be written
	 * @param {boolean} preserveSpace
	 * True to preserve the whitespace, false otherwise
	 * @memberof Processor
	 * @since 1.0
	 */
	process(node: Node, result: FormatResult, preserveSpace: boolean, lastProcessType?: string): void;
}
