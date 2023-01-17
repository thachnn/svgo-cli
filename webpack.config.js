'use strict';

const { BannerPlugin, CopyPlugin, TerserPlugin, ReplaceCodePlugin } = require('webpack');
const pkg = require('./package.json');

const [nodeVersion] = /\d[\d.]*/.exec(pkg.engines.node);

module.exports = {
  mode: 'production',
  entry: {
    _collections: { import: './node_modules/svgo/plugins/_collections', library: { type: 'commonjs' } },
    plugins: { import: './node_modules/svgo/plugins/plugins', library: { type: 'commonjs' } },
    'vendor/css-select': { import: './node_modules/css-select/lib/index', library: { type: 'commonjs' } },
    'vendor/css-tree': { import: './node_modules/css-tree/lib/index', library: { type: 'commonjs2' } },
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
    originalRequire: 'commonjs2 ./originalRequire',
  },
  cache: { type: 'filesystem' },
  stats: { modulesSpace: Infinity, nestedModules: true, nestedModulesSpace: Infinity },
  module: {
    rules: [
      {
        // transpile ES6-8 into ES5
        test: /\.m?js$/i,
        exclude:
          /node_modules.(@trysound|boolbase|csso?|dom(elementtype|handler|utils)?|entities|mdn|nth|source|stable)\b/i,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [
            ['@babel/preset-env', { targets: { node: nodeVersion }, modules: false }], // esmodules
          ],
        },
      },
      {
        test: /node_modules.svgo.package\.json$/i,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            { search: /"packageManager":\s*"[^"]*",\s*/, replace: '' },
            { search: /"keywords":[\s\S]*/, replace: `"engines": { "node": "${pkg.engines.node}" }\n}` },
          ],
        },
      },
      {
        test: /node_modules.svgo.plugins.preset-default\.js$/i,
        loader: 'string-replace-loader',
        options: { search: /^(const)? *removeViewBox\b/gm, replace: '// $&' },
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
        test: /node_modules.svgo.lib.svgo-node\.js$/i,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            { search: ' import(path', replace: ' import(/* webpackIgnore: true */ path' },
            { search: / require\(config/g, replace: ' require("originalRequire")(config' },
            { search: ' isFile = async (file)', replace: ' isFile = (file)' },
            { search: ' await fs.promises.stat(file)', replace: ' fs.statSync(file)' },
            { search: /\bawait isFile\(/g, replace: 'isFile(' },
          ],
        },
      },
      {
        test: /node_modules.svgo.lib.svgo.coa\.js$/i,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            {
              search: /^const regSVGFile =.*/m,
              replace: `$&
if (typeof fs.promises == 'undefined') {
  const { promisify } = require('util');
  fs.promises = ['readdir', 'readFile', 'writeFile'].reduce((obj, x) => (obj[x] = promisify(fs[x]), obj), {});
}`,
            },
            {
              search: /^ *fs\.mkdirSync\b.*\brecursive\b.*/m,
              replace: " try { $& } catch (e) { if (e.code != 'EEXIST') throw e; }",
            },
          ],
        },
      },
      // optimize output
      {
        test: /node_modules.dom-serializer.lib.index\.js$/i,
        loader: 'string-replace-loader',
        options: { search: ' = require("entities")', replace: ' = require("entities/lib/encode")' },
      },
      {
        test: /node_modules.entities.lib.encode\.js$/i,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            { search: ' = exports.encodeXML = ', replace: ' =\n exports.encodeXML = ' },
            { search: /^exports\.(?!encodeXML)\w* = /gm, replace: '// $&' },
            { search: /^var (entities_json\w*|inverseHTML|htmlReplacer) = /gm, replace: '// $&' },
          ],
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'node_modules/svgo/*/*.ts',
          to: '[name].d[ext]',
          transform: (content) => String(content).replace(/^(export )?(type )/gm, '$1declare $2'),
        },
        { from: 'node_modules/svgo/LICENSE*', to: '../[name][ext]' },
      ],
    }),
    new BannerPlugin({
      banner: '#!/usr/bin/env node\nrequire("v8-compile-cache");',
      raw: true,
      test: /\bcli\.js$/,
    }),
    new ReplaceCodePlugin([
      { search: ' require("./originalRequire")', replace: ' require', test: /\bindex\.js$/ },
      { search: ' require("./vendor/', replace: ' require("./', test: /\bvendor.[\w-]*\.js$/ },
    ]),
  ],
  optimization: {
    nodeEnv: false,
    // minimize: false,
    minimizer: [
      new TerserPlugin({
        // parallel: true,
        terserOptions: { mangle: false, output: { beautify: true, indent_level: 2 } },
        extractComments: false,
      }),
    ],
  },
};
