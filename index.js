var chalk = require('chalk');
var minimist = require('minimist');
var Liftoff = require('liftoff');
var timestamp = require('fireant-timestamp');
var keypress = require('keypress');
var gaze = require('gaze');
var reload = false;

// Args
var args = minimist(process.argv.slice(2), {
    alias: {
        h: 'help',
        v: 'version'
    }
});

// Usage
var usage = chalk.bold('Usage:') + ' fire ' + chalk.gray('[tasks]');

// Create Liftoff instance
var cli = new Liftoff({
    name: 'fireant',
    extensions: {
        '.js': null
    }
});

// Run method
function run() {
    cli.launch({
        cwd: args.cwd,
        configPath: args.fileantfile,
        require: args.require
    }, invoke);
}

// Listen for keypress events
keypress(process.stdin);

process.stdin.on('keypress', function (ch, key) {
    // Pressing "q" exists
    if (key && key.name == 'q') {
        process.exit(1);
    }

    if (key && key.ctrl && key.name == 'c') {
        process.exit(1);
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();

module.exports = run;

function invoke(env) {
    // Help
    if (args.help) {
        console.log(usage);
        process.exit(1);
    }

    // Dipslay versions
    if (args.version) {
        console.log('CLI version', chalk.cyan(require('./package.json').version));

        if (env.modulePackage && typeof env.modulePackage.version !== 'undefined') {
            console.log('Local version', chalk.cyan(env.modulePackage.version));
        }

        process.exit(1);
    }

    if (args._.length < 1) {
        console.log(chalk.red(timestamp(), 'No tasks specified\n', usage));
        process.exit(1);
    }

    // Look for Fireant module
    if (!env.modulePath) {
        console.log(chalk.red(chalk.red('Local ' + cli.moduleName + ' module not found in ' + env.cwd)));
        process.exit(1);
    }

    if (env.configPath) {
        if (reload) {
            console.log(timestamp(), chalk.cyan('Reloading fireantfile'), chalk.white('in'), chalk.cyan(env.configPath));
        } else {
            console.log(timestamp(), chalk.cyan('Using fireantfile'), chalk.white('in'), chalk.cyan(env.configPath));

            // Set up Gaze to check for changes in config file
            gaze(env.configPath, function() {
                this.on('changed', function() {
                    reload = true;
                    run();
                });
            });
        }

        // When reloaded, clear configuration file from cache
        if (reload) {
            delete require.cache[require.resolve(env.configPath)];
        }

        // Load configuration file
        require(env.configPath);

        // Execute Fireant
        require('./lib/execute.js')(args, env, reload);
    } else {
        console.log(timestamp(), chalk.red('No ' + cli.configName + ' found'));
    }
}
