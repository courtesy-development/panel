var pg = require('./databaspg');

module.exports = {
    time_sec() {
    return Math.floor(Date.now() / 1000);
    },
    time_ms() {
    return Date.now();
    },
    round_to_the_nearest(value, to = 37) {
    mod = value % to;
    return value + (mod < (to / 2) ? -mod : to - mod);
    },
    curtime(interval = 37) {
    return this.round_to_the_nearest(this.time_sec(), interval);
    },
    get_ip: (req) => {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (ip.indexOf(',') != -1) {
            ip = ip.split(',')[0];
        }
        return ip;
    },
    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}
