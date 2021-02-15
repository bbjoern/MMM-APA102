/* global require */

/* Magic Mirror
 * Module: MMM-APA102
 *
 * By bbjoern
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const hooloovoo = require('hooloovoo');

module.exports = NodeHelper.create({
	start: function () {
        	console.log('[APA102] Starting node_helper');
		hooloovoo.setup(12, 16); // assign number of APA102 LEDs, assign SPI clock
		hooloovoo.fill_RGB(255,0,255)
    	},

	socketNotificationReceived: function() {},

});
