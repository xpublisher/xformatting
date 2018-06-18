/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Node } from 'libxmljs';
import { FormatResult } from '../FormatResult';

export interface Processor {
	process(node: Node, result: FormatResult, preserveSpace: boolean): void;
}
