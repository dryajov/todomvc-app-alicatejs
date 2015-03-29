(function (window) {
	'use strict';

	var Alicatejs = require('alicatejs');
	var TodoView = require('./todo-view/todo-view');
	var templates = require('./templates.js');

	var AlicateApp = Alicatejs.AlicateApp;

	var app = new AlicateApp({
		$selector: '.todoapp',
		templateStore: templates,
		index: 'index.html'
	});

	app.mount('index.html', new TodoView()).start();

})(window);
