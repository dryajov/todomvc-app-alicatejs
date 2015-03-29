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
	var Toggle = Alicatejs.Toggle;
	var Component = Alicatejs.Component;

	var todoModel = new Model();
	var todosModel = new Model({data: []});

	var count = 0;
	var todo = new Input({
		id: 'new-todo',
		model: todoModel
	}).on('blur', function () {
			var curItems = todosModel.get();
			if (this.model.get() &&
				this.model.get().length > 0) {
				curItems.push({
					val: this.model.get(),
					id: count++,
					completed: false
				});
			}

			todoModel.set("");
			todosModel.set([]);
			todosModel.set(curItems);

			//todos.setVisible(true);
			todos.render();
			footer.render();
		});

	var todosList = new Repeater({
		id: 'todo-list',
		model: todosModel,
		onItemRender: function (item) {
			var that = this;
			var isEdit = false;
			var completed = false;
			var itemModel = new Model({data: item.getModelData().val});

			var editItem = new Input({
				id: 'todo-edit',
				model: itemModel,
				isVisible: function () {
					return this.visible = that.isEdit;
				}
			}).on('blur', function () {
					itemText.text = this.getModelData();
					item.getModelData().val = this.getModelData();
					that.isEdit = false;
					this.parent.render();
				});

			var CompletedToggle = new Toggle({
				id: 'todo-completed',
				checked: completed
			}).on('click', function () {
					completed = !completed;
					this.parent.$el.toggleClass('completed',
						completed);
					for (var i in todosModel.get()) {
						if (todosModel.get()[i].id === item.getModelData().id) {
							todosModel.get()[i].completed = completed;
						}
					}

					item.getModelData().completed = completed;
				});

			item.add(CompletedToggle);

			var itemText = new Label({
				id: 'todo-item',
				text: itemModel.get()
			}).on('click', function (e) {
					this.setVisible(false);
					that.isEdit = true;
					editItem.render();
				});
			item.add(itemText);

			item.add(new Button({
				id: 'todo-remove'
			}).on('click', function (e) {
					var todoItems = todosModel.get();
					todosModel.set([]);
					for (var i = 0; i <= todoItems.length; i++) {
						if (todoItems[i].id === item.getModelData().id) {
							todoItems.splice(i, 1);
							todosModel.set(todoItems);
							break;
						}
					}
					footer.render();
				}));

			item.add(editItem);

			if (item.getModelData().completed) {
				item.$el.toggleClass('completed',
					true);
				CompletedToggle.toggle(true);
			}
		}
	});

	var todos = new Container({
		id: 'todos',
		children: [
			todosList
		],
		isVisible: function () {
			return this.visible = todosModel.get()
			&& todosModel.get().length > 0;
		}
	});

	var footer = new Container({
		id: 'footer',
		isVisible: function () {
			return this.visible = todosModel.get()
			&& todosModel.get().length > 0;
		},
		children: [
			new Component({
				id: 'all'
			}),
			new Component({
				id: 'active'
			}),
			new Component({
				id: 'completed'
			}),
			new Component({
				id: 'clear'
			})
		]
	});

	module.exports = View.extend({
		templateName: 'js/todo-view/todo-view.html',
		children: [
			todo,
			todos,
			footer
		]
	});
})();
