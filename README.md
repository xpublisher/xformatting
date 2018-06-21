<div align="center">
	<h2 style="font-size: 30px">
		&lt;xformatting/&gt;
	</h2>
	<p>
		<a href="https://github.com/xpublisher/xformatting/issues">
			<img src="https://img.shields.io/github/issues/xpublisher/xformatting.svg" alt="Issues"/>
		</a>
		<a href="https://travis-ci.org/xpublisher/xformatting">
			<img src="https://api.travis-ci.org/xpublisher/xformatting.svg" alt="Travis"/>
		</a>
		<a href="https://github.com/xpublisher/xformatting/blob/master/LICENSE" alt="License">
			<img src="https://img.shields.io/github/license/xpublisher/xformatting.svg"/>
		</a>
	</p>
	<hr>
	<p>
		Formats XML into a more readable format by inserting linebreaks and indents. Supports all element types (e.g. processing instructions) and also the xml:space attribute
	</p>
</div>

## Installation

```
$ npm install -S xformatting
```

## Usage

### Synchronous

```js
const { formatSync } = require('xformatting');

const xml = '<xformatting><code xml:space="preserve">var hello = "world"</code></xformatting>';
const formattedXml = formatSync(xml);
console.log(formattedXml);
```

### Asynchronous

```js
const { format } = require('xformatting');

const xml = '<xformatting><code xml:space="preserve">var hello = "world"</code></xformatting>';
format(xml).then((formattedXml) => {
	console.log(formattedXml);
});
```

## Options

You can pass an options object to the methods as a second argument. In this table you will find all setting options:

| Name                   | Type     | Default     | Description
|------------------------|----------|-------------|-------------
| linebreak              | string   | "\r\n"      | New line characters
| indentation            | string   | "\t"        | Characters for indentation
| preserveSpaceAttribute | string   | "xml:space" | Attribute name for preserve space
| preserveSpaceFn        | Function |             | Function to check if preserve space is active

## License

MIT
