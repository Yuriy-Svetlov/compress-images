"use strict"

const tinify = require("../lib/tinify")
const assert = require("chai").assert
const nock = require("nock")

describe("tinify", function() {
  let dummyFile = __dirname + "/examples/dummy.png"

  beforeEach(function() {
    tinify.key = null
    tinify.proxy = null
  })

  afterEach(function() {
    nock.cleanAll()
  })

  describe("key", function() {
    beforeEach(function() {
      nock("https://api.tinify.com")
        .get("/")
        .basicAuth({
          user: "api",
          pass: "fghij",
        })
        .reply(200)
    })

    it("should reset client with new key", function() {
      tinify.key = "abcde"
      tinify.client
      tinify.key = "fghij"
      return tinify.client.request("get", "/")
    })
  })

  describe("appIdentifier", function() {
    beforeEach(function() {
      nock("https://api.tinify.com", {
        reqheaders: {"user-agent": tinify.Client.USER_AGENT + " MyApp/2.0"}
      }).get("/")
        .reply(200)
    })

    it("should reset client with new app identifier", function() {
      tinify.key = "abcde"
      tinify.appIdentifier = "MyApp/1.0"
      tinify.client
      tinify.appIdentifier = "MyApp/2.0"
      return tinify.client.request("get", "/")
    })
  })

  describe("proxy", function() {
    beforeEach(function() {
      nock("https://api.tinify.com")
        .get("/")
        .reply(200)
    })

    it("should reset client with new proxy", function() {
      tinify.key = "abcde"
      tinify.proxy = "http://localhost"
      tinify.client
      tinify.proxy = "http://user:pass@localhost:8080"
      return tinify.client.request("get", "/")
    })
  })

  describe("client", function() {
    describe("with key", function() {
      it("should return client", function() {
        tinify.key = "abcde"
        assert.instanceOf(tinify.client, tinify.Client)
      })
    })

    describe("without key", function() {
      it("should pass error", function() {
        assert.throws(function() {
          tinify.client
        }, tinify.AccountError)
      })
    })

    describe("with invalid proxy", function() {
      it("should pass error", function() {
        tinify.key = "abcde"
        tinify.proxy = "http-bad-url"
        assert.throws(function() {
          tinify.client
        }, tinify.ConnectionError)
      })
    })
  })

  describe("validate", function() {
    describe("with valid key", function() {
      beforeEach(function() {
        tinify.key = "valid"

        nock("https://api.tinify.com")
          .post("/shrink")
          .reply(400, '{"error":"Input missing","message":"No input"}')

      })

      it("should return null promise", function() {
        return tinify.validate().then(function(value) {
          assert.isNull(value)
        })
      })

      it("should pass null to callback", function(done) {
        tinify.validate(function(err) {
          assert.isNull(err)
          done()
        })
      })
    })

    describe("with limited key", function() {
      beforeEach(function() {
        tinify.key = "valid"

        nock("https://api.tinify.com")
          .post("/shrink")
          .reply(429, '{"error":"Too many requests","message":"Your monthly limit has been exceeded"}')

      })

      it("should return null promise", function() {
        return tinify.validate().then(function(value) {
          assert.isNull(value)
        })
      })

      it("should pass null to callback", function(done) {
        tinify.validate(function(err) {
          assert.isNull(err)
          done()
        })
      })
    })

    describe("without key", function() {
      it("should return error promise", function() {
        return tinify.validate().catch(function(err) {
          assert.instanceOf(err, tinify.AccountError)
        })
      })

      it("should pass error to callback", function(done) {
        tinify.validate(function(err) {
          assert.instanceOf(err, tinify.AccountError)
          done()
        })
      })
    })

    describe("with error", function() {
      beforeEach(function() {
        tinify.key = "invalid"

        nock("https://api.tinify.com")
          .post("/shrink")
          .reply(401, '{"error":"Unauthorized","message":"Credentials are invalid"}')
      })

      it("should return error promise", function() {
        return tinify.validate().catch(function(err) {
          assert.instanceOf(err, tinify.AccountError)
        })
      })

      it("should pass error to callback", function(done) {
        tinify.validate(function(err) {
          assert.instanceOf(err, tinify.AccountError)
          done()
        })
      })
    })
  })

  describe("fromBuffer", function() {
    beforeEach(function() {
      tinify.key = "valid"

      nock("https://api.tinify.com")
        .post("/shrink")
        .reply(201, {}, {Location: "https://api.tinify.com/some/location"})

      nock("https://api.tinify.com")
        .get("/some/location")
        .reply(200, "compressed file")
    })

    it("should return source", function() {
      let source = tinify.fromBuffer("png file")
      assert.instanceOf(source, tinify.Source)

      /* We must return buffer in order to let mocha evaluate the promise and
         make sure we wait for this request to complete. */
      return source.toBuffer()
    })
  })

  describe("fromFile", function() {
    beforeEach(function() {
      tinify.key = "valid"

      nock("https://api.tinify.com")
        .post("/shrink")
        .reply(201, {}, {Location: "https://api.tinify.com/some/location"})

      nock("https://api.tinify.com")
        .get("/some/location")
        .reply(200, "compressed file")
    })

    it("should return source", function() {
      let source = tinify.fromFile(dummyFile)
      assert.instanceOf(source, tinify.Source)

      /* We must return buffer in order to let mocha evaluate the promise and
         make sure we wait for this request to complete. */
      return source.toBuffer()
    })
  })

  describe("fromUrl", function() {
    beforeEach(function() {
      tinify.key = "valid"

      nock("https://api.tinify.com")
        .post("/shrink", '{"source":{"url":"http://example.com/test.jpg"}}')
        .reply(201, {}, {Location: "https://api.tinify.com/some/location"})

      nock("https://api.tinify.com")
        .get("/some/location")
        .reply(200, "compressed file")
    })

    it("should return source", function() {
      let source = tinify.fromUrl("http://example.com/test.jpg")
      assert.instanceOf(source, tinify.Source)

      /* We must return buffer in order to let mocha evaluate the promise and
         make sure we wait for this request to complete. */
      return source.toBuffer()
    })
  })
})
