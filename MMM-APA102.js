Module.register('MMM-APA102',{

    defaults: {
  	meinParam: 12,
	flashOnAlert: true
    },

    start: function() {
        Log.info('[' + this.name + '] Starting');
        this.sendSocketNotification('INITIATE', this.config);
    },

    notificationReceived: function(notification, payload) {
        // Support for PILIGHTS Module:
        if (notification === 'PILIGHTS_SEQUENCE') {
            var color = payload.replace('_pulse', '');
            this.sendSocketNotification('pulse', color);
        // Pulse on alerts shown in the UI:
        } else if (notification === 'SHOW_ALERT' && this.config.flashOnAlert) {
            this.sendSocketNotification('alert');
        }
        
    }
});
