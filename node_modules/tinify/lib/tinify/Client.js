"use strict"

const https = require("https")
const url = require("url")
const fs = require("fs")
const proxyAgent = require("proxying-agent")

const version = require("../../package.json").version
const tinify = require("../tinify")

class Client {
  constructor(key, appIdentifier, proxy) {
    this.userAgent = [this.constructor.USER_AGENT, appIdentifier].filter(Boolean).join(" ")

    this.defaultOptions = {
      caBundle: this.constructor.CA_BUNDLE,
      rejectUnauthorized: true,
      auth: "api:" + key,
    }

    if (proxy) {
      if (!url.parse(proxy).hostname) {
        throw new tinify.ConnectionError("Invalid proxy");
      }

      /* Note: although keepAlive is enabled, the proxy agent reconnects to the
         proxy server each time. This makes proxied requests slow. There
         seems to be no proxy tunneling agent that reuses TLS connections. */
      this.defaultOptions.agent = proxyAgent.create({
        proxy: proxy,
        keepAlive: true,
      }, this.constructor.API_ENDPOINT)
    }
  }

  request(method, path, body) {
    let options = url.parse(url.resolve(this.constructor.API_ENDPOINT, path))
    options.method = method
    options.headers = {}
    options.ca = this.constructor.CA_BUNDLE
    Object.assign(options, this.defaultOptions)

    options.headers["User-Agent"] = this.userAgent

    if (typeof body === "object" && !Buffer.isBuffer(body)) {
      if (Object.keys(body).length) {
        /* Encode as JSON. */
        body = JSON.stringify(body)
        options.headers["Content-Type"] = "application/json"
        options.headers["Content-Length"] = body.length
      } else {
        /* No options, send without body. */
        body = undefined
      }
    }

    let retries = this.constructor.RETRY_COUNT + 1
    return new Promise((resolve, reject) => {
      let exec = () => {
        retries -= 1
        let request = https.request(options, response => {
          let count = response.headers["compression-count"]
          if (count) tinify.compressionCount = parseInt(count, 10)

          let data = []
          response.on("data", chunk => {
            data.push(chunk)
          })

          response.on("end", () => {
            data = Buffer.concat(data)
            if (response.statusCode >= 200 && response.statusCode <= 299) {
              resolve({headers: response.headers, body: data})
            } else {
              let details
              try {
                details = JSON.parse(data)
              } catch(err) {
                details = {
                  message: "Error while parsing response: " + err.message,
                  error: "ParseError",
                }
              }

              if (retries > 0 && response.statusCode >= 500) {
                return setTimeout(exec, this.constructor.RETRY_DELAY)
              }

              reject(tinify.Error.create(details.message, details.error, response.statusCode))
            }
          })
        })

        request.on("error", err => {
          if (retries > 0) {
            return setTimeout(exec, this.constructor.RETRY_DELAY)
          }

          reject(new tinify.ConnectionError("Error while connecting: " + err.message))
        })

        request.end(body)
      }

      exec()
    })
  }
}

Client.API_ENDPOINT = "https://api.tinify.com"

Client.RETRY_COUNT = 1
Client.RETRY_DELAY = 500

Client.USER_AGENT = "Tinify/" + version + " Node/" + process.versions.node + " (" + process.platform + ")"

let boundaries = /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----\n/g
let data = fs.readFileSync(__dirname + "/../data/cacert.pem").toString()
Client.CA_BUNDLE = data.match(boundaries)

module.exports = Client
