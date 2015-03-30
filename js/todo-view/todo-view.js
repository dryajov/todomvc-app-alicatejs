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


	var ENTER_KEY = 13;

	var todoModel = new Model();
	var todosModel = new Model({data: []});

	var count = 0;
	var todoItemsList = [];

	var comletedAll = false;
	var toggleAll = new Button({
		id: 'toggle-all',
		isVisible: function () {
			return this.visible = todoItemsList.length > 0;
		}
	}).on('click', function () {
			comletedAll = !comletedAll;
			todosModel.set([]);
			for (var i in todoItemsList) {
				todoItemsList[i].completed = comletedAll;
			}
			todosModel.set(todoItemsList);
			footer.render();
		});

	var todoInput = new Input({
		id: 'new-todo',
		model: todoModel
	}).on('keyup', function (e) {
			if (e.keyCode !== ENTER_KEY) {
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
			todosModel.set(todoItemsList);

			todos.setVisible(true);
			footer.setVisible(true);
		});

	var todosList = new Repeater({
		id: 'todo-list',
		model: todosModel,
		onItemRender: function (item) {
			var that = this;
			var completed = item.getModelData().completed;
			var itemModel = new Model({data: item.getModelData().val});

			var editItem = new Input({
				id: 'todo-edit',
				model: itemModel,
				isVisible: function () {
					return this.visible = that.isEdit;
				}
			}).on('keyup', function (e) {
					if (e.keyCode !== ENTER_KEY) {
						return;
					}

					itemText.text = this.getModelData();
					item.getModelData().val = this.getModelData();
					that.isEdit = false;
					this.parent.render();
				});

			var completedToggle = new Button({
				id: 'todo-completed',
				checked: completed,
				selectedClass: 'completed'
			}).on('click', function () {
					completed = !completed;
					for (var i in todoItemsList) {
						if (todoItemsList[i].id === item.getModelData().id) {
							todoItemsList[i].completed = completed;
							break;
						}
					}
					item.getModelData().completed = completed;
					this.toggle();

					item.$el.toggleClass('completed',
						completed);

					footer.render();
				});

			item.add(completedToggle);

			var itemText = new Label({
				id: 'todo-item',
				text: itemModel.get()
			}).on('dblclick', function (e) {
					this.setVisible(false);
					that.isEdit = true;
					editItem.render();
				});
			item.add(itemText);
			item.on('mouseenter', function () {
				removeTodoVisible = true;
				removeTodo.render();
			}).on('mouseexit', function () {
				removeTodoVisible = false;
				removeTodo.render();
			});

			var removeTodoVisible = false;
			var removeTodo = new Button({
				id: 'todo-remove',
				isVisible: function () {
					return removeTodoVisible;
				}
			}).on('click', function (e) {
					todosModel.set([]);
					var i = todoItemsList.length;
					while (i--) {
						if (todoItemsList[i].id === item.getModelData().id) {
							todoItemsList.splice(i, 1);
							todosModel.set(todoItemsList);
							break;
						}
					}
					todos.render();
					footer.render();
				});

			removeTodo.setVisible(false);
			item.add(removeTodo);

			item.add(editItem);

			if (item.getModelData().completed) {
				item.$el.toggleClass('completed',
					true);
			}
		}
	});

	var todos = new Container({
		id: 'todos',
		children: [
			todosList,
			toggleAll
		],
		isVisible: function () {
			return this.visible = todoItemsList.length > 0;
		}
	});

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
			return countCompleted() > 0;
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
			todosList.render();
			footer.render();
			todos.render();
		});

	var remaining = new Label({
		id: 'left',
		model: new Model({data: {count: 0}}),
		text: "{count}",
		onPreRender: function () {
			this.model.data.count = countActive();
		}
	});

	var pluralize = new Label({
		id: 'pluralize',
		model: new Model(),
		onPreRender: function () {
			var active = countActive();
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

	function countActive() {
		var count = 0;
		for (var i in todoItemsList) {
			if (todoItemsList[i].completed === false) {
				count++;
			}
		}

		return count;
	}

	function countCompleted() {
		var count = 0;
		for (var i in todoItemsList) {
			if (todoItemsList[i].completed === true) {
				count++;
			}
		}

		return count;
	}

	module.exports = View.extend({
		templateName: 'js/todo-view/todo-view.html',
		children: [
			todoInput,
			todos,
			footer
		]
	});
})();
