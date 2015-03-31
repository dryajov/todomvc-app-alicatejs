module.exports = function (todosModel, todoItemsList) {
	'use strict';

	var Alicatejs = require('alicatejs');
	var Container = Alicatejs.Container;
	var Model = Alicatejs.Model;
	var Label = Alicatejs.Label;
	var Component = Alicatejs.Component;

	var utils = require('./utils');

	function setActiveClass(active) {
		for (var i in footer.children) {
			footer.children[i].$el.removeClass('selected',
				true);
		}

		active.$el.addClass('selected');
	}

	var all = new Component({
		id: 'all'
	}).on('click', function () {
			todosModel.set(todoItemsList);
			setActiveClass(this);
		});

	var active = new Component({
		id: 'active'
	}).on('click', function () {
			var active = [];
			for (var i in todoItemsList) {
				if (todoItemsList[i].completed === false) {
					active.push(todoItemsList[i]);
				}
			}
			todosModel.set(active);
			setActiveClass(this);
		});

	var completed = new Component({
		id: 'completed'
	}).on('click', function () {
			var completed = [];
			for (var i in todoItemsList) {
				if (todoItemsList[i].completed !== false) {
					completed.push(todoItemsList[i]);
				}
			}
			todosModel.set(completed);
			setActiveClass(this);
		});

	var clear = new Component({
		id: 'clear',
		isVisible: function () {
			return utils.countItems(todoItemsList, true) > 0;
		}
	}).on('click', function () {
			todosModel.set([]);
			var len = todoItemsList.length;
			while (len--) {
				if (todoItemsList[len].completed === true) {
					todoItemsList.splice(len, 1);
				}
			}

			todosModel.set(todoItemsList);
			footer.render();
		});

	var remaining = new Label({
		id: 'left',
		model: new Model({data: {count: 0}}),
		text: "{count}",
		onPreRender: function () {
			this.model.data.count = utils.countItems(todoItemsList);
		}
	});

	var pluralize = new Label({
		id: 'pluralize',
		model: new Model(),
		onPreRender: function () {
			var active = utils.countItems(todoItemsList);
			this.model.data = active < 1 || active > 1 ? 'items' : 'item';
		}
	});

	var footer = new Container({
		id: 'footer',
		isVisible: function () {
			return this.visible = todoItemsList.length > 0;
		},
		children: [
			all,
			active,
			completed,
			clear,
			remaining,
			pluralize
		]
	});

	todosModel.subscribe(function () {
		footer.render();
	});

	return footer;
}
