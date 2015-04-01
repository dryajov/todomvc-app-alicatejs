module.exports = function (todosModel, todoItemsList) {
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
		});

	var todosList = new Repeater({
		id: 'todo-list',
		model: todosModel,
		onItemRender: function (item) {
			var that = this;
			var completed = item.getModelData().completed;
			var itemModel = new Model({data: item.getModelData().val});
			var isEdit = false;

			var editItem = new Input({
				id: 'todo-edit',
				model: itemModel,
				isVisible: function () {
					return this.visible = isEdit;
				}
			}).on('keyup', function (e) {
					if (e.keyCode !== ENTER_KEY) {
						return;
					}
					editTodoItem(this);
				})
				.on('blur', function () {
					editTodoItem(this);
				});

			function editTodoItem(elm) {
				itemText.text = elm.getModelData();
				item.getModelData().val = elm.getModelData();

				item.$el.removeClass('editing');

				isEdit = false;
				elm.parent.render();
			}

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

					todosModel.update();
				});

			item.add(completedToggle);

			var itemText = new Label({
				id: 'todo-item',
				text: itemModel.get()
			}).on('dblclick', function (e) {
					this.setVisible(false);
					isEdit = true;
					item.$el.addClass('editing');
					editItem.render();
				});
			item.add(itemText);

			var removeTodoVisible = false;
			item.on('mouseenter', function () {
				removeTodoVisible = true;
				removeTodo.render();
			}).on('mouseexit', function () {
				removeTodoVisible = false;
				removeTodo.render();
			});

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

	return todos;
}

