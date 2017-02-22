var chalk = require('chalk');

function execute(opts, env, reload) {
    var tasks = opts._;

    // Get Fireant instance
    var fireantInst = require(env.modulePath);

    // Reload Fireant
    if (reload) {
        fireantInst.reload();
    }

    // Run tasks
    process.nextTick(function() {
        fireantInst.run(tasks);
    });
}

module.exports = execute;
