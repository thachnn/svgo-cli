'use strict';

const { BannerPlugin, CopyPlugin, TerserPlugin, ReplaceCodePlugin } = require('webpack');
const pkg = require('./package.json');

const [nodeVersion] = /\d[\d.]*/.exec(pkg.engines.node);

module.exports = {
  mode: 'production',
  entry: {
    // jsAPI: { import: './node_modules/svgo/lib/svgo/jsAPI', library: { type: 'commonjs2' } },
    config: { import: './node_modules/svgo/lib/svgo/config', library: { type: 'commonjs2' } },
    'vendor/css-select': { import: './node_modules/css-select/index', library: { type: 'commonjs2' } },
    'vendor/css-tree': { import: './node_modules/css-tree/lib/index', library: { type: 'commonjs2' } },
    'vendor/csso': { import: './node_modules/csso/lib/index', library: { type: 'commonjs2' } },
    'vendor/coa': { import: './node_modules/coa/lib/index', library: { type: 'commonjs2' } },
    'vendor/chalk': { import: './node_modules/chalk/index', library: { type: 'commonjs2' } },
    'vendor/js-yaml': { import: './node_modules/js-yaml/lib/js-yaml/loader', library: { type: 'commonjs2' } },
    // 'css-tools': { import: './node_modules/svgo/lib/css-tools', library: { type: 'commonjs2' } },
    index: { import: './node_modules/svgo/lib/svgo.js', library: { type: 'commonjs2' } },
    cli: { import: './node_modules/svgo/bin/svgo' },
  },
  // output: { path: __dirname },
  context: __dirname,
  target: `node${nodeVersion}`,
  node: { __filename: false, __dirname: false },
  externals: {
    // './svgo/jsAPI.js': 'commonjs2 ./jsAPI',
    // './jsAPI.js': 'commonjs2 ./jsAPI',
    // '../lib/svgo/jsAPI': 'commonjs2 ./jsAPI',
    './svgo/config.js': 'commonjs2 ./config',
    '../lib/svgo.js': 'commonjs2 ./index',
    'css-select': 'commonjs2 ./vendor/css-select',
    'css-tree': 'commonjs2 ./vendor/css-tree',
    csso: 'commonjs2 ./vendor/csso',
    coa: 'commonjs2 ./vendor/coa',
    chalk: 'commonjs2 ./vendor/chalk',
    'js-yaml': 'commonjs2 ./vendor/js-yaml',
    // '../css-tools': 'commonjs2 ./css-tools',
    // '../lib/css-tools': 'commonjs2 ./css-tools',
    '../svgo.js': 'commonjs2 ./index',
    originalRequire: 'commonjs2 ./originalRequire',
  },
  cache: { type: 'filesystem' },
  stats: { modulesSpace: Infinity, nestedModules: true, nestedModulesSpace: Infinity },
  module: {
    rules: [
      {
        test: /node_modules.svgo.package\.json$/i,
        loader: 'string-replace-loader',
        options: { search: /"keywords":[\s\S]*/, replace: `"engines": { "node": "${pkg.engines.node}" }\n}` },
      },
      {
        test: /node_modules.svgo.plugins.removeViewBox\.js$/i,
        loader: 'string-replace-loader',
        options: { search: /\b(exports\.active *= *)true\b/, replace: '$1false' },
      },
      {
        test: /node_modules.svgo.plugins.convertPathData\.js$/i,
        loader: 'string-replace-loader',
        options: { search: /\b(curveSmoothShorthands|noSpaceAfterFlags): *true\b/g, replace: '$1: false' },
      },
      {
        test: /node_modules.(svgo.lib.svgo.config|coa.lib.cmd)\.js$/i,
        loader: 'string-replace-loader',
        options: { search: / require(\(\w+)/, replace: ' require("originalRequire")$1' },
      },
      {
        test: /node_modules.coa.lib.index\.js$/i,
        loader: 'string-replace-loader',
        options: { search: / require$/m, replace: ' require: require("originalRequire")' },
      },
      {
        test: /node_modules.svgo.lib.svgo.config\.js$/i,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            { search: /^var (FS|yaml) = require\b/gm, replace: '// $&' },
            { search: /=.*\byaml\..*\bFS\..*'\/?(\.\.\/\.\.\/\.svgo\.yml)'.*/m, replace: "= require('$1');" },
          ],
        },
      },
      {
        test: /node_modules.svgo.\.svgo\.yml$/i,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            { search: /^( *)#/gm, replace: '$1//' },
            { search: /^plugins:/m, replace: 'module.exports = {\n$& [' },
            { search: /^  - (\w+)\n\n/m, replace: '$&],\n};\n' },
            { search: /^  - (\w+)/gm, replace: '  "$1",' },
          ],
        },
      },
      {
        test: /node_modules.csso.lib.clean.[ARW]\w*\.js$/i,
        loader: 'string-replace-loader',
        options: { search: /\{ *(\w+) *\}( *= *require\(['"][^'"]*['"]\))/g, replace: '$1$2.$1' },
      },
      // optimize output
      {
        test: /node_modules.ansi-styles.index\.js$/i,
        loader: 'string-replace-loader',
        options: {
          search: /^Object\.defineProperty\(module, 'exports', \{[^{}]*\}\);/m,
          replace: 'module.exports = assembleStyles();',
        },
      },
      {
        test: /node_modules.js-yaml.lib.js-yaml.loader\.js$/i,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            { search: /^module\.exports\.(safeLoad|load)All *= *\w*;/gm, replace: '// $&' },
            { search: /^var DEFAULT_FULL_SCHEMA = require\b/m, replace: '// $&' },
            { search: '|| DEFAULT_FULL_SCHEMA;', replace: '|| DEFAULT_SAFE_SCHEMA;' },
          ],
        },
      },
      {
        test: /node_modules.dom-serializer.index\.js$/i,
        loader: 'string-replace-loader',
        options: { search: " require('entities')", replace: " require('entities/lib/encode')" },
      },
      {
        test: /node_modules.entities.lib.encode\.js$/i,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            { search: /^exports\.(?!XML)\w* *= *\w+/gm, replace: '// $&' },
            { search: /^exports\.XML *= */m, replace: 'exports.encodeXML = ' },
            { search: /^var (inverseHTML|re_xmlChars) *= *[^;]*;/gm, replace: '/* $& */' },
          ],
        },
      },
      {
        test: /node_modules.sax.lib.sax\.js$/i,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            { search: /^ *sax\.(SAXStream|createStream) *= *\1/gm, replace: '// $&' },
            { search: /^ *sax\.EVENTS *= *\[[^\[\]]*\];?/m, replace: '/* $& */' },
            { search: /^( *var Stream;?\n[\s\S]*)(\n *var CDATA *=)/m, replace: '/*\n$1\n*/$2' },
          ],
        },
      },
      {
        test: /node_modules.svgo.lib.svgo.css-class-list\.js$/i,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            {
              search: /^(\w+ *)+= *require\('object\.values'\);?\nif *\(!Object\.values\) *\{[^{}]*\}/m,
              replace: '/* $& */',
            },
            { search: /\bObject\.values(\(arguments\))/g, replace: 'Array.prototype.slice.call$1' },
          ],
        },
      },
      {
        test: /node_modules.svgo.lib.svgo.coa\.js$/i,
        loader: 'string-replace-loader',
        options: { search: / require\('util\.promisify'\)/, replace: " require('util').promisify ||$&" },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'node_modules/svgo/LICENSE*', to: '../[name][ext]' }],
    }),
    new BannerPlugin({
      banner: '#!/usr/bin/env node\nrequire("v8-compile-cache");',
      raw: true,
      test: /\bcli\.js$/,
    }),
    new ReplaceCodePlugin([
      { search: ' require("./originalRequire")', replace: ' require', test: /\b(coa|config)\.js$/ },
      { search: ' require("./vendor/', replace: ' require("./', test: /\bvendor.[\w-]*\.js$/ },
    ]),
  ],
  optimization: {
    nodeEnv: false,
    // minimize: false,
    minimizer: [
      new TerserPlugin({
        // parallel: true,
        terserOptions: { mangle: false, output: { beautify: true, indent_level: 2, comments: false } },
        extractComments: false,
      }),
    ],
  },
};
