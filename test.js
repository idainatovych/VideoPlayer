var child = require('child_process'),
	html5Lint = require('html5-lint'),
	jsLintStream = require('jslint').LintStream,
	options = {
		"edition": 'latest',
    	"length": 80
	},
	jsLint = new jsLintStream(options),
	fs = require('fs'),
	path = require('path'),
	htmlLinterFunc,
	cssLinterFunc,
	jsLinterFunc,
	getDimension;

/* Get files with defined dimension
*	@param {string} dimension - dimension of file you want to find
*	@param {string} dir - directory in which searching should be done
*	@callback callback - callback operating with obtained files 
**/

getFiles = function (dimension, dir, callback) {

	fs.readdir(dir, function (err, files) {
		if(err) {
			console.log('There\'s an error. Please try to check directory');
		} else {
			var returnFiles = [];

			// Traversing all files in current working directory
			for(var i = 0, length = files.length; i < length; i += 1) {
				var ext = path.extname(files[i]);
				// get extension w/o the 'dot' symbol

				ext = ext.slice(1);
				if (ext === dimension) {
					returnFiles.push(files[i]);
				}
			}

			if(typeof callback === 'function') {
				callback(returnFiles);
			}
		}
	});

	return this;
};


/* Checking code style for CSS
*	@param {object} error - error object
*	@param {object} stdout - output stream
*	@param {object} stderr - error stream
**/

/* Wrapper for CSS lint function 
* @callback callback - next callback in the flow
*/

cssLinterFunc = function (directory, callback) {
	var stdout = child.execSync('csslint ' + directory);

	if (stdout) {
		console.log('Running CSS Code Styler\n');
		console.log('After running of the CSS Code style:\n' + stdout.toString());
		console.log('/----------------------------------------------------/\n');
	}

	if (typeof callback === 'function') {
		callback();
	}
}

/* Checking code style for HTML
*	@param {string} directory - directory in which function should watch files
*	@callback - next function
**/

htmlLinterFunc = function (directory, callback) {

	// Running HTML linter here
	getFiles('html', directory, function (htmlFiles) {
		console.log('Running HTML5 Linter\n');

		// Preventing for duplicating of slashes
		var separator = directory.slice(-1) === '/' ? '' : '/'; 

		htmlFiles.forEach(function (file) {
			var html = fs.readFileSync(directory + separator + file, 'utf-8');
			html5Lint(html, function (err, results) {
				var fileTitle = file;
				console.log('Results for \'%s\': \n', fileTitle);
				results.messages.forEach(function (msg) {
					var type = msg.type,
					message = msg.message;
					console.log('HTML5 Linter message [%s]: %s \n', type, message);
				});
			});
		});
	});

	if(typeof callback === 'function') {
		callback();
	}
};

/* Checking code style for JS
*	@param {string} directory - directory in which function should watch files
*	@callback callback - next callback in the flow
**/

jsLinterFunc = function (directory, callback) {

	getFiles('js', directory, function (jsFiles) {
		console.log('Running JavaScript Linter\n');

		// Preventing for duplicating of slashes
		var separator = directory.slice(-1) === '/' ? '' : '/'; 
		
		jsFiles.forEach(function (file)  {
			var js = fs.readFileSync(directory + separator + file, 'utf-8');
			jsLint.write({'file': file, 'body': js});
		});
	});

	if(typeof callback === 'function') {
		callback();
	}
}

jsLint.on('data', function (chunk) {
	jsLint.data += chunk;
	chunk.linted.errors.forEach(function(x) {
		var id;

		// If an element is not equal to null then an it is an error instance
		if(x !== null) {
			id = x.id || 'Result';
			console.log('%s: %s at line %s and character %s', id, x.reason, x.line, x.character);
		}
	});
	console.log('/--------------------------------------------------/\n')
});

jsLinterFunc('./js', function () {
	cssLinterFunc('./styles/*', function () {
		htmlLinterFunc('./');
	});
});