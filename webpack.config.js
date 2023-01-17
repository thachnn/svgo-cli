'use strict';

const { BannerPlugin, CopyPlugin, TerserPlugin, ReplaceCodePlugin } = require('webpack');
const pkg = require('./package.json');

const [nodeVersion] = /\d[\d.]*/.exec(pkg.engines.node);

module.exports = {
  mode: 'production',
  entry: {
    plugins: { import: './node_modules/svgo/plugins/plugins', library: { type: 'commonjs' } },
    'vendor/css-select': { import: './node_modules/css-select/lib/index', library: { type: 'commonjs' } },
    'vendor/css-tree': { import: './node_modules/css-tree/lib/syntax/index', library: { type: 'commonjs2' } },
    'vendor/csso': { import: './node_modules/csso/lib/index', library: { type: 'commonjs2' } },
    index: { import: './node_modules/svgo/lib/svgo-node', library: { type: 'commonjs' } },
    cli: { import: './node_modules/svgo/bin/svgo' },
  },
  // output: { path: __dirname },
  context: __dirname,
  target: `node${nodeVersion}`,
  node: { __filename: false, __dirname: false },
  externals: {
    '../plugins/_collections.js': 'commonjs ./_collections',
    './_collections.js': 'commonjs ./_collections',
    './_collections': 'commonjs ./_collections',
    '../../plugins/plugins.js': 'commonjs ./plugins',
    'css-select': 'commonjs ./vendor/css-select',
    'css-tree': 'commonjs2 ./vendor/css-tree',
    csso: 'commonjs2 ./vendor/csso',
    '../svgo-node.js': 'commonjs ./index',
  },
  cache: { type: 'filesystem' },
  stats: { modulesSpace: Infinity, nestedModules: true, nestedModulesSpace: Infinity },
  module: {
    rules: [
      {
        // transpile ES6-8 into ES5
        test: /\.m?js$/i,
        exclude: [
          /node_modules[\\/](@trysound|stable|css-tree|mdn|source|csso|boolbase)\b/i,
          /node_modules[\\/](css-(select|what)|nth|dom(handler|utils|elementtype|-serializer)|entities)\b/i,
        ],
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [
            ['@babel/preset-env', { targets: { node: nodeVersion }, modules: false }], // esmodules
          ],
        },
      },
      // apply patches
      {
        test: /node_modules[\\/]svgo\b.plugins.preset-default\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: { search: /^(const +|\s*)removeViewBox\b/gm, replace: '//$&' },
      },
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
        test: /node_modules[\\/]svgo\b.lib.svgo-node\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: {
          multiple: [
            { search: /( import\()(\w+)/g, replace: '$1/* webpackIgnore: true */ $2' },
            { search: / require(\(\w+)/g, replace: ' __non_webpack_require__$1' },
            { search: /^(const isFile *= )async\b([\s\S]*?)\bawait fs\.promises\.stat\b/m, replace: '$1$2fs.statSync' },
            { search: /\bawait (isFile\s*\()/g, replace: '$1' },
          ],
        },
      },
      // patches for Node.js
      {
        test: /node_modules[\\/]svgo\b.lib\b.svgo.coa\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: {
          multiple: [
            {
              search: /^const regSVGFile *=.*/m,
              replace: `$&
if (typeof fs.promises == 'undefined') {
  const { promisify } = require('util');
  fs.promises = ['readdir', 'readFile', 'writeFile'].reduce((obj, x) => (obj[x] = promisify(fs[x]), obj), {});
}`,
            },
            {
              search: /^\s*fs\.mkdirSync\b.*\brecursive:.*/m,
              replace: "try {\n$&\n} catch (e) { if (e.code != 'EEXIST') throw e; }",
            },
          ],
        },
      },
      // optimize output
      {
        test: /node_modules[\\/]svgo.package\.json$/i,
        loader: 'webpack/lib/replace-loader',
        options: {
          multiple: [
            { search: /"packageManager":[\s\S]*?(?="name":)/, replace: '' },
            { search: /"keywords":[\s\S]*/, replace: `"engines": ${JSON.stringify(pkg.engines)}\n}` },
          ],
        },
      },
      {
        test: /node_modules[\\/]entities\b.lib.encode\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: {
          multiple: [
            { search: /^exports\.(?!encodeXML\b)\w+ *=/gm, replace: '//$&' },
            { search: /= *(exports\.encodeXML *=)/, replace: '\n$1' },
            { search: /^var (entities_json\w*|inverseHTML|htmlReplacer) *=/gm, replace: '//$&' },
          ],
        },
      },
      {
        test: /node_modules[\\/]@trysound.sax\b.lib.sax\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: { search: /^\s*sax\.EVENTS *= *\[[^\[\]]*\];?/m, replace: '/*\n$&\n*/' },
      },
      {
        test: /node_modules[\\/]css-what\b.lib.parse\.js$/i,
        loader: 'webpack/lib/replace-loader',
        options: { search: /^exports\.(isTraversal *= *void\b|default *=)/gm, replace: 'exports.parse = $&' },
      },
    ],
  },
  resolve: {
    alias: {
      entities$: __dirname + '/node_modules/entities/lib/encode.js',
      'css-what$': __dirname + '/node_modules/css-what/lib/parse.js',
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/svgo/LICENSE*', to: '../[name][ext]' },
        {
          from: 'node_modules/svgo/lib/*.ts',
          to: '[name].d[ext]',
          transform: (content) => String(content).replace(/^(export )?(type )/gm, '$1declare $2'),
        },
        { from: 'node_modules/svgo/plugins/_collections.js' },
      ],
    }),
    new BannerPlugin({
      banner: '#!/usr/bin/env node\nrequire("v8-compile-cache");',
      raw: true,
      test: /\bcli\.js$/,
    }),
    new ReplaceCodePlugin([
      { search: /( require\("\.\/)vendor\//g, replace: '$1', test: /\bvendor[\\/][\w-]*\.js$/ }, //
    ]),
  ],
  optimization: {
    nodeEnv: false,
    // minimize: false,
    minimizer: [
      new TerserPlugin({
        // parallel: true,
        terserOptions: { mangle: false, output: { beautify: true, indent_level: 2 } }, // comments: false
        extractComments: false,
      }),
    ],
  },
};
