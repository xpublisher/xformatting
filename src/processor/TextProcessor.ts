/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Node } from 'libxmljs';
import { FormatResult } from '../FormatResult';
import { Processor } from './Processor';

/**
 * Processor to process any content. This processor simply calls the toString method of the passed node instance.
 *
 * @export
 * @class TextProcessor
 * @implements {Processor}
 * @author kpalatzky
 * @since 1.2
 */
export class TextProcessor implements Processor {

	/**
	 * Processes the passed node by calling the `toString` method of the given instance.
	 *
	 * @param {Node} node
	 * Node to be processed
	 * @param {FormatResult} result
	 * Result in which the result is to be written
	 * @param {boolean} preserveSpace
	 * True to preserve the whitespace, false otherwise
	 * @memberof TextProcessor
	 * @since 1.2
	 */
	public process(node: Node, result: FormatResult, preserveSpace: boolean): void {
		const content = node.toString();
		result.append(content);
	}
}
