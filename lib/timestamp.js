var chalk = require('chalk');

Date.prototype.time = function() {
    return (this.getHours() < 10 ? '0' : '') +
        this.getHours() +
        ':' +
        (this.getMinutes() < 10 ? '0' : '') +
        this.getMinutes() +
        ':' +
        (this.getSeconds() < 10 ? '0' : '') +
        this.getSeconds();
};

module.exports = function() {
    var date = new Date();
    return chalk.gray('[' + date.time() + ']');
};
