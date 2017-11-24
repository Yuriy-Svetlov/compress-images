"use strict"

if (!process.env.TINIFY_KEY) {
  console.log("Set the TINIFY_KEY environment variable.")
  process.exit(1)
}

const tinify = require("../lib/tinify")
const assert = require("chai").assert
const tmp = require("tmp")
const fs = require("fs")

describe("client integration", function() {
  this.timeout(20000)

  let optimized

  before(function() {
    tinify.key = process.env.TINIFY_KEY
    tinify.proxy = process.env.TINIFY_PROXY

    let unoptimizedPath = __dirname + "/examples/voormedia.png"
    optimized = tinify.fromFile(unoptimizedPath)
  })

  it("should compress from file", function() {
    let file = tmp.fileSync()
    return optimized.toFile(file.name).then(function() {
      let size = fs.statSync(file.name).size
      let contents = fs.readFileSync(file.name).toString("hex")

      assert.isAbove(size, 1000)
      assert.isBelow(size, 1500)

      /* width == 137 */
      assert.include(contents, new Buffer([0, 0, 0, 0x89]).toString("hex"))
      assert.notInclude(contents, new Buffer("Copyright Voormedia").toString("hex"))
    })
  })

  it("should compress from url", function() {
    let source = tinify.fromUrl("https://raw.githubusercontent.com/tinify/tinify-nodejs/master/test/examples/voormedia.png")
    let file = tmp.fileSync()
    return source.toFile(file.name).then(function() {
      let size = fs.statSync(file.name).size
      let contents = fs.readFileSync(file.name).toString("hex")

      assert.isAbove(size, 1000)
      assert.isBelow(size, 1500)

      /* width == 137 */
      assert.include(contents, new Buffer([0, 0, 0, 0x89]).toString("hex"))
      assert.notInclude(contents, new Buffer("Copyright Voormedia").toString("hex"))
    })
  })

  it("should resize", function() {
    let file = tmp.fileSync()
    return optimized.resize({method: "fit", width: 50, height: 20}).toFile(file.name).then(function() {
      let size = fs.statSync(file.name).size
      let contents = fs.readFileSync(file.name).toString("hex")

      assert.isAbove(size, 500)
      assert.isBelow(size, 1000)

      /* width == 50 */
      assert.include(contents, new Buffer([0, 0, 0, 0x32]).toString("hex"))
      assert.notInclude(contents, new Buffer("Copyright Voormedia").toString("hex"))
    })
  })

  it("should preserve metadata", function() {
    let file = tmp.fileSync()
    return optimized.preserve("copyright", "creation").toFile(file.name).then(function() {
      let size = fs.statSync(file.name).size
      let contents = fs.readFileSync(file.name).toString("hex")

      assert.isAbove(size, 1000)
      assert.isBelow(size, 2000)

      /* width == 137 */
      assert.include(contents, new Buffer([0, 0, 0, 0x89]).toString("hex"))
      assert.include(contents, new Buffer("Copyright Voormedia").toString("hex"))
    })
  })
})
