# SVG Optimizer CLI

[![Node.js Package](https://github.com/thachnn/svgo-cli/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/thachnn/svgo-cli/actions/workflows/npm-publish.yml)

CLI bundle of [SVGO](https://github.com/svg/svgo), a Node.js-based tool for optimizing SVG vector graphics files.

## Installation

```sh
npm -g install svgo-cli
```

or

```sh
yarn global add svgo-cli
```

## Usage

```sh
svgo one.svg two.svg -o one.min.svg two.min.svg
```

Or use the `--folder`/`-f` flag to optimize a whole folder of SVG icons

```sh
svgo -f ./path/to/folder/with/svg/files -o ./path/to/folder/with/svg/output
```

See help for advanced usage

```sh
svgo --help
```

## Configuration

Some options can be configured with CLI though it may be easier to have the configuration in a separate file.
SVGO automatically loads configuration from `svgo.config.js` or module specified with `--config` flag.

```js
module.exports = {
  multipass: true, // boolean. false by default
  js2svg: {
    indent: 2, // string with spaces or number of spaces. 4 by default
    pretty: true, // boolean, false by default
  },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // customize options for plugins included in preset
          convertPathData: {
            noSpaceAfterFlags: false,
          },
          // or disable plugins
          mergePaths: false,
        },
      },
    },
    // enable and configure builtin plugin not included in preset
    {
      name: 'sortAttrs',
      params: {
        xmlnsOrder: 'alphabetical',
      },
    },
  ],
};
```

For more details see [SVGO README Configuration](https://github.com/svg/svgo/blob/master/README.md#configuration).

## License

This software is released under the terms of the [MIT license](https://github.com/svg/svgo/blob/master/LICENSE).
