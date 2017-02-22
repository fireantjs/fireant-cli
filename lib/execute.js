var chalk = require('chalk');

function execute(opts, env, reload) {
    var tasks = opts._;
    var runTasks = tasks.length ? tasks : false;

    // Get Fireant instance
    var fireantInst = require(env.modulePath);

    // Reload Fireant
    if (reload) {
        fireantInst.reload();
    }

    // Run tasks
    process.nextTick(function() {
        if (runTasks) {
            fireantInst.run(runTasks);
        }
    });
}

module.exports = execute;
