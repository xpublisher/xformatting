/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Xpublisher GmbH. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export interface FormatResultOptions {
	linebreak: string;
	indentation: string;
}
/**
 * Class to store all information in the formatting process
 *
 * @export
 * @class FormatResult
 * @author Kevin Palatzky - Xpublisher GmbH
 */
export class FormatResult {

	/**
	 * Buffer to store the xml content
	 *
	 * @protected
	 * @type {string}
	 * @memberof FormatResult
	 */
	protected buffer: string;

	/**
	 * Current level of the formatted xml content
	 *
	 * @protected
	 * @type {number}
	 * @memberof FormatResult
	 */
	protected level: number;

	/**
	 * Options of this format result
	 *
	 * @protected
	 * @type {FormatResultOptions}
	 * @memberof FormatResult
	 */
	protected options: FormatResultOptions;

	constructor(options?: FormatResultOptions) {
		// init class
		this.buffer = '';
		this.level = 0;
		this.options = options || {
			linebreak: '\n\r',
			indentation: '\t'
		};
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
	 */
	public indent(): void {
		this.level++;
	}

	/**
	 * Reduces the level of these results
	 *
	 * @memberof FormatResult
	 */
	public outdent(): void {
		this.level--;
	}

	/**
	 * Returns the current xml content of this result
	 *
	 * @returns {string}
	 * @memberof FormatResult
	 */
	public getContent(): string {
		return this.buffer;
	}
}
