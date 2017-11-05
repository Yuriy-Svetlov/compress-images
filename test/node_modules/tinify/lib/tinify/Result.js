"use strict"

const tinify = require("../tinify")

const nodeify = require("./compat").nodeify
const writeFile = require("./compat").writeFile

const ignore = () => {}
const intify = v => parseInt(v, 10)

class Result extends tinify.ResultMeta {
  constructor(meta, data) {
    super(meta)
    this._data = data
  }

  meta() {
    /* Ignore errors on data, because they'll be propagated to meta too. */
    return this._data.catch(ignore) && this._meta
  }

  data() {
    /* Ignore errors on meta, because they'll be propagated to data too. */
    return this._meta.catch(ignore) && this._data
  }

  toFile(path, callback) {
    return nodeify(this.data().then(writeFile.bind(null, path)), callback)
  }

  toBuffer(callback) {
    return nodeify(this.data(), callback)
  }

  size(callback) {
    return nodeify(this.meta().then(meta => intify(meta["content-length"])), callback)
  }

  mediaType(callback) {
    return nodeify(this.meta().then(meta => meta["content-type"]), callback)
  }

  contentType(callback) {
    return this.mediaType(callback)
  }
}

module.exports = Result
