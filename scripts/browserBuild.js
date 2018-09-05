/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const path = require('path');
const rollup = require('rollup').rollup;
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const rollupBuiltins = require('rollup-plugin-node-builtins');
const rollupGlobals = require('rollup-plugin-node-globals');
const rollupJson = require('rollup-plugin-json');
const rollupBabel = require('rollup-plugin-babel');
const rollupFlow = require('rollup-plugin-flow');

const babelEs5Options = Object.assign(
  {},
  {
    babelrc: false,
    exclude: 'node_modules/!(ansi-styles|chalk|ansi-regex|slash)/**',
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          shippedProposals: true,
          targets: 'IE 10',
          useBuiltIns: 'usage',
        },
      ],
    ],
    runtimeHelpers: true,
  }
);

function browserBuild(pkgName, entryPath, destination) {
  return rollup({
    entry: entryPath,
    onwarn: () => {},
    plugins: [
      {
        resolveId(id) {
          return id === 'chalk'
            ? path.resolve(__dirname, '../packages/expect/build/fake_chalk.js')
            : undefined;
        },
      },
      rollupFlow(),
      rollupJson(),
      rollupCommonjs(),
      rollupBabel(babelEs5Options),
      rollupGlobals(),
      rollupBuiltins(),
      rollupResolve(),
    ],
    strict: false,
  }).then(bundle =>
    bundle.write({
      file: destination,
      format: 'umd',
      name: pkgName,
    })
  );
}

module.exports = browserBuild;
