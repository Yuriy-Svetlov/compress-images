"use strict"

const fs = require("fs")
module.exports.nodeify = require("promise-nodeify")

function promisify(fn) {
  return function() {
    let args = Array.from(arguments)

    return new Promise((resolve, reject) => {
      args.push((err, value) => {
        if (err) return reject(err)
        resolve(value)
      })

      fn.apply(undefined, args)
    })
  }
}

module.exports.readFile = promisify(fs.readFile)
module.exports.writeFile = promisify(fs.writeFile)
