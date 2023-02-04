'use strict';

const { BannerPlugin, CopyPlugin, TerserPlugin, ReplaceCodePlugin } = require('webpack');
const pkg = require('./package.json');

const [nodeVersion] = /\d[\d.]*/.exec(pkg.engines.node);

module.exports = {
  mode: 'production',
  entry: {
    // jsAPI: './node_modules/svgo/lib/svgo/jsAPI',
    config: './node_modules/svgo/lib/svgo/config',
    'vendor/css-select': './node_modules/css-select/index',
    'vendor/css-tree': './node_modules/css-tree/lib/syntax/index',
    'vendor/csso': './node_modules/csso/lib/index',
    'vendor/coa': './node_modules/coa/lib/index',
    'vendor/chalk': './node_modules/chalk/index',
    'vendor/js-yaml': './node_modules/js-yaml/lib/js-yaml/loader',
    // 'css-tools': './node_modules/svgo/lib/css-tools',
    index: './node_modules/svgo/lib/svgo.js',
    cli: {
      import: './node_modules/svgo/bin/svgo',
      library: { type: 'assign', name: '__webpack_exports__' },
    },
  },
  output: { libraryTarget: 'commonjs2' },
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
  },
  cache: { type: 'filesystem' },
  stats: { modulesSpace: Infinity, nestedModules: true, nestedModulesSpace: Infinity },
  module: {
    rules: [
      {
        test: /node_modules[\\/]svgo.package\.json$/i,
        loader: 'webpack/lib/replace-loader',
        options: { search: /"keywords":[\s\S]*/, replace: `"engines": ${JSON.stringify(pkg.engines)}\n}` },
      },
      // apply patches
      {
        test: /node_modules[\\/]svgo\b.plugins.removeViewBox\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: { search: /^(exports\.active *=) *true\b/m, replace: '$1 false' },
      },
      {
        test: /node_modules[\\/]svgo\b.plugins.convertPathData\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: { search: /^\s*(curveSmoothShorthands|noSpaceAfterFlags): *true\b/gm, replace: '$1: false' },
      },
      {
        test: /node_modules[\\/](svgo\b.lib\b.svgo.config|coa\b.lib.(cmd|index))\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: { search: / require(\(\w+|$)/gm, replace: ' __non_webpack_require__$1' }, // TODO require:
      },
      {
        test: /node_modules[\\/]svgo\b.lib\b.svgo.config\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: { search: /\b(__dirname) *\+ *'[^']*(\.\.\/\.svgo\.yml)'/, replace: "PATH.resolve($1, '$2')" },
      },
      // patches for Node.js
      {
        test: /node_modules[\\/]csso\b.lib\b.clean.[ARW]\w*\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: { search: /\{\s*(\w+)\s*\}( *= *require\(['"][^()]*\))/g, replace: '$1$2.$1' },
      },
      {
        test: /node_modules[\\/]svgo\b.lib\b.svgo.css-class-list\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: {
          multiple: [
            { search: /^.*= *require\('o(bject\.values)'\);?\s*if *\(!O\1\) *\{[^{}]*\}/m, replace: '/*$&*/' },
            { search: /\bObject\.values(\(arguments\))/g, replace: 'Array.prototype.slice.call$1' },
          ],
        },
      },
      {
        test: /node_modules[\\/]svgo\b.lib\b.svgo.coa\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: {
          multiple: [
            { search: /= *(require\('util)(\.promisify)('\))/, replace: '= $1$3$2 || $1$2$3' },
            { search: /= *(promisify\(FS\.(\w+)\))/g, replace: '= FS.promises ? FS.promises.$2 : $1' },
          ],
        },
      },
      // optimize output
      {
        test: /node_modules[\\/]ansi-styles.index\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: {
          search: /^Object\.defineProperty\(module, *'exports', *\{[^{}]*\bget: *(\w+)[^{}]*\}\)/m,
          replace: 'module.exports = $1()',
        },
      },
      {
        test: /node_modules[\\/]js-yaml\b.lib\b.js-yaml.loader\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: {
          search: /^(var DEFAULT_FULL_SCHEMA)( *= *require\('\.\/schema)\/default_full\b/m,
          replace: '$1 = module.exports.FAILSAFE_SCHEMA$2/failsafe',
        },
      },
      {
        test: /node_modules[\\/]entities\b.lib.encode\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: {
          multiple: [
            { search: /^exports\.(?!XML\b)\w+ *=/gm, replace: '//$&' },
            { search: /^exports\.XML *=/m, replace: 'exports.encodeXML = $&' },
            { search: /^var (inverseHTML|re_xmlChars) *=[^;]*;/gm, replace: '/*$&*/' },
          ],
        },
      },
      {
        test: /node_modules[\\/]sax\b.lib.sax\.js$/i, // only SAXParser
        loader: 'webpack/lib/replace-loader',
        options: {
          multiple: [
            { search: /^\s*sax\.(SAXStream|createStream) *=/gm, replace: '//$&' },
            { search: /^\s*var Stream;?\n[\s\S]*(?=\n[ \t]*var CDATA *=)/m, replace: '/*\n$&\n*/' },
            { search: /^\s*sax\.EVENTS *= *\[[^\[\]]*\];?/m, replace: '/*\n$&\n*/' },
          ],
        },
      },
      {
        test: /node_modules[\\/]q\b.q\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: { search: /^(\(function\b.*\{\n)[\s\S]*( if \(typeof exports\b)/m, replace: '$1$2' },
      },
    ],
  },
  resolve: {
    alias: { entities$: __dirname + '/node_modules/entities/lib/encode.js' },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/svgo/{LICENSE*,.svgo.*}', to: '../[name][ext]' },
        { from: 'node_modules/coa/lib/completion.sh', to: 'vendor/' },
      ],
    }),
    new BannerPlugin({
      banner: '#!/usr/bin/env node\nrequire("v8-compile-cache");',
      raw: true,
      test: /\bcli\.js$/,
    }),
    new ReplaceCodePlugin([
      { search: /\b(__webpack_exports__) = \1;?$/m, replace: '', test: /\bcli\.js$/ },
      { search: /( require\("\.\/)vendor\//g, replace: '$1', test: /\bvendor[\\/][\w-]*\.js$/ },
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
