promise-nodeify
===============

[![Build Status: Linux](https://img.shields.io/travis/kevinoid/promise-nodeify/master.svg?style=flat&label=build+on+linux)](https://travis-ci.org/kevinoid/promise-nodeify)
[![Build Status: Windows](https://img.shields.io/appveyor/ci/kevinoid/promise-nodeify/master.svg?style=flat&label=build+on+windows)](https://ci.appveyor.com/project/kevinoid/promise-nodeify)
[![Coverage](https://img.shields.io/codecov/c/github/kevinoid/promise-nodeify.svg?style=flat)](https://codecov.io/github/kevinoid/promise-nodeify?branch=master)
[![Dependency Status](https://img.shields.io/david/kevinoid/promise-nodeify.svg?style=flat)](https://david-dm.org/kevinoid/promise-nodeify)
[![Supported Node Version](https://img.shields.io/node/v/promise-nodeify.svg?style=flat)](https://www.npmjs.com/package/promise-nodeify)
[![Version on NPM](https://img.shields.io/npm/v/promise-nodeify.svg?style=flat)](https://www.npmjs.com/package/promise-nodeify)

Call a Node-style callback with the resolution value or rejection cause of a
Promise without the common pitfalls.

## Introductory Example

```js
var promiseNodeify = require('promise-nodeify');

// Function which returns a Promise
function returnsPromise() {
  return new Promise(function(resolve, reject) {
    resolve(42);
  });
}

// Function which takes an optional node-style callback
function takesCallback(callback) {
  var promise = returnsPromise();
  // if callback is not a function, promise is returned as-is
  // otherwise callback will be called when promise is resolved or rejected
  // promise will not cause unhandledRejection if callback is a function
  return promiseNodeify(promise, callback);
}
```

## Features

The important features of `nodeify` as compared to naive implementations:

* Creates `Error` for falsey rejection causes.  Since Promises may resolve or
  reject without providing a value or cause, the callback would have no way to
  distinguish success from failure.  This module ensures the error argument is
  always truthy, substituting an `Error` when the rejection cause is falsey
  (and passing the original value as the `.cause` property, as bluebird does).
* Exceptions thrown by callback cause `uncaughtException` as they would for
  other callbacks (unlike passing callback to `.then`, which causes
  `unhandledRejection` or swallows them).
* The callback handles the promise rejection, preventing `unhandledRejection`
  (unlike if the promise were ignored and callback invoked directly).
* Reduces confusion by only returning a Promise when no callback is given
  (as opposed to returning the promise argument, which creates uncertainty
  about `unhandledRejection`s and multiple threads of control - or returning
  the result passing the callback to `.then`, which resolves to the callback
  result).

## Behavior Comparison

This module provides similar behavior to several popular promise libraries in
a promise-library-agnostic way which only requires the ES6 promise
functionality subset.  However, these existing implementations differ in
subtle ways.  A brief comparison:

Behavior                  | this module           | [bluebird `#asCallback`][bb-ascallback]      | [es-nodeify][es-nodeify]              | [nodeify][nodeify]                    | [then `#nodeify`][then-nodeify] | [Un-thenify][unthenify]<sup>[1](#note-1)</sup> | [when.js `.bindCallback`][when-bindcallback]
--------------------------|-----------------------|----------------------------------------------|---------------------------------------|---------------------------------------|---------------------------------|------------------------------------------------|---------------------------------------------
returns (with `function`) | `undefined`           | `this` `Promise`<sup>[2](#note-2)</sup>      | `undefined`                           | `Promise<undefined>`                  | `undefined`                     | `undefined`                                    | `when(promise)`
returns (with falsey)     | `promise`             | `promise`                                    | `promise`                             | `Promise<undefined>`                  | `promise`                       | `undefined` with `unhandledRejection`          | `when(promise)`
returns (non-function)    | `promise`             | `promise`                                    | `undefined` with `unhandledRejection` | `promise`                             | `promise`                       | `undefined` with `unhandledRejection`          | `when(promise)` with `uncaughtException`
callback exception        | `uncaughtException`   | `uncaughtException`                          | `unhandledRejection`                  | `uncaughtException`                   | `uncaughtException`             | `unhandledRejection`                           | `uncaughtException`
falsey cause              | `Error` with `.cause` | `Error` with `.cause`<sup>[3](#note-3)</sup> | `Error`                               | falsey cause                          | falsey cause                    | `TypeError`                                    | falsey cause
reject argument length    | 1                     | 1                                            | 1                                     | 1                                     | 1                               | 1                                              | 2
resolve argument length   | 2                     | `undefined` ? 1 : 2<sup>[4](#note-4)</sup>   | 2                                     | 2                                     | 2                               | 2                                              | 2
extra argument            | ignored               | options<sup>[5](#note-5)</sup>               | ignored                               | ignored                               | `this` of callback              | ignored                                        | ignored

Notes:

1. <a id="note-1" name="note-2" /> Un-thenify serves a similar purpose, but
   wraps the Promise-returning function rather than taking the Promise as an
   argument.
2. <a id="note-2" name="note-3" /> Temporarily reverted in
   https://github.com/petkaantonov/bluebird/issues/151 and restored in
   https://github.com/petkaantonov/bluebird/issues/168
3. <a id="note-3" name="note-4" /> In response to
   https://github.com/petkaantonov/bluebird/issues/434
4. <a id="note-4" name="note-5" /> In response to
   https://github.com/petkaantonov/bluebird/issues/170
5. <a id="note-5" name="note-6" /> Supports the `spread` boolean option to
   pass `Array` values as separate arguments to `callback`.

## Performance Comparison

These benchmarks were done using the [benchmark/index.js](benchmark/index.js)
script on an `Intel(R) Core(TM) i5-3320M CPU @ 2.60GHz` with Node v4.3.1 on
Linux and the following module versions:

| Module                                           | Version |
|--------------------------------------------------|---------|
| [`benchmark`][npm-benchmark]                     | 2.1.0   |
| [`bluebird`][npm-bluebird]                       | 3.3.3   |
| [`cli-table`][npm-cli-table]                     | 0.3.1   |
| [`es-nodeify`][npm-es-nodeify]                   | 1.0.0   |
| [`microtime`][npm-microtime]                     | 2.0.0   |
| [`native-promise-only`][npm-native-promise-only] | 0.8.1   |
| [`nodeify`][npm-nodeify]                         | 1.0.0   |
| [`pinkie-promise`][npm-pinkie-promise]           | 2.0.0   |
| [`promise`][npm-promise]                         | 7.1.1   |
| [`q`][npm-q]                                     | 1.4.1   |
| [`rsvp`][npm-rsvp]                               | 3.2.1   |
| [`unthenify`][npm-unthenify]                     | 1.0.1   |
| [`when`][npm-when]                               | 3.7.7   |

### Nodeify Resolved Promise

Performance (in operations per second) of calling `nodeify` on a resolved
promise (larger is better):

| ops/sec           | bluebird      | native      | npo         | pinkie      | q          | rsvp          | then          | when          |
|-------------------|--------------:|------------:|------------:|------------:|-----------:|--------------:|--------------:|--------------:|
| bluebird#nodeify  | 1,922,721.987 | TypeError   | TypeError   | TypeError   | TypeError  | TypeError     | TypeError     | TypeError     |
| es-nodeify        | 1,345,702.588 | 506,103.345 | 510,887.217 | 534,013.961 | 68,915.816 | 1,974,250.737 | 2,096,468.119 | 1,756,177.934 |
| nodeify           | 147,481.019   | 251,414.264 | 251,535.145 | 253,880.998 | 58,504.098 | 1,355,812.482 | 1,102,467.756 | 1,160,226.624 |
| promiseNodeify    | 1,586,092.279 | 481,842.79  | 452,529.247 | 455,657.062 | 66,045.273 | 2,108,607.126 | 2,370,823.723 | 1,942,722.539 |
| then#nodeify      | 136,716.987   | 202,670.23  | 225,297.257 | 231,042.286 | 56,384.953 | 764,719.55    | 1,320,158.92  | 739,062.155   |
| unthenify         | 100,638.922   | 79,097.99   | 80,488.25   | 78,298.365  | 40,683.82  | 103,125.162   | 100,618.139   | 101,887.997   |
| when.bindCallback | 823.326       | 856.669     | 842.975     | 834.864     | 748.669    | 847.556       | 850.316       | 839.995       |

<!-- GitHub sanitizes my attempts to make this toggleable.  Hide for now.
    bluebird#nodeify with bluebird x 1,922,722 ops/sec ±1.71% (80 runs sampled)
    bluebird#nodeify with npo: TypeError: this._then is not a function
    bluebird#nodeify with pinkie: TypeError: this._then is not a function
    bluebird#nodeify with q: TypeError: this._then is not a function
    bluebird#nodeify with rsvp: TypeError: this._then is not a function
    bluebird#nodeify with then: TypeError: this._then is not a function
    bluebird#nodeify with when: TypeError: this._then is not a function
    bluebird#nodeify with native: TypeError: this._then is not a function
    es-nodeify with bluebird x 1,345,703 ops/sec ±0.84% (81 runs sampled)
    es-nodeify with npo x 510,887 ops/sec ±1.32% (85 runs sampled)
    es-nodeify with pinkie x 534,014 ops/sec ±0.92% (84 runs sampled)
    es-nodeify with q x 68,916 ops/sec ±2.99% (70 runs sampled)
    es-nodeify with rsvp x 1,974,251 ops/sec ±0.84% (85 runs sampled)
    es-nodeify with then x 2,096,468 ops/sec ±0.77% (84 runs sampled)
    es-nodeify with when x 1,756,178 ops/sec ±3.48% (82 runs sampled)
    es-nodeify with native x 506,103 ops/sec ±1.36% (87 runs sampled)
    nodeify with bluebird x 147,481 ops/sec ±2.80% (71 runs sampled)
    nodeify with npo x 251,535 ops/sec ±2.60% (77 runs sampled)
    nodeify with pinkie x 253,881 ops/sec ±2.53% (67 runs sampled)
    nodeify with q x 58,504 ops/sec ±4.30% (67 runs sampled)
    nodeify with rsvp x 1,355,812 ops/sec ±2.98% (81 runs sampled)
    nodeify with then x 1,102,468 ops/sec ±2.09% (81 runs sampled)
    nodeify with when x 1,160,227 ops/sec ±3.95% (79 runs sampled)
    nodeify with native x 251,414 ops/sec ±3.02% (77 runs sampled)
    promiseNodeify with bluebird x 1,586,092 ops/sec ±1.94% (81 runs sampled)
    promiseNodeify with npo x 452,529 ops/sec ±0.52% (84 runs sampled)
    promiseNodeify with pinkie x 455,657 ops/sec ±0.50% (85 runs sampled)
    promiseNodeify with q x 66,045 ops/sec ±4.14% (71 runs sampled)
    promiseNodeify with rsvp x 2,108,607 ops/sec ±3.66% (81 runs sampled)
    promiseNodeify with then x 2,370,824 ops/sec ±1.08% (82 runs sampled)
    promiseNodeify with when x 1,942,723 ops/sec ±0.79% (86 runs sampled)
    promiseNodeify with native x 481,843 ops/sec ±0.41% (87 runs sampled)
    then#nodeify with bluebird x 136,717 ops/sec ±1.83% (82 runs sampled)
    then#nodeify with npo x 225,297 ops/sec ±2.92% (81 runs sampled)
    then#nodeify with pinkie x 231,042 ops/sec ±2.14% (80 runs sampled)
    then#nodeify with q x 56,385 ops/sec ±3.88% (75 runs sampled)
    then#nodeify with rsvp x 764,720 ops/sec ±3.37% (81 runs sampled)
    then#nodeify with then x 1,320,159 ops/sec ±2.67% (81 runs sampled)
    then#nodeify with when x 739,062 ops/sec ±0.78% (85 runs sampled)
    then#nodeify with native x 202,670 ops/sec ±6.14% (74 runs sampled)
    unthenify with bluebird x 100,639 ops/sec ±2.24% (84 runs sampled)
    unthenify with npo x 80,488 ops/sec ±2.78% (84 runs sampled)
    unthenify with pinkie x 78,298 ops/sec ±3.08% (81 runs sampled)
    unthenify with q x 40,684 ops/sec ±3.94% (73 runs sampled)
    unthenify with rsvp x 103,125 ops/sec ±0.78% (84 runs sampled)
    unthenify with then x 100,618 ops/sec ±3.56% (83 runs sampled)
    unthenify with when x 101,888 ops/sec ±0.46% (82 runs sampled)
    unthenify with native x 79,098 ops/sec ±3.09% (83 runs sampled)
    when.bindCallback with bluebird x 823 ops/sec ±1.21% (76 runs sampled)
    when.bindCallback with npo x 843 ops/sec ±0.96% (75 runs sampled)
    when.bindCallback with pinkie x 835 ops/sec ±0.97% (75 runs sampled)
    when.bindCallback with q x 749 ops/sec ±1.55% (73 runs sampled)
    when.bindCallback with rsvp x 848 ops/sec ±0.94% (77 runs sampled)
    when.bindCallback with then x 850 ops/sec ±0.86% (76 runs sampled)
    when.bindCallback with when x 840 ops/sec ±0.86% (76 runs sampled)
    when.bindCallback with native x 857 ops/sec ±1.41% (38 runs sampled)
-->

### Nodeify Rejected Promise

Performance (in operations per second) of calling `nodeify` on a rejected
promise (larger is better):


| ops/sec           | bluebird      | native      | npo         | pinkie      | q          | rsvp          | then          | when          |
|-------------------|--------------:|------------:|------------:|------------:|-----------:|--------------:|--------------:|--------------:|
| bluebird#nodeify  | 1,889,496.469 | TypeError   | TypeError   | TypeError   | TypeError  | TypeError     | TypeError     | TypeError     |
| es-nodeify        | 1,247,981.228 | 520,349.959 | 455,337.77  | 466,964.692 | 64,703.247 | 2,182,281.005 | 2,062,330.035 | 1,889,184.935 |
| nodeify           | 147,454.87    | 325,956.476 | 326,958.556 | 325,971.637 | 53,878.098 | 1,232,726.201 | 952,338.091   | 926,626.949   |
| promiseNodeify    | 1,170,756.604 | 465,186.326 | 478,343.59  | 489,024.094 | 62,905.801 | 2,097,277.371 | 1,928,682.943 | 1,497,451.328 |
| then#nodeify      | 131,588.987   | 241,627.02  | 246,557.24  | 245,427.553 | 49,655.492 | 684,232.864   | 1,178,175.996 | 634,041.464   |
| unthenify         | 96,359.916    | 82,291.679  | 82,507.055  | 83,324.584  | 38,842.741 | 96,432.332    | 97,113.05     | 99,892.099    |
| when.bindCallback | 822.083       | 837.698     | 848.358     | 851.348     | 789.546    | 854.184       | 844.102       | 851.644       |

<!-- GitHub sanitizes my attempts to make this toggleable.  Hide for now.
    bluebird#nodeify with bluebird x 1,889,496 ops/sec ±1.37% (83 runs sampled)
    bluebird#nodeify with npo: TypeError: this._then is not a function
    bluebird#nodeify with pinkie: TypeError: this._then is not a function
    bluebird#nodeify with q: TypeError: this._then is not a function
    bluebird#nodeify with rsvp: TypeError: this._then is not a function
    bluebird#nodeify with then: TypeError: this._then is not a function
    bluebird#nodeify with when: TypeError: this._then is not a function
    bluebird#nodeify with native: TypeError: this._then is not a function
    es-nodeify with bluebird x 1,247,981 ops/sec ±1.41% (78 runs sampled)
    es-nodeify with npo x 455,338 ops/sec ±3.80% (85 runs sampled)
    es-nodeify with pinkie x 466,965 ops/sec ±2.77% (81 runs sampled)
    es-nodeify with q x 64,703 ops/sec ±3.54% (73 runs sampled)
    es-nodeify with rsvp x 2,182,281 ops/sec ±2.07% (83 runs sampled)
    es-nodeify with then x 2,062,330 ops/sec ±0.67% (83 runs sampled)
    es-nodeify with when x 1,889,185 ops/sec ±0.62% (85 runs sampled)
    es-nodeify with native x 520,350 ops/sec ±0.39% (86 runs sampled)
    nodeify with bluebird x 147,455 ops/sec ±2.51% (74 runs sampled)
    nodeify with npo x 326,959 ops/sec ±2.44% (81 runs sampled)
    nodeify with pinkie x 325,972 ops/sec ±2.19% (82 runs sampled)
    nodeify with q x 53,878 ops/sec ±4.86% (66 runs sampled)
    nodeify with rsvp x 1,232,726 ops/sec ±4.10% (81 runs sampled)
    nodeify with then x 952,338 ops/sec ±0.98% (83 runs sampled)
    nodeify with when x 926,627 ops/sec ±5.41% (69 runs sampled)
    nodeify with native x 325,956 ops/sec ±3.21% (77 runs sampled)
    promiseNodeify with bluebird x 1,170,757 ops/sec ±2.39% (84 runs sampled)
    promiseNodeify with npo x 478,344 ops/sec ±1.87% (84 runs sampled)
    promiseNodeify with pinkie x 489,024 ops/sec ±0.47% (86 runs sampled)
    promiseNodeify with q x 62,906 ops/sec ±4.73% (69 runs sampled)
    promiseNodeify with rsvp x 2,097,277 ops/sec ±2.18% (84 runs sampled)
    promiseNodeify with then x 1,928,683 ops/sec ±0.99% (85 runs sampled)
    promiseNodeify with when x 1,497,451 ops/sec ±0.47% (83 runs sampled)
    promiseNodeify with native x 465,186 ops/sec ±3.41% (85 runs sampled)
    then#nodeify with bluebird x 131,589 ops/sec ±2.36% (81 runs sampled)
    then#nodeify with npo x 246,557 ops/sec ±1.59% (88 runs sampled)
    then#nodeify with pinkie x 245,428 ops/sec ±2.68% (82 runs sampled)
    then#nodeify with q x 49,655 ops/sec ±4.59% (70 runs sampled)
    then#nodeify with rsvp x 684,233 ops/sec ±0.56% (86 runs sampled)
    then#nodeify with then x 1,178,176 ops/sec ±0.77% (83 runs sampled)
    then#nodeify with when x 634,041 ops/sec ±2.52% (83 runs sampled)
    then#nodeify with native x 241,627 ops/sec ±2.28% (86 runs sampled)
    unthenify with bluebird x 96,360 ops/sec ±0.54% (85 runs sampled)
    unthenify with npo x 82,507 ops/sec ±1.38% (85 runs sampled)
    unthenify with pinkie x 83,325 ops/sec ±0.33% (85 runs sampled)
    unthenify with q x 38,843 ops/sec ±3.26% (75 runs sampled)
    unthenify with rsvp x 96,432 ops/sec ±4.63% (80 runs sampled)
    unthenify with then x 97,113 ops/sec ±2.47% (83 runs sampled)
    unthenify with when x 99,892 ops/sec ±0.48% (85 runs sampled)
    unthenify with native x 82,292 ops/sec ±0.39% (85 runs sampled)
    when with bluebird x 822 ops/sec ±1.11% (78 runs sampled)
    when with npo x 848 ops/sec ±0.90% (77 runs sampled)
    when with pinkie x 851 ops/sec ±0.99% (74 runs sampled)
    when with q x 790 ops/sec ±1.72% (73 runs sampled)
    when with rsvp x 854 ops/sec ±0.98% (75 runs sampled)
    when with then x 844 ops/sec ±0.94% (74 runs sampled)
    when with when x 852 ops/sec ±0.93% (75 runs sampled)
    when with native x 838 ops/sec ±0.94% (76 runs sampled)
-->

## Installation

### NPM

[This package](https://www.npmjs.com/package/promise-nodeify) can be installed
using [npm](https://www.npmjs.com/) by running:

```sh
npm install promise-nodeify
```

### Browser

This package can be installed using [bower](http://bower.io/) by running:

```sh
bower install promise-nodeify
```

### Without Package Manager

This module is also available with a [UMD](https://github.com/umdjs/umd)
loader, both minified and un-minified, in the [`dist` directory](dist).  They
can be downloaded, self-hosted, or loaded from a CDN.  To use the [RawGit
CDN](https://rawgit.com/), use the following (X)HTML:

```html
<script src="https://cdn.rawgit.com/kevinoid/promise-nodeify/v0.1.0/dist/promise-nodeify.min.js"></script>
```

## Recipes

### Delegate to `Promise.prototype.nodeify`

If the behavior differences discussed in the [Behavior
Comparison](#behavior-comparison) section (and any future differences which
may occur) are not significant to your use case and you are interested in
taking advantage of the potential [performance
benefit](#performance-comparison) of the implementation provided by the
promise library, use the `.delegated` function:

```js
// Using .delegated delegates to .nodeify on the promise argument when present
var promiseNodeify = require('promise-nodeify').delegated;

function returnsPromise() {
  return new Promise(function(resolve, reject) {
    resolve(42);
  });
}

function takesCallback(callback) {
  var promise = returnsPromise();
  return promiseNodeify(promise, callback);
}
```

### Polyfill `Promise.prototype.nodeify`

To polyfill the `.nodeify` (or `.asCallback`) method for a Promise library,
assign the `.nodeifyThis` function to `Promise.prototype.nodeify` as follows:

```js
Promise.prototype.nodeify = require('promise-nodeify').nodeifyThis;

function returnsPromise() {
  return new Promise(function(resolve, reject) {
    resolve(42);
  });
}

function takesCallback(callback) {
  var promise = returnsPromise();
  return promise.nodeify(callback);
}
```

More examples can be found in the [test
specifications](https://kevinoid.github.io/promise-nodeify/spec).

## API Docs

For a description of the available functions and their arguments, see the [API
Documentation](https://kevinoid.github.io/promise-nodeify/api).

## Contributing

Contributions are welcome and very much appreciated!  Please add tests to
cover any changes and ensure `npm test` passes.

The `dist` files are only updated for releases, so please don't include them
in pull requests.

If the desired change is large, complex, backwards-incompatible, can have
significantly differing implementations, or may not be in scope for this
project, opening an issue before writing the code can avoid frustration and
save a lot of time and effort.

## License

This package is available under the terms of the
[MIT License](https://opensource.org/licenses/MIT).

[bb-ascallback]: http://bluebirdjs.com/docs/api/ascallback.html
[es-nodeify]: https://github.com/robbertkl/es-nodeify
[nodeify]: https://github.com/then/nodeify
[npm-benchmark]: https://www.npmjs.com/package/benchmark
[npm-bluebird]: https://www.npmjs.com/package/bluebird
[npm-cli-table]: https://www.npmjs.com/package/cli-table
[npm-es-nodeify]: https://www.npmjs.com/package/es-nodeify
[npm-microtime]: https://www.npmjs.com/package/microtime
[npm-native-promise-only]: https://www.npmjs.com/package/native-promise-only
[npm-nodeify]: https://www.npmjs.com/package/nodeify
[npm-pinkie-promise]: https://www.npmjs.com/package/pinkie-promise
[npm-promise]: https://www.npmjs.com/package/promise
[npm-q]: https://www.npmjs.com/package/q
[npm-rsvp]: https://www.npmjs.com/package/rsvp
[npm-unthenify]: https://www.npmjs.com/package/unthenify
[npm-when]: https://www.npmjs.com/package/when
[then-nodeify]: https://github.com/then/promise#promisenodeifycallback
[unthenify]: https://github.com/blakeembrey/unthenify
[when-bindcallback]: https://github.com/cujojs/when/blob/master/docs/api.md#nodebindcallback
