"use strict"

const tinify = require("../lib/tinify")
const assert = require("chai").assert
const nock = require("nock")
const tmp = require("tmp")
const fs = require("fs")

describe("Source", function() {
  let dummyFile = __dirname + "/examples/dummy.png"

  describe("with invalid api key", function() {
    beforeEach(function() {
      tinify.key = "invalid"

      let request = nock("https://api.tinify.com")
        .post("/shrink")
        .reply(401, {error: "Unauthorized", message: "Credentials are invalid"})
    })

    describe("fromFile", function() {
      it("should pass account error", function() {
        return tinify.Source.fromFile(dummyFile).toBuffer().catch(function(err) {
          assert.instanceOf(err, tinify.AccountError)
        })
      })
    })

    describe("fromBuffer", function() {
      it("should pass account error", function() {
        return tinify.Source.fromBuffer("png file").toBuffer().catch(function(err) {
          assert.instanceOf(err, tinify.AccountError)
        })
      })
    })

    describe("fromUrl", function() {
      it("should pass account error", function() {
        return tinify.Source.fromUrl("http://example.com/test.jpg").toBuffer().catch(function(err) {
          assert.instanceOf(err, tinify.AccountError)
        })
      })
    })
  })

  describe("with valid api key", function() {
    before(function() {
      tinify.key = "valid"
    })

    describe("fromFile", function() {
      beforeEach(function() {
        nock("https://api.tinify.com")
          .post("/shrink")
          .reply(201, {}, {location: "https://api.tinify.com/some/location"})
      })

      it("should return source", function() {
        let source = tinify.Source.fromFile(dummyFile)
        assert.instanceOf(source, tinify.Source)
      })

      it("should return source with data", function() {
        nock("https://api.tinify.com")
          .get("/some/location")
          .reply(200, "compressed file")

        let data = tinify.Source.fromFile(dummyFile).toBuffer()
        return data.then(function(data) {
          assert.equal("compressed file", data)
        })
      })
    })

    describe("fromBuffer", function() {
      beforeEach(function() {
        nock("https://api.tinify.com")
          .post("/shrink")
          .reply(201, {}, {location: "https://api.tinify.com/some/location"})
      })

      it("should return source", function() {
        let source = tinify.Source.fromBuffer("png file")
        assert.instanceOf(source, tinify.Source)
      })

      it("should return source with data", function() {
        nock("https://api.tinify.com")
          .get("/some/location")
          .reply(200, "compressed file")

        let data = tinify.Source.fromBuffer("png file").toBuffer()
        return data.then(function(data) {
          assert.equal("compressed file", data)
        })
      })
    })

    describe("fromUrl", function() {
      it("should return source", function() {
        nock("https://api.tinify.com")
          .post("/shrink", '{"source":{"url":"http://example.com/test.jpg"}}')
          .reply(201, {}, {location: "https://api.tinify.com/some/location"})

        let source = tinify.Source.fromUrl("http://example.com/test.jpg")
        assert.instanceOf(source, tinify.Source)
      })

      it("should return source with data", function() {
        nock("https://api.tinify.com")
          .post("/shrink", '{"source":{"url":"http://example.com/test.jpg"}}')
          .reply(201, {}, {location: "https://api.tinify.com/some/location"})

        nock("https://api.tinify.com")
          .get("/some/location")
          .reply(200, "compressed file")

        let data = tinify.Source.fromUrl("http://example.com/test.jpg").toBuffer()
        return data.then(function(data) {
          assert.equal("compressed file", data)
        })
      })

      it("should pass error if request is not ok", function() {
        nock("https://api.tinify.com")
          .post("/shrink", '{"source":{"url":"file://wrong"}}')
          .reply(400, '{"error":"Source not found","message":"Cannot parse URL"}')

        return tinify.Source.fromUrl("file://wrong").toBuffer().catch(function(err) {
          assert.instanceOf(err, tinify.ClientError)
        })
      })
    })

    describe("result", function() {
      beforeEach(function() {
        nock("https://api.tinify.com")
          .post("/shrink")
          .reply(201, {}, {location: "https://api.tinify.com/some/location"})

        nock("https://api.tinify.com")
          .get("/some/location")
          .reply(200, "compressed file")
      })

      it("should return result", function() {
        let result = tinify.Source.fromBuffer("png file").result()
        assert.instanceOf(result, tinify.Result)
      })
    })

    describe("preserve", function() {
      beforeEach(function() {
        nock("https://api.tinify.com")
          .post("/shrink")
          .reply(201, {}, {location: "https://api.tinify.com/some/location"})

        nock("https://api.tinify.com")
          .get("/some/location", '{"preserve":["copyright","location"]}')
          .reply(200, "copyrighted file")
      })

      it("should return source", function() {
        let source = tinify.Source.fromBuffer("png file").preserve("copyright", "location")
        assert.instanceOf(source, tinify.Source)
      })

      it("should return source with data", function() {
        let data = tinify.Source.fromBuffer("png file").preserve("copyright", "location").toBuffer()
        return data.then(function(data) {
          assert.equal("copyrighted file", data)
        })
      })

      it("should return source with data for array", function() {
        let data = tinify.Source.fromBuffer("png file").preserve(["copyright", "location"]).toBuffer()
        return data.then(function(data) {
          assert.equal("copyrighted file", data)
        })
      })

      it("should include other options if set", function() {
        nock("https://api.tinify.com")
          .get("/some/location", '{"preserve":["copyright","location"],"resize":{"width":400}}')
          .reply(200, "copyrighted resized file")

        let data = tinify.Source.fromBuffer("png file").resize({width: 400}).preserve("copyright", "location").toBuffer()
        return data.then(function(data) {
          assert.equal("copyrighted resized file", data)
        })
      })
    })

    describe("resize", function() {
      beforeEach(function() {
        nock("https://api.tinify.com")
          .post("/shrink")
          .reply(201, {}, {location: "https://api.tinify.com/some/location"})

        nock("https://api.tinify.com")
          .get("/some/location", '{"resize":{"width":400}}')
          .reply(200, "small file")
      })

      it("should return source", function() {
        let source = tinify.Source.fromBuffer("png file").resize({width: 400})
        assert.instanceOf(source, tinify.Source)
      })

      it("should return source with data", function() {
        let data = tinify.Source.fromBuffer("png file").resize({width: 400}).toBuffer()
        return data.then(function(data) {
          assert.equal("small file", data)
        })
      })
    })

    describe("store", function() {
      beforeEach(function() {
        nock("https://api.tinify.com")
          .post("/shrink")
          .reply(201, {}, {location: "https://api.tinify.com/some/location"})

        nock("https://api.tinify.com")
          .post("/some/location", '{"store":{"service":"s3"}}')
          .reply(200, {}, {location: "https://bucket.s3.amazonaws.com/example"})
      })

      it("should return result meta", function() {
        let result = tinify.Source.fromBuffer("png file").store({service: "s3"})
        assert.instanceOf(result, tinify.ResultMeta)
      })

      it("should return result meta with location", function() {
        let location = tinify.Source.fromBuffer("png file").store({service: "s3"}).location()
        return location.then(function(location) {
          assert.equal("https://bucket.s3.amazonaws.com/example", location)
        })
      })

      it("should include other options if set", function() {
        nock("https://api.tinify.com")
          .post("/some/location", '{"store":{"service":"s3"},"resize":{"width":400}}')
          .reply(200, {}, {location: "https://bucket.s3.amazonaws.com/resized"})

        let location = tinify.Source.fromBuffer("png file").resize({width: 400}).store({service: "s3"}).location()
        return location.then(function(location) {
          assert.equal("https://bucket.s3.amazonaws.com/resized", location)
        })
      })
    })

    describe("toBuffer", function() {
      beforeEach(function() {
        nock("https://api.tinify.com")
          .post("/shrink")
          .reply(201, {}, {location: "https://api.tinify.com/some/location"})

        nock("https://api.tinify.com")
          .get("/some/location")
          .reply(200, "compressed file")
      })

      it("should return image data", function() {
        let data = tinify.Source.fromBuffer("png file").toBuffer()
        return data.then(function(data) {
          assert.equal("compressed file", data)
        })
      })
    })

    describe("toFile", function() {
      beforeEach(function() {
        nock("https://api.tinify.com")
          .post("/shrink")
          .reply(201, {}, {location: "https://api.tinify.com/some/location"})

        nock("https://api.tinify.com")
          .get("/some/location")
          .reply(200, "compressed file")
      })

      it("should store image data", function() {
        let file = tmp.fileSync()
        let promise = tinify.Source.fromBuffer("png file").toFile(file.name)
        return promise.then(function() {
          assert.equal("compressed file", fs.readFileSync(file.name))
        })
      })
    })
  })
})
