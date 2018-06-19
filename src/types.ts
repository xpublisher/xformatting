import { Attribute, Element, Node } from 'libxmljs';

export type PreserveSpaceFn = (element: Element, attrs: Map<string, Attribute>, preserveSpace: boolean) => boolean;

/**
 * Defines the possible options for the formatter
 *
 * @export
 * @interface FormatterOptions
 * @extends {FormatResultOptions}
 * @extends {ElementProcessorOptions}
 * @author kpalatzky
 * @since 1.0
 */
export interface FormatterOptions extends FormatResultOptions, ElementProcessorOptions {}

/**
 * Defines the possible options for the element processor
 *
 * @export
 * @interface ElementProcessorOptions
 * @author kpalatzky
 * @since 1.0
 */
export interface ElementProcessorOptions {
	/**
	 * Function to check if the given element should preserve whitespace or not.
	 * By default the `preserveSpaceAttribute` will be checked.
	 *
	 * @type {PreserveSpaceFn}
	 * @memberof ElementProcessorOptions
	 * @since 1.0
	 */
	preserveSpaceFn?: PreserveSpaceFn;

	/**
	 * Attribute name to set the name of the preserve space attribute. Defaults to 'xml:space'.
	 *
	 * @type {string}
	 * @memberof ElementProcessorOptions
	 * @since 1.0
	 */
	preserveSpaceAttribute?: string;
}

/**
 * Options to control the result of an FormatResult
 *
 * @export
 * @interface FormatResultOptions
 * @author kpalatzky
 * @since 1.0
 */
export interface FormatResultOptions {

	/**
	 * Controls which character should be talken on new line. Defaults to '\n\r'.
	 *
	 * @type {string}
	 * @memberof FormatResultOption
	 * @since 1.0
	 */
	linebreak?: string;

	/**
	 * Controls which character should be talken on indention. Defaults to '\t'.
	 *
	 * @type {string}
	 * @memberof FormatResultOption
	 * @since 1.0
	 */
	indentation?: string;
}
