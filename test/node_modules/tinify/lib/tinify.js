"use strict"

const nodeify = require("./tinify/compat").nodeify

const tinify = module.exports = {
  set key(key) {
    this._key = key
    this._client = null
  },

  set appIdentifier(appIdentifier) {
    this._appIdentifier = appIdentifier
    this._client = null
  },

  set proxy(proxy) {
    this._proxy = proxy
    this._client = null
  },

  get client() {
    if (!this._key) {
      throw new tinify.AccountError("Provide an API key with tinify.key = ...")
    }

    if (!this._client) {
      this._client = new tinify.Client(this._key, this._appIdentifier, this._proxy)
    }

    return this._client
  },

  fromFile(path) {
    return tinify.Source.fromFile(path)
  },

  fromBuffer(string) {
    return tinify.Source.fromBuffer(string)
  },

  fromUrl(url) {
    return tinify.Source.fromUrl(url)
  },

  validate(callback) {
    function is429(err) {
      return err instanceof tinify.AccountError && err.status == 429
    }

    try {
      let request = this.client.request("post", "/shrink")

      return nodeify(request.catch(err => {
        if (err instanceof tinify.ClientError || is429(err)) return null
        throw err
      }), callback)
    } catch(err) {
      return nodeify(Promise.reject(err), callback)
    }
  }
}

const errors = require("./tinify/Error")
Object.assign(tinify, errors)

tinify.Client = require("./tinify/Client")
tinify.ResultMeta = require("./tinify/ResultMeta")
tinify.Result = require("./tinify/Result")
tinify.Source = require("./tinify/Source")
