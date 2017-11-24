"use strict"

const tinify = require("../lib/tinify")
const assert = require("chai").assert
const nock = require("nock")
const semver = require("semver")

describe("Client", function() {
  beforeEach(function() {
    tinify.Client.RETRY_DELAY = 10
    this.subject = new tinify.Client("key")
  })

  afterEach(function() {
    nock.cleanAll()
  })

  describe("request", function() {
    describe("when valid", function() {
      it("should issue request", function() {
        let request = nock("https://api.tinify.com")
          .get("/")
          .reply(200, {})

        return this.subject.request("get", "/")
      })

      it("should issue request without body when options are empty", function() {
        let request = nock("https://api.tinify.com")
          .get("/", "")
          .reply(200, {})

        return this.subject.request("get", "/", {})
      })

      it("should issue request without content type when options are empty", function() {
        let request = nock("https://api.tinify.com", {
          badheaders: ["content-type"]
        }).get("/", "")
          .reply(200, {})

        return this.subject.request("get", "/", {})
      })

      it("should issue request with json body", function() {
        let request = nock("https://api.tinify.com", {
          reqheaders: {
            "content-type": "application/json",
            "content-length": "17",
          }
        }).get("/", {hello: "world"})
          .reply(200, {})

        return this.subject.request("get", "/", {hello: "world"})
      })

      it("should issue request with user agent", function() {
        let request = nock("https://api.tinify.com", {
          reqheaders: {"user-agent": tinify.Client.USER_AGENT}
        }).get("/")
          .reply(200, {})

        return this.subject.request("get", "/")
      })

      it("should update compression count", function() {
        let request = nock("https://api.tinify.com")
          .get("/")
          .reply(200, {}, {"Compression-Count": "12"})

        return this.subject.request("get", "/").then(function() {
          assert.equal(tinify.compressionCount, 12)
        })
      })

      describe("with app id", function() {
        beforeEach(function() {
          this.subject = new tinify.Client("key", "TestApp/0.1")
        })

        it("should issue request with user agent", function() {
          let request = nock("https://api.tinify.com", {
            reqheaders: {"user-agent": tinify.Client.USER_AGENT + " TestApp/0.1"}
          }).get("/")
            .reply(200, {})

          return this.subject.request("get", "/")
        })
      })

      describe("with proxy", function() {
        beforeEach(function() {
          this.subject = new tinify.Client("key", null, "http://user:pass@localhost:8080")
        })

        it("should issue request with proxy authorization", function() {
          /* TODO: Nock does not support mocking agents? We're not actually
             testing anything here. */
          let request = nock("https://api.tinify.com").get("/")
            .reply(200, {})

          return this.subject.request("get", "/")
        })
      })
    })

    /* TODO: Test timeout/socket errors? */

    describe("with unexpected error once", function() {
      let response

      beforeEach(function() {
        let request = nock("https://api.tinify.com")
          .get("/")
          .replyWithError("some error")

          .get("/")
          .reply(200, {})

        return this.subject.request("get", "/").then(res => response = res)
      })

      it("should return response", function() {
        assert.equal(response.body, "{}")
      })
    })

    describe("with unexpected error repeatedly", function() {
      let error

      beforeEach(function() {
        let request = nock("https://api.tinify.com")
          .get("/").times(2)
          .replyWithError("some error")

        return this.subject.request("get", "/").catch(function(err) {
          error = err
        })
      })

      it("should pass error", function() {
        assert.instanceOf(error, tinify.ConnectionError)
      })

      it("should pass error with message", function() {
        assert.equal(error.message, "Error while connecting: some error")
      })

      it("should pass error with stack", function() {
        assert.include(error.stack, "at ConnectionError")
      })
    })

    describe("with server error once", function() {
      let response

      beforeEach(function() {
        let request = nock("https://api.tinify.com")
          .get("/")
          .reply(584, '{"error":"InternalServerError","message":"Oops!"}')

          .get("/")
          .reply(200, {})

        return this.subject.request("get", "/").then(res => response = res)
      })

      it("should return response", function() {
        assert.equal(response.body, "{}")
      })
    })

    describe("with server error repeatedly", function() {
      let error

      beforeEach(function() {
        let request = nock("https://api.tinify.com")
          .get("/").times(2)
          .reply(584, '{"error":"InternalServerError","message":"Oops!"}')

        return this.subject.request("get", "/").catch(function(err) {
          error = err
        })
      })

      it("should pass server error", function() {
        assert.instanceOf(error, tinify.ServerError)
      })

      it("should pass error with message", function() {
        assert.equal(error.message, "Oops! (HTTP 584/InternalServerError)")
      })

      it("should pass error with stack", function() {
        assert.include(error.stack, "at ServerError")
      })
    })

    describe("with bad server response once", function() {
      let response

      beforeEach(function() {
        let request = nock("https://api.tinify.com")
          .get("/")
          .reply(543, '<!-- this is not json -->')

          .get("/")
          .reply(200, {})

        return this.subject.request("get", "/").then(res => response = res)
      })

      it("should return response", function() {
        assert.equal(response.body, "{}")
      })
    })

    describe("with bad server response repeatedly", function() {
      let error

      beforeEach(function() {
        let request = nock("https://api.tinify.com")
          .get("/").times(2)
          .reply(543, '<!-- this is not json -->')

        return this.subject.request("get", "/").catch(function(err) {
          error = err
        })
      })

      it("should pass server error", function() {
        assert.instanceOf(error, tinify.ServerError)
      })

      it("should pass error with message", function() {
        if (semver.gte(process.versions.node, "6.0.0")) {
          assert.equal(error.message, "Error while parsing response: Unexpected token < in JSON at position 0 (HTTP 543/ParseError)")
        } else {
          assert.equal(error.message, "Error while parsing response: Unexpected token < (HTTP 543/ParseError)")
        }
      })

      it("should pass error with stack", function() {
        assert.include(error.stack, "at ServerError")
      })
    })

    describe("with client error", function() {
      let error

      beforeEach(function() {
        let request = nock("https://api.tinify.com")
          .get("/")
          .reply(492, '{"error":"BadRequest","message":"Oops!"}')

        return this.subject.request("get", "/").catch(function(err) {
          error = err
        })
      })

      it("should pass client error", function() {
        assert.instanceOf(error, tinify.ClientError)
      })

      it("should pass error with message", function() {
        assert.equal(error.message, "Oops! (HTTP 492/BadRequest)")
      })

      it("should pass error with stack", function() {
        assert.include(error.stack, "at ClientError")
      })
    })

    describe("with bad credentials", function() {
      let error

      beforeEach(function() {
        let request = nock("https://api.tinify.com")
          .get("/")
          .reply(401, '{"error":"Unauthorized","message":"Oops!"}')

        return this.subject.request("get", "/").catch(function(err) {
          error = err
        })
      })

      it("should pass account error", function() {
        assert.instanceOf(error, tinify.AccountError)
      })

      it("should pass error with message", function() {
        assert.equal(error.message, "Oops! (HTTP 401/Unauthorized)")
      })

      it("should pass error with stack", function() {
        assert.include(error.stack, "at AccountError")
      })
    })
  })
})
