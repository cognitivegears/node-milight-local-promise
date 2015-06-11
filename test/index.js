var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;
var mockery = require('mockery');
var sinon = require('sinon');

var Milight = require('../src/index').MilightLocalController;
var commands = require('../src/index').commands;

describe('#sendCommands', function() {
    var serialportStub;

    var writeStub = sinon.stub();

    before(function() {
        mockery.enable();

        // Setup stubs
        serialportStub = {SerialPort: function() {

            this.on = function(command, callback) {
                callback();
            }; 
            this.write = function(buffer, callback) {
                writeStub();
                callback(0); 
            };
        }};


        mockery.registerMock('serialport', serialportStub);


    });
    
    after(function() {
        mockery.disable();
    });

    it('should create a milight', function() {
        var light = new Milight({});
        expect(light).to.be.an('object');
        expect(light).to.be.an.instanceof(Milight);
    });

    it('should set default property values', function() {
        var light = new Milight({});
        expect(light).to.have.property('_compatMode', false);
        expect(light).to.have.property('_ttlPort', "/dev/ttyAMA0");
        expect(light).to.have.property('_ttlSpeed', 9600);
    });

    it('should allow setting property values', function() {
        var light = new Milight({ttlPort: "/dev/null", ttlSpeed: 1200, compatMode: true});
        expect(light).to.have.property('_compatMode', true);
        expect(light).to.have.property('_ttlPort', "/dev/null");
        expect(light).to.have.property('_ttlSpeed', 1200);
    });

});
