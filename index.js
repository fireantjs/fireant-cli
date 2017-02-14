var chalk = require('chalk');
var minimist = require('minimist');
var Liftoff = require('liftoff');
var timestamp = require('./lib/timestamp');

// Args
var args = minimist(process.argv.slice(2), {
    alias: {
        h: 'help',
        v: 'version'
    }
});

// Usage
var usage = chalk.bold('Usage:') + ' fire ' + chalk.gray('[options]') + ' tasks';

// Create Liftoff instance
var cli = new Liftoff({
    name: 'fireant',
    extensions: {
        '.js': null
    }
}).on('require', function(name) {
    console.log('require ' + name);
}).on('requireFail', function(name) {
    console.log('fail ' + name);
});

// Run method (options not yet fully supported)
function run() {
    cli.launch({
        cwd: args.cwd,
        configPath: args.fileantfile,
        require: args.require,
    }, invoke);
}

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
        console.log(chalk.red(timestamp(), 'No tasks specified\n') + usage);
        process.exit(1);
    }

    // Look for Fireant module
    if (!env.modulePath) {
        console.log(chalk.red(chalk.red('Local ' + cli.moduleName + ' module not found in ' + env.cwd)));
        process.exit(1);
    }

    if (env.configPath) {
        console.log(timestamp(), chalk.cyan('Using fireantfile in ' + env.configPath));

        // Load configuration file
        require(env.configPath);

        // Execute Fireant
        require('./lib/execute.js')(args, env);
    } else {
        console.log(timestamp(), chalk.red('No ' + cli.configName + ' found'));
    }
}
