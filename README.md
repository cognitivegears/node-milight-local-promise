# node-milight-local-promise
Extension of node-milight-promise to work with locally connected milight controllers on an embedded platform (such as Raspberry PI)

Important
---------

This module is intended for embedded platforms (e.g. Raspberry Pi) with a 
hardware modified MiLight controller attached via serial/GPIO.  See 
(LimitlessLED WiFi Bridge 4.0 Conversion to Raspberry Pi)[http://servernetworktech.com/2014/09/limitlessled-wifi-bridge-4-0-conversion-raspberry-pi/]
for information on setting up this system.  If you are using a regular MiLight 
controller, see [https://www.npmjs.com/package/node-milight-promise] for 
the solution for you.

Many thanks to Marcus Wittig for providing this excellent module and base for 
this project.

Copyright
=========

The MIT License (MIT)

Copyright (c) 2015 Nathan Byrd

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

## Usage Example

    var Milight = require('node-milight-local-promise').MilightLocalController;
    var commands = require('node-milight-local-promise').commands;
            
                
    var light = new Milight({}),
    zone = 1;
                                                        
    light.sendCommands(commands.rgbw.on(zone), commands.rgbw.brightness(100));
    for (var x=0; x<256; x++) {
        light.sendCommands( commands.rgbw.on(zone), commands.rgbw.hue(x));
    }
    light.pause(1000);
    light.sendCommands(commands.rgbw.on(zone), commands.rgbw.whiteMode(zone));
                                                                                            
    light.close();
