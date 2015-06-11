var util = require('util');
var Promise = require('bluebird');
var dgram = require('dgram');
var debug = process.env.hasOwnProperty('MILIGHT_DEBUG') ? consoleDebug : function () {
};

var TTL_PORT = "/dev/ttyAMA0";
var TTL_SPEED = 9600;
var COMPAT_MODE = false;

function consoleDebug() {
    console.log.apply(this, arguments);
}

var MilightController = require('node-milight-promise').MilightController;

var MilightLocalController = function(options) {
  MilightLocalController.super_.call(this, options);
  this.className = "MilightLocalController";
  this._ttlPort = options.ttlPort || TTL_PORT;
  this._ttlSpeed = options.ttlSpeed || TTL_SPEED;
  this._compatMode = options.compatMode || COMPAT_MODE;
};

util.inherits(MilightLocalController, MilightController);

// Overload member functions
MilightLocalController.prototype._createSocket = function () {
  var self = this;
  return Promise.settle([self._socketInit]).then(function() {
    self._socketInit = new Promise(function(resolve, reject) {
      if(self.clientSocket) {
        return resolve();
      }
      else {
        debug("Initializing serial");
        var SerialPort = require("serialport").SerialPort;
        var socket = new SerialPort(self._ttlPort, {baudrate: self._ttlSpeed});
        self.clientSocket = socket;
        socket.on("open", function() {
          resolve();  
        });
      }
    });
    return self._socketInit;
  });
};

MilightLocalController.prototype._sendThreeByteArray = function(threeByteArray) {
  if(!(threeByteArray instanceof Array)) {
    return Promise.reject(new Error("Array argument required"));
  }

  // If compatibility mode is turned off, actually send a two byte array instead
  if(threeByteArray.length > 2 && !(this._compatMode)) {
    threeByteArray = threeByteArray.slice(0, 2);
  }


  var buffer = new Buffer(threeByteArray);
  var self = this;

  return new Promise(function (resolve, reject) {
    self._createSocket().then(function() {
      var socket = self.clientSocket;
      socket.write(buffer, function (error) {
        if(error) {
          debug("Serial socket error: " + error);
          return reject(error);
        }
        else {
          Promise.delay(self._delayBetweenCommands).then(function() {
            return resolve();
          });
        }
      });
    });
  });
};

module.exports = MilightLocalController;
