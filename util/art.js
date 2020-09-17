var chalk = require('chalk');

// Rainbow display
var rainbowColors = [
	chalk.red,
	chalk.yellow,
	chalk.green,
	chalk.blue,
	chalk.magenta
];
chalk.rainbow = function(str) {
	var arStr = str.split(''),
		out = '';
	for (var i in arStr) {
		if (arStr[i] == ' ' || arStr[i] == '\t' || arStr[i] == '\n')
			out += arStr[i];
		else
			out += rainbowColors[i % rainbowColors.length](arStr[i]);
	}
	return out;
};

module.exports = {
	wp : chalk.rainbow("WP-Init generator").toString(),
	go : "Installing!",
	wawa : chalk.red("Error!")
};
