(function () {
	'use strict';

	var constants = require('./constants');

	function countItems(todoItemsList, completed) {
		return getByState(todoItemsList, completed).length;
	}

	function getByState(todoItemsList, done) {
		if (done === undefined || done === null) {
			done = true;
		}

		var found = [];
		for (var i in todoItemsList) {
			if (todoItemsList[i].completed === done) {
				found.push(todoItemsList[i]);
			}
		}

		return found;
	}

	function findItemById(id, todoItemsList) {
		for (var i in todoItemsList) {
			if (todoItemsList[i].id === id) {
				return todoItemsList[i];
			}
		}
	}

	function getItemsToDisplay(todoItemsList, displayFilter) {
		switch (displayFilter) {
			case constants.SHOW_ALL:
				return todoItemsList;
			case constants.SHOW_ACTIVE:
				return getByState(todoItemsList, false);
			case constants.SHOW_COMPLETED:
				return getByState(todoItemsList);
		}
	}


	module.exports = {
		countItems: countItems,
		getByState: getByState,
		findItemById: findItemById,
		getItemsToDisplay: getItemsToDisplay
	};

})();
