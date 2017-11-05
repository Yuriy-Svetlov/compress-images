"use strict"

const tinify = require("../lib/tinify")
const assert = require("chai").assert

describe("Result", function() {
  describe("with meta and data", function() {
    beforeEach(function() {
      this.subject = new tinify.Result(Promise.resolve({
        "image-width": "100",
        "image-height": "60",
        "content-length": "450",
        "content-type": "image/png",
      }), Promise.resolve("image data"))
    })

    describe("width", function() {
      it("should return image width promise", function() {
        return this.subject.width().then(function(width) {
          assert.equal(100, width)
        })
      })

      it("should pass image width to callback", function(done) {
        this.subject.width(function(err, width) {
          assert.equal(100, width)
          done()
        })
      })
    })

    describe("height", function() {
      it("should return image height promise", function() {
        return this.subject.height().then(function(height) {
          assert.equal(60, height)
        })
      })

      it("should pass image height to callback", function(done) {
        this.subject.height(function(err, height) {
          assert.equal(60, height)
          done()
        })
      })
    })

    describe("location", function() {
      it("should return null promise", function() {
        return this.subject.location().then(function(location) {
          assert.isUndefined(location)
        })
      })

      it("should pass null to callback", function(done) {
        this.subject.location(function(err, location) {
          assert.isUndefined(location)
          done()
        })
      })
    })

    describe("size", function() {
      it("should return content length promise", function() {
        return this.subject.size().then(function(size) {
          assert.equal(450, size)
        })
      })

      it("should pass content length to callback", function(done) {
        this.subject.size(function(err, size) {
          assert.equal(450, size)
          done()
        })
      })
    })

    describe("contentType", function() {
      it("should return mime type promise", function() {
        return this.subject.contentType().then(function(contentType) {
          assert.equal("image/png", contentType)
        })
      })

      it("should pass mime type to callback", function(done) {
        this.subject.contentType(function(err, contentType) {
          assert.equal("image/png", contentType)
          done()
        })
      })
    })

    describe("toBuffer", function() {
      it("should return image data promise", function() {
        return this.subject.toBuffer().then(function(data) {
          assert.equal("image data", data)
        })
      })

      it("should pass image data to callback", function(done) {
        this.subject.toBuffer(function(err, data) {
          assert.equal("image data", data)
          done()
        })
      })
    })
  })
})
