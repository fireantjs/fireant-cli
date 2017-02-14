var chalk = require('chalk');

function execute(opts, env) {
    var tasks = opts._;
    var runTasks = tasks.length ? tasks : false;

    // Get fireant instance
    var fireantInst = require(env.modulePath);

    // Run tasks
    process.nextTick(function() {
        if (runTasks) {
            fireantInst.run(runTasks);
        }
    });
}

module.exports = execute;
