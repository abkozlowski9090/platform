/**================================
 * Setting up the basics
 **===============================*/

// Requirements
var util         = require('util'),
	path         = require('path'),
	fs           = require('fs'),
	yeoman       = require('yeoman-generator'),
	wrench       = require('wrench'),
	chalk        = require('chalk'),
	mkdirp       = require('mkdirp'),
	git          = require('simple-git')(),
	wp           = require('wp-util'),
	async				 = require('async'),
	wordpress    = require('../util/wordpress'),
	art          = require('../util/art'),
	Logger       = require('../util/log'),
	Config       = require('../util/config')
	_						 = require('underscore');

// Export the module
module.exports = Generator;

// Extend the base generator
function Generator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	// Log level option
	this.option('log', {
		desc: 'The log verbosity level: [ verbose | log | warn | error ]',
		defaults: 'log',
		alias: 'l',
		name: 'level'
	});

	// Enable advanced features
	this.option('advanced', {
		desc: 'Makes advanced features available',
		alias: 'a'
	});

	// Shortcut for --log=verbose
	this.option('verbose', {
		desc: 'Verbose logging',
		alias: 'v'
	});
	if (this.options.verbose) {
		this.options.log = 'verbose';
	}

	// Setup the logger
	this.logger = Logger({
		level: this.options.log
	});

	// Log the options
	try {
		this.logger.verbose('\nOptions: ' + JSON.stringify(this.options, null, '  '));
	} catch(e) {
		// This is here because when a generator is run by selecting it after running `yo`,
		// the options is a circular data structure, causing an error when converting to json.
		// Verbose cannot be called this way, so there is no need to log anything.
	}

	// Load the config files
	this.conf = new Config();

};
util.inherits(Generator, yeoman.generators.Base);

// Ask the user what they want done
Generator.prototype.details = function() {

	// This is an async step
	var done = this.async(),
		me = this;

	// Display welcome message
	this.logger.log(art.wp, {logPrefix: ''});

	// Get the current version number of wordpress
	this.logger.verbose('Getting current WP version');
	wordpress.getCurrentVersion(function(err, ver) {
		if (err) me.logger.warn('Error getting WP versions.  Falling back to ' + ver);
		me.logger.verbose('Got current WP version: ' + ver);
		me.conf.set('wpVer', ver);
		getInput();
	});

	// Get the input
	function getInput() {
		me.prompt(require('./prompts')(me.options.advanced, me.conf.get()), function(input) {
			me.prompt([{
				message: 'Does this all look correct?',
				name: 'confirm',
				type: 'confirm'
			}], function(i) {
				if (i.confirm) {
					// Set port
					var portRegex = /:[\d]+$/;
					var port = input.url.match(portRegex);
					if (port) input.port = port[0].replace(':', '');

					// Remove port from url
					input.url = input.url.replace(portRegex, '');

					// Create a wordpress site instance
					me.wpSite = new wp.Site({
						contentDirectory: input.contentDir,
						wpBaseDirectory: input.wpDir,
						databaseCredentials: {
							host: 'localhost',
							user: 'root',
							password: input.dbPassLocal,
							name: input.dbName,
							prefix: input.tablePrefix,
						}
					});

					// Save the users input
					me.conf.set(input);
					me.logger.verbose('User Input: ' + JSON.stringify(me.conf.get(), null, '  '));
					me.logger.log(art.go, {logPrefix: ''});
					done();
				} else {
					console.log();
					getInput();
				}
			});
		});
	}

};

// .gitignore
Generator.prototype.ignore = function() {
	var done = this.async();
	if (this.conf.get('git')) {
		this.logger.verbose('Copying .gitignore file');
		this.copy('gitignore.tmpl', '.gitignore');
		this.logger.verbose('Done copying .gitignore file');
	}
	done();
};

// Git setup
Generator.prototype.git = function() {

	if (this.conf.get('git')) {
		var done = this.async(),
			me = this;

		this.logger.log('Initializing Git');
		git.init(function(err) {
			if (err) me.logger.error(err);

			me.logger.verbose('Git init complete');
			git.add('.', function(err) {
				if (err) me.logger.error(err);
			}).commit('Initial Commit', function(err, d) {
				if (err) me.logger.error(err);

				me.logger.verbose('Git add and commit complete: ' + JSON.stringify(d, null, '  '));
				done();
			});
		});
	}

};

// Install wordpress
Generator.prototype.wordpress = function() {
	var done = this.async();

	this.logger.log('Copying Wordpress & Plugin configs');

	this.template('composer.json.tmpl', 'composer.json');

	this.directory('config', 'config');

	var pluginDir = this.conf.get('webDir') + '/' + this.conf.get('contentDir') + '/plugins/';

	this.directory('plugins', pluginDir);

	var muPluginDir = this.conf.get('webDir') + '/' + this.conf.get('contentDir') + '/mu-plugins/';

	this.directory('mu-plugins', muPluginDir);

	done();
};


// Setup custom directory structure
Generator.prototype.custom = function() {

	var me = this,
			done = this.async();

	if(this.conf.get('ftp')){
		this.template('dploy.yaml.tmpl', 'dploy.yaml');
	}

	this.template('humans.txt.tmpl', this.conf.get('webDir') + '/' + 'humans.txt');
	this.template('README.md.tmpl', 'README.md');


	this.template('.htaccess.tmpl', this.conf.get('webDir') + '/' + '.htaccess');

	this.logger.verbose('Copying index.php');
	this.template('index.php.tmpl', me.conf.get('webDir') + '/' + 'index.php');

	this.logger.log('Setting up the content directory');
	this.template('blank.php.tmpl', me.conf.get('webDir') + '/' + me.conf.get('contentDir') + '/themes/index.php');
	this.template('blank.php.tmpl', me.conf.get('webDir') + '/' + me.conf.get('contentDir') + '/uploads/index.php');
	me.logger.verbose('Content directory setup');

	done();

};

// wp-config.php
Generator.prototype.config = function() {

	var done = this.async(),
		me   = this;

	this.logger.log('Getting salt keys');
	wp.misc.getSaltKeys(function(err, saltKeys) {
		if (err) {
			me.logger.error('Failed to get salt keys, remember to change them.');
		}
		me.logger.verbose('Salt keys: ' + JSON.stringify(saltKeys, null, '  '));
		me.conf.set('saltKeys', saltKeys);
		me.logger.verbose('Copying .env files for WP');
		me.template('.env.testing.tmpl', '.env.testing');
		me.template('.env.example.tmpl', '.env.example');
		me.template('.env.tmpl', '.env');
		me.template('wp-config.php.tmpl', me.conf.get('webDir') + '/wp-config.php');

		done();
	});

};


// Front-end build scripts
Generator.prototype.themeSetup = function() {

		var done = this.async()

		this.logger.log('Setting up NPM Build scripts');

		var directories = { contentdir: this.conf.get('contentDir'), themedir: this.conf.get('themeDir'), webdir: this.conf.get('webDir') };

		this.template('package.json.tmpl', 'package.json', {contentdir: this.conf.get('contentDir'), webdir: this.conf.get('webDir'), themedir: this.conf.get('themeDir'), author: this.conf.get('author'), title: this.conf.get('title')});
		// this.template('postcss.config.js.tmpl', 'postcss.config.js', {contentdir: this.conf.get('contentDir'), webdir: this.conf.get('webDir'), themedir: this.conf.get('themeDir'), author: this.conf.get('author'), title: this.conf.get('title')});
		this.directory('gulpfile.js', 'gulpfile.js');
		this.template('task-config.js.tmpl', 'gulpfile.js/task-config.js');
		this.template('path-config.json.tmpl', 'gulpfile.js/path-config.json');

		// this.bulkDirectory('src', 'src');
		this.directory('src', 'src');

		mkdirp.sync('src/fonts');

		var themeDir = this.conf.get('webDir') + '/' + this.conf.get('contentDir') + '/themes/' + this.conf.get('themeDir');
		//this.bulkDirectory('theme', themeDir);
		this.directory('theme', themeDir);

		mkdirp.sync(themeDir+'/assets/fonts');
		mkdirp.sync(themeDir+'/assets/images');
		mkdirp.sync(themeDir+'/assets/stylesheets');

		this.logger.verbose('Build scripts are set up!');

		done();
};



Generator.prototype.packages = function() {

	var done = this.async(),
			me = this;

	this.logger.log('Setting up dependencies');

	this.spawnCommand('composer', ['install']);

	this.spawnCommand('yarn', ['install']);

	done();
}


// Set some permissions
Generator.prototype.permissions = function() {

	var done = this.async()

	if (fs.existsSync(this.conf.get('webDir'))) {
		this.logger.log('Setting Permissions: 0755 on ' + this.conf.get('webDir'));
		wrench.chmodSyncRecursive(this.conf.get('webDir'), 0755);
		this.logger.verbose('Done setting permissions on ' + this.conf.get('webDir'));
	}

	if (fs.existsSync(this.conf.get('webDir') + '/' + this.conf.get('contentDir'))) {
		this.logger.log('Setting Permissions: 0775 on ' + this.conf.get('webDir') + '/' + this.conf.get('contentDir'));
		wrench.chmodSyncRecursive(this.conf.get('webDir') + '/' + this.conf.get('contentDir'), 0775);
		this.logger.verbose('Done setting permissions on ' + this.conf.get('webDir') + '/' + this.conf.get('contentDir'));
	}

	done();
};


// Check that the database exists, create it otherwise
Generator.prototype.database = function() {

	var done = this.async(),
	me = this;

	this.logger.log('Attempting to create database');

	this.wpSite.database.createIfNotExists((err) => {
		if (err) {
  		me.logger.warn('Cannot access database');
			me.logger.warn('Make sure you create the database and update the credentials in the wp-config.php');
		}
		done();
	});

};



// Save settings to .wp-init file
Generator.prototype.saveSettings = function() {
	this.logger.log('Writing .wp-init file');
	fs.writeFileSync('.persona-init', JSON.stringify(this.conf.get(), null, '\t'));
};

// All done
Generator.prototype.finished = function() {
	this.logger.log(chalk.bold.green('\nAlmost done! Running yarn & composer install..\n------------------------\n'), {logPrefix: ''});
};
