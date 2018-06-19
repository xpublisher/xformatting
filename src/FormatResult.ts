import { FormatResultOptions } from './types';

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Class to store all information in the formatting process
 *
 * @export
 * @class FormatResult
 * @author kpalatzky
 *
 * @since 1.0
 */
export class FormatResult {

	/**
	 * Buffer to store the xml content
	 *
	 * @protected
	 * @type {string}
	 * @memberof FormatResult
	 * @since 1.0
	 */
	protected buffer: string;

	/**
	 * Current level of the formatted xml content
	 *
	 * @protected
	 * @type {number}
	 * @memberof FormatResult
	 * @since 1.0
	 */
	protected level: number;

	/**
	 * Options of this format result
	 *
	 * @protected
	 * @type {FormatResultOptions}
	 * @memberof FormatResult
	 * @since 1.0
	 */
	protected options: FormatResultOptions;

	/**
	 * Creates an instance of FormatResult.
	 *
	 * @param {FormatResultOptions} [options]
	 * Options to controll the handling of this format result
	 * @memberof FormatResult
	 */
	constructor(options?: FormatResultOptions) {
		// init class
		this.buffer = '';
		this.level = 0;
		this.options = options || {};
		this.options.linebreak = this.options.linebreak || '\r\n';
		this.options.indentation = this.options.indentation || '\t';
	}

	/**
	 * Adds the given content to the buffer
	 *
	 * @param {string} content
	 * @memberof FormatResult
	 */
	public append(content: string): void {
		this.buffer += content;
	}

	/**
	 * Adds a new linebreak to the buffer
	 *
	 * @memberof FormatResult
	 * @since 1.0
	 */
	public lineBreak(): void {
		if (this.buffer.length === 0) {
			return;
		}

		// add linebreak
		this.buffer += this.options.linebreak;

		// indent content
		for (let i = 0; i < this.level; i++) {
			this.buffer += this.options.indentation;
		}
	}

	/**
	 * Increases the level of this result
	 *
	 * @memberof FormatResult
	 * @since 1.0
	 */
	public indent(): void {
		this.level++;
	}

	/**
	 * Reduces the level of these results
	 *
	 * @memberof FormatResult
	 * @since 1.0
	 */
	public outdent(): void {
		this.level--;
	}

	/**
	 * Returns the current xml content of this result
	 *
	 * @returns {string}
	 * Content of this format result
	 * @memberof FormatResult
	 * @since 1.0
	 */
	public getContent(): string {
		return this.buffer;
	}
}
