"use strict"

const tinify = require("../lib/tinify")
const assert = require("chai").assert

describe("ResultMeta", function() {
  describe("with metadata", function() {
    beforeEach(function() {
      this.subject = new tinify.ResultMeta(Promise.resolve({
        "image-width": "100",
        "image-height": "60",
        "location": "https://example.com/image.png",
      }))
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
      it("should return image location promise", function() {
        return this.subject.location().then(function(location) {
          assert.equal("https://example.com/image.png", location)
        })
      })

      it("should pass image location to callback", function(done) {
        this.subject.location(function(err, location) {
          assert.equal("https://example.com/image.png", location)
          done()
        })
      })
    })
  })
})
