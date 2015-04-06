module.exports = function (todosModel, todoItemsList, displayFilter) {
	'use strict';

	var Alicatejs = require('alicatejs');
	var Container = Alicatejs.Container;
	var Model = Alicatejs.Model;
	var Label = Alicatejs.Label;
	var Component = Alicatejs.Component;

	var utils = require('./utils');
	var constants = require('./constants');

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
			displayFilter.filter = constants.SHOW_ALL;
		});

	var active = new Component({
		id: 'active'
	}).on('click', function () {
			todosModel.set(utils.getByState(todoItemsList, false));
			setActiveClass(this);
			displayFilter.filter = constants.SHOW_ACTIVE;
		});

	var completed = new Component({
		id: 'completed'
	}).on('click', function () {
			todosModel.set(utils.getByState(todoItemsList));
			setActiveClass(this);
			displayFilter.filter = constants.SHOW_COMPLETED;
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

			todosModel.set(utils.getItemsToDisplay(todoItemsList,
				displayFilter.filter));
		});

	var remaining = new Label({
		id: 'left',
		model: new Model({data: 0}),
		onPreRender: function () {
			this.model.data = utils.countItems(todoItemsList, false);
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
