/* eslint-disable */
require("react-native-get-random-values");
if (typeof __dirname === "undefined") global.__dirname = "/";
if (typeof __filename === "undefined") global.__filename = "";
if (typeof process === "undefined") {
  global.process = require("process");
} else {
  const bProcess = require("process");
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}

process.browser = false;
if (typeof Buffer === "undefined") global.Buffer = require("buffer").Buffer;

// global.location = global.location || { port: 80 }
const isDev = typeof __DEV__ === "boolean" && __DEV__;
process.env["NODE_ENV"] = isDev ? "development" : "production";
if (typeof localStorage !== "undefined") {
  localStorage.debug = isDev ? "*" : "";
}

if (typeof BigInt === "undefined") {
  const bi = require("big-integer");
  // Allow BigInt('0xffffffffffffffff') or BigInt('0x777777777777777777')
  global.BigInt = (value) => {
    if (typeof value === "string") {
      // eslint-disable-next-line prefer-named-capture-group
      const match = value.match(/^0([xo])([0-9a-f]+)$/i);
      if (match) {
        return bi(match[2], match[1].toLowerCase() === "x" ? 16 : 8);
      }
    }
    return bi(value);
  };
}

if (typeof btoa === "undefined") {
  global.btoa = function (str) {
    return new Buffer(str, "binary").toString("base64");
  };
}

if (typeof atob === "undefined") {
  global.atob = function (b64Encoded) {
    return new Buffer(b64Encoded, "base64").toString("binary");
  };
}

// If using the crypto shim, uncomment the following line to ensure
// crypto is loaded first, so it can populate global.crypto
require("crypto");
