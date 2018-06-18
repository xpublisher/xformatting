/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Node } from 'libxmljs';
import { FormatResult } from '../FormatResult';
import { Processor } from './Processor';

export class ProcessorResolver implements Processor {

	protected processors: Map<string, Processor>;

	protected fallback: Processor;

	constructor() {
		this.processors = new Map<string, Processor>();
	}

	public add(key: string, processor: Processor): void {
		this.processors.set(key, processor);
	}

	public resolve(key: string): Processor {
		return this.processors.get(key);
	}

	public process(node: Node, result: FormatResult, preserveSpace: boolean): void {
		const type = node.type();
		let processor = this.processors.get(type);
		if (!processor) {
			processor = this.fallback;
		}
		processor.process(node, result, preserveSpace);
	}

	public setFallback(processor: Processor): void {
		this.fallback = processor;
	}
}
