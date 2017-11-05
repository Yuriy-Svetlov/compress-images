/** @module promise-nodeify
 * @copyright Copyright 2016 Kevin Locke <kevin@kevinlocke.name>
 * @license MIT
 */

'use strict';

/** Function which will run with a clear stack as soon as possible.
 * @private
 */
var later =
  typeof process !== 'undefined' &&
    typeof process.nextTick === 'function' ? process.nextTick :
  typeof setImmediate === 'function' ? setImmediate :
  setTimeout;

/** Invokes callback and ensures any exceptions thrown are uncaught.
 * @private
 */
function doCallback(callback, reason, value) {
  // Note:  Could delay callback call until later, as When.js does, but this
  // loses the stack (particularly for bluebird long traces) and causes
  // unnecessary delay in the non-exception (common) case.
  try {
    // Match argument length to resolve/reject in case callback cares.
    // Note:  bluebird has argument length 1 if value === undefined due to
    // https://github.com/petkaantonov/bluebird/issues/170
    // If you are reading this and want similar behavior, I'll consider it.
    if (reason) {
      callback(reason);
    } else {
      callback(null, value);
    }
  } catch (err) {
    later(function() { throw err; });
  }
}

/** Calls a node-style callback when a Promise is resolved or rejected.
 *
 * This function provides the behavior of
 * {@link https://github.com/then/nodeify then <code>nodeify</code>},
 * {@link
 * https://github.com/cujojs/when/blob/master/docs/api.md#nodebindcallback
 * when.js <code>node.bindCallback</code>},
 * or {@link http://bluebirdjs.com/docs/api/ascallback.html bluebird
 * <code>Promise.prototype.nodeify</code> (now
 * <code>Promise.prototype.asCallback</code>)} (without options).
 *
 * @ template ValueType
 * @param {!Promise<ValueType>} promise Promise to monitor.
 * @param {?function(*, ValueType=)=} callback Node-style callback to be
 * called when <code>promise</code> is resolved or rejected.  If
 * <code>promise</code> is rejected with a falsey value the first argument
 * will be an instance of <code>Error</code> with a <code>.cause</code>
 * property with the rejected value.
 * @return {Promise<ValueType>|undefined} <code>undefined</code> if
 * <code>callback</code> is a function, otherwise a <code>Promise</code>
 * which behaves like <code>promise</code> (currently is <code>promise</code>,
 * but is not guaranteed to remain so).
 * @alias module:promise-nodeify
 */
function promiseNodeify(promise, callback) {
  if (typeof callback !== 'function') {
    return promise;
  }

  function onRejected(reason) {
    // callback is unlikely to recognize or expect a falsey error.
    // (we also rely on truthyness for arguments.length in doCallback)
    // Convert it to something truthy
    var truthyReason = reason;
    if (!truthyReason) {
      // Note:  unthenify converts falsey rejections to TypeError:
      // https://github.com/blakeembrey/unthenify/blob/v1.0.0/src/index.ts#L32
      // We use bluebird convention for Error, message, and .cause property
      truthyReason = new Error(reason + '');
      truthyReason.cause = reason;
    }

    doCallback(callback, truthyReason);
  }

  function onResolved(value) {
    doCallback(callback, null, value);
  }

  promise.then(onResolved, onRejected);
  return undefined;
}

/** A version of {@link promiseNodeify} which delegates to the
 * <code>.nodeify</code> method on <code>promise</code>, if present.
 *
 * This may be more performant than {@see promiseNodeify} and have additional
 * implementation-specific features, but the behavior may differ from
 * <code>promiseNodeify</code> and between Promise implementations.
 *
 * Note that this function only passes the callback argument to
 * <code>.nodeify</code>, since additional arguments are interpreted
 * differently by different libraries (e.g. bluebird treats the next argument
 * as an options object while then treats it as <code>this</code> for the
 * callback).
 *
 * @ template ValueType
 * @param {!Promise<ValueType>} promise Promise to monitor.
 * @param {?function(*, ValueType=)=} callback Node-style callback.
 * @return {Promise<ValueType>|undefined} Value returned by
 * <code>.nodeify</code>.  Known implementations return the
 * <code>promise</code> argument when callback is falsey and either
 * <code>promise</code> or <code>undefined</code> otherwise.
 */
promiseNodeify.delegated = function nodeifyDelegated(promise, callback) {
  if (typeof promise.nodeify === 'function') {
    return promise.nodeify(callback);
  }

  return promiseNodeify(promise, callback);
};

/** Polyfill for <code>Promise.prototype.nodeify</code> which behaves like
 * {@link promiseNodeify}.
 *
 * @ template ValueType
 * @this {!Promise<ValueType>}
 * @param {?function(*, ValueType=)=} callback Node-style callback.
 * @return {Promise<ValueType>|undefined} <code>undefined</code> if
 * <code>callback</code> is a function, otherwise a <code>Promise</code>
 * which behaves like <code>promise</code> (currently is <code>promise</code>,
 * but is not guaranteed to remain so).
 */
promiseNodeify.nodeifyThis = function nodeifyThis(callback) {
  return promiseNodeify(this, callback);
};

// Note: This file is used directly for Node and wrapped in UMD for browser
if (typeof exports === 'object') {
  module.exports = promiseNodeify;
}
