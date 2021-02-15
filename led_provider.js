const rpio = require('rpio');
const Promise = require('bluebird');
const spi = require('spi');

export class LedProvider {

    _led_length = 12;
    _led_buffer;
    device;
    _led_bits = this._led_length * 4 + 8;

    init() {
        return new Promise((resolve, reject) => {
            Promise.resolve()
                .then(() => {
                    rpio.init({ mapping: 'gpio', gpiomem: true })
                    rpio.open(5, rpio.OUTPUT, rpio.HIGH);
                    return;
                })
                .delay(100)
                .then(() => {
                    this.device = new spi.Spi('/dev/spidev0.0', {
                        'mode': spi.MODE['MODE_0']
                    })
                    this.device.maxSpeed(4000000);
                    this.device.open();

                    this._led_buffer = new Buffer(this._led_bits);
                    for (let i = 0; i < this._led_bits; i++) {
                        if (i < (this._led_bits - 4))
                            this._led_buffer[i] = 0x00;
                        else
                            this._led_buffer[i] = 255;
                    }
                    console.log('<<LedProvider>> Init')
                    resolve();
                })
        })
    }

    writeStrip() {
        return Promise.try(() => {
            this.device.write(this._led_buffer);
        });
    }

    clear() {
        return this.fillPix(0, 0, 0, 255);
    }

    setPix(position, red, green, blue, brightness) {

        return new Promise((resolve, reject) => {
            if (position > this._led_length) {
                reject(new Error('Wrong Position'));
            }
            else {
                let current_led = 4 + (position * 4)
                this._led_buffer[current_led + 1] = blue;
                this._led_buffer[current_led + 2] = green;
                this._led_buffer[current_led + 3] = red;
                this._led_buffer[current_led + 0] = brightness;
                resolve(this.writeStrip());
            }
        });
    }
    fillPix(red, green, blue, brightness) {
        for (let i = 0; i < this._led_length; i++) {
            var current_led = 4 + (i * 4);
            this._led_buffer[current_led + 1] = blue;
            this._led_buffer[current_led + 2] = green;
            this._led_buffer[current_led + 3] = red;
            this._led_buffer[current_led + 0] = brightness;
        }
        return this.writeStrip();
    }
}
