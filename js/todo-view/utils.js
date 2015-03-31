(function () {
	'use strict';

	module.exports = {
		countItems: function countItems(todoItemsList, completed) {
			var count = 0;
			if (completed == null) {
				completed = false;
			}

			for (var i in todoItemsList) {
				if (todoItemsList[i].completed === completed) {
					count++;
				}
			}

			return count;
		}
	};

})();
