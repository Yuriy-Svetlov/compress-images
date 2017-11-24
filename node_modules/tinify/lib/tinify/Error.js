"use strict"

class Error extends global.Error {
  constructor(message, type, status) {
    super()
    global.Error.captureStackTrace(this, Error)
    if (status) {
      this.status = status
      this.message = message + " (HTTP " + status + "/" + type + ")"
    } else {
      this.message = message
    }
  }

  static create(message, type, status) {
    let klass
    if (status == 401 || status == 429) {
      klass = AccountError
    } else if (status >= 400 && status <= 499) {
      klass = ClientError
    } else if (status >= 500 && status <= 599) {
      klass = ServerError
    } else {
      klass = Error
    }

    if (!message) {
      message = "No message was provided"
    }

    return new klass(message, type, status)
  }
}

class AccountError extends Error {}
class ClientError extends Error {}
class ServerError extends Error {}
class ConnectionError extends Error {}

module.exports = {
  Error: Error,
  AccountError: AccountError,
  ClientError: ClientError,
  ServerError: ServerError,
  ConnectionError: ConnectionError,
}
