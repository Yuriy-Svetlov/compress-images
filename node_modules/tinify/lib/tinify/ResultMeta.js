"use strict"

const nodeify = require("./compat").nodeify

const intify = v => parseInt(v, 10)

class ResultMeta {
  constructor(meta) {
    this._meta = meta
  }

  meta() {
    return this._meta
  }

  width(callback) {
    return nodeify(this.meta().then(meta => intify(meta["image-width"])), callback)
  }

  height(callback) {
    return nodeify(this.meta().then(meta => intify(meta["image-height"])), callback)
  }

  location(callback) {
    return nodeify(this.meta().then(meta => meta["location"]), callback)
  }
}

module.exports = ResultMeta
