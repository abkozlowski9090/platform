module.exports = function(advanced, defaults) {

	// Validate required
	var requiredValidate = function(value) {
		if (value == '') {
			return 'This field is required.';
		}
		return true;
	};
	// When advanced
	var advancedWhen = function() {
		return advanced;
	};

	var password = function(length){
    var charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
	}

	return [
		{
			message: 'Project title (with spaces)',
			name: 'title',
			default: defaults.title || 'Title'
		},
		{
			message: 'Local URL',
			name: 'url',
			default: defaults.url || function(res){
				return 'http://' + res.title.toLowerCase().replace(/ /g,'').replace(/[^\w-]+/g,'') + '.test';
			},
			validate: requiredValidate,
			filter: function(value) {
				value = value.replace(/\/+$/g, '');
				if (!/^http[s]?:\/\//.test(value)) {
					value = 'http://' + value;
				}
				return value;
			}
		}, {
			message: 'WordPress Version',
			name: 'wpVer',
			default: defaults.wpVer || null,
			validate: requiredValidate,
			when: advancedWhen,
		}, {
			message: 'Language',
			name: 'wpLang',
			default: defaults.wplang || null,
			when: advancedWhen,
		}, {
			message: 'Use Git?',
			name: 'git',
			default: defaults.git || 'Y',
			type: 'confirm'
		},{
			message: 'Web root directory',
			name: 'webDir',
			default: defaults.webDir || 'web',
		}, {
			message: 'WordPress install directory',
			name: 'wpDir',
			default: defaults.wpDir || 'wp'
		}, {
			message: 'WordPress content directory',
			name: 'contentDir',
			default: defaults.contentDir || 'app',
			validate: requiredValidate
		},{
			message: 'Install a custom theme?',
			name: 'installTheme',
			type: 'confirm',
			default: (typeof defaults.installTheme !== 'undefined') ? defaults.installTheme : true,
			when: function() {
				return (advanced);
			}
		}, {
			message: 'Theme name',
			name: 'themeDir',
			default: defaults.themeDir || function(res){
				return res.title.toLowerCase().replace(/ /g,'').replace(/[^\w-]+/g,'');
			},
			validate: requiredValidate
		}, {
			message: 'Theme source type (git/tar)',
			name: 'themeType',
			default: defaults.themeType || 'git',
			validate: function(value) {
				if (value != '' && /^(?:git|tar)$/.test(value)) {
					return true;
				}
				return false;
			},
			when: function(res) {
				return !!res.installTheme;
			}
		}, {
			message: 'GitHub username',
			name: 'themeUser',
			default: defaults.themeUser || 'paul_crookell',
			validate: requiredValidate,
			when: function(res) {
				return !!res.installTheme && res.themeType == 'git';
			}
		}, {
			message: 'GitHub repository name',
			name: 'themeRepo',
			default: defaults.themeRepo || 'WP-init',
			validate: requiredValidate,
			when: function(res) {
				return !!res.installTheme && res.themeType == 'git';
			}
		}, {
			message: 'Repository branch',
			name: 'themeBranch',
			default: defaults.themeBranch || 'master',
			validate: requiredValidate,
			when: function(res) {
				return !!res.installTheme && res.themeType == 'git';
			}
		}, {
			message: 'Use FTP?',
			name: 'ftp',
			type: 'confirm',
			default: defaults.ftp || false
		}, {
			message: 'Remote URL',
			name: 'ftpUrl',
			default: function(res){
				return defaults.ftpUrl || 'http://qa-' + res.url.replace('http://','') + '.persona.studio';
			}
		}, {
			message: 'Remote FTP host',
			name: 'ftpHost',
			default: defaults.ftpHost || '31.222.153.166',
			when: function(res){
				return !!res.ftp;
			}
		}, {
			message: 'Remote FTP username',
			name: 'ftpUser',
			default: function(res){
				return res.themeDir;
			},
			when: function(res){
				return !!res.ftp;
			}
		}, {
			message: 'Remote FTP password',
			name: 'ftpPass',
			default: password(12),
			when: function(res){
				return !!res.ftp;
			}
		}, {
			message: 'Remote web root',
			name: 'ftpDir',
			default: defaults.ftpDir || 'httpdocs',
			when: function(res){
				return !!res.ftp;
			}
		}, {
			message: 'Table prefix',
			name: 'tablePrefix',
			default: defaults.tablePrefix || 'wp_',
			validate: requiredValidate
		}, {
			message: 'Database name',
			name: 'dbName',
			default: defaults.dbName || function(res){
				return res.themeDir;
			},
			validate: requiredValidate
		}, {
			message: 'Local MySQL password',
			name: 'dbPassLocal',
			default: defaults.dbPassLocal || function(res){
				return 'root';
			}
		}, {
			message: 'Remote database host',
			name: 'dbHost',
			default: defaults.dbHost || '127.0.0.1',
			validate: requiredValidate
		},{
			message: 'Remote database user',
			name: 'dbUser',
			default: defaults.dbUser || function(res){
				return 'root';
			},
			validate: requiredValidate
		}, {
			message: 'Remote database password',
			name: 'dbPass',
			default: defaults.dbPass || password(12)
		}, {
			message: 'Author (for humans.txt)',
			name: 'author',
			default: defaults.author || 'Persona Studio'
		}, {
			message: 'Your Twitter handle (for humans.txt)',
			name: 'twitter',
			default: defaults.twitter || 'personastudiouk'
		}, {
			message: 'Your URL (for humans.txt)',
			name: 'humansurl',
			default: defaults.humansurl || 'http://persona.studio'
		},
	];
};
