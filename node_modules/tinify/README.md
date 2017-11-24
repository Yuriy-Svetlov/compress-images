[<img src="https://travis-ci.org/tinify/tinify-nodejs.svg?branch=master" alt="Build Status">](https://travis-ci.org/tinify/tinify-nodejs)

# Tinify API client for Node.js

Node.js client for the Tinify API, used for [TinyPNG](https://tinypng.com) and [TinyJPG](https://tinyjpg.com). Tinify compresses your images intelligently. Read more at [http://tinify.com](http://tinify.com).

## Documentation

[Go to the documentation for the Node.js client](https://tinypng.com/developers/reference/nodejs).

## Installation

Install the API client:

```
npm install tinify
```

Or add this to your `package.json`:

```json
{
  "dependencies": {
    "tinify": "*"
  }
}
```

## Usage

```javascript
const tinify = require("tinify");
tinify.key = "YOUR_API_KEY";

tinify.fromFile("unoptimized.png").toFile("optimized.png");
```

## Running tests

```
npm install
npm test
```

### Integration tests

```
npm install
TINIFY_KEY=$YOUR_API_KEY npm run integration
```

## License

This software is licensed under the MIT License. [View the license](LICENSE).
