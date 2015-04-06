(function () {
	'use strict';

	var Alicatejs = require('alicatejs');
	var View = Alicatejs.View;
	var Container = Alicatejs.Container;
	var Input = Alicatejs.Input;
	var Model = Alicatejs.Model;
	var Repeater = Alicatejs.Repeater;
	var Label = Alicatejs.Label;
	var Button = Alicatejs.Button;
	var Component = Alicatejs.Component;

	var Main = require('./main-component');
	var Footer = require('./footer-component');
	var utils = require('./utils');
	var constants = require('./constants');

	var displayFilter = {filter: constants.SHOW_ALL};

	var todoModel = new Model();
	var todosModel = new Model({data: []});

	var count = 0;
	var todoItemsList = [];

	var todos = (Main)(todosModel, todoItemsList, displayFilter);
	var footer = (Footer)(todosModel, todoItemsList, displayFilter);

	var todoInput = new Input({
		id: 'new-todo',
		model: todoModel
	}).on('keyup', function (e) {
			if (e.keyCode !== constants.ENTER_KEY) {
				return;
			}

			if (this.model.get() &&
				this.model.get().length > 0) {
				todoItemsList.push({
					val: this.model.get(),
					id: count++,
					completed: false
				});
			}

			todoModel.set("");
			todosModel.set([]);
			todosModel.set(utils.getItemsToDisplay(todoItemsList, displayFilter.filter));

			todos.setVisible(true);
			footer.setVisible(true);
		});

	module.exports = View.extend({
		templateName: 'js/todo-view/todo-view.html',
		children: [
			todoInput,
			todos,
			footer
		]
	});
})();
