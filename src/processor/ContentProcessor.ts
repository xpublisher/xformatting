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
 * @class ContentProcessor
 * @implements {Processor}
 * @author kpalatzky
 * @since 1.0
 */
export class ContentProcessor implements Processor {

	/**
	 * Processes the passed node by calling the `toString` method of the given instance.
	 *
	 * @param {Node} node
	 * Node to be processed
	 * @param {FormatResult} result
	 * Result in which the result is to be written
	 * @param {boolean} preserveSpace
	 * True to preserve the whitespace, false otherwise
	 * @memberof ContentProcessor
	 * @since 1.0
	 */
	public process(node: Node, result: FormatResult, preserveSpace: boolean): void {
		// collapse whitespace
		let content = node.toString();
		if (!preserveSpace) {
			content = content.replace(/(^\s+|\s+$)/g, '');

			// add new line if there is content
			if (content.length > 0) {
				result.lineBreak();
			}
		}

		result.append(content);
	}
}
