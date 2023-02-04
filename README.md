# SVG Optimizer CLI

[![Node.js Package](https://github.com/thachnn/svgo-cli/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/thachnn/svgo-cli/actions/workflows/npm-publish.yml)

CLI bundle of [SVGO](https://github.com/svg/svgo), a Node.js-based tool for optimizing SVG vector graphics files.

## Installation

```sh
npm -g install svgo-cli@1
```

## Usage

```sh
svgo one.svg two.svg -o one.min.svg -o two.min.svg
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
SVGO automatically loads configuration from YAML/JSON file specified with `--config` flag.

```yaml
multipass: true

plugins:
  # customize options for plugins included in preset
  - convertPathData:
      noSpaceAfterFlags: false
  # or disable plugins
  - mergePaths: false
  # enable and configure builtin plugin not included in preset
  - sortAttrs:
      xmlnsOrder: 'alphabetical'

# configure the indent
js2svg:
  pretty: true
  indent: 2
```

The configuration in JSON format:

```json
{
  "multipass": true,
  "plugins": [
    {
      "convertPathData": {
        "noSpaceAfterFlags": false
      }
    },
    {
      "mergePaths": false
    },
    {
      "sortAttrs": {
        "xmlnsOrder": "alphabetical"
      }
    }
  ],
  "js2svg": {
    "pretty": true,
    "indent": 2
  }
}
```

For more details see [SVGO Default Configuration](https://github.com/svg/svgo/blob/v1.3.2/.svgo.yml).

## License

This software is released under the terms of the [MIT license](https://github.com/svg/svgo/blob/master/LICENSE).
