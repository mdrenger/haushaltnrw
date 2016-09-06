/**
 * Creates the filter object for the current filter form options
 *
 * @return Object
 */
function runFilter() {
	// Get the input fields
	var startBox = Ext.get('data_start').dom;
	var limitBox = Ext.get('data_limit').dom;

	// Einzelplan
	var element = document.getElementsByName('einzelplan[]');
	var einzelplan = [];

	for (var i = 0; i < element.length; i++) {
		einzelplan[i] = element[i].checked ? element[i].value : false;
	}

	var epAll = document.getElementsByName('einzelplan')[0].checked ? true : false;

	var kapitel = getFilterState('kapitel');
	var gruppe = getFilterState('gruppe');
	var zaehlnr = getFilterState('zaehlnr');
	var funktion = getFilterState('funktion');

	var limit = null;

	//if (g_data_type == 'hhr') {
		var limitField = document.getElementsByName('nav_limit_from')[0];

		if (limitField.value != '') {
			limit = [document.getElementsByName('nav_limit_by')[0].value, parseInt(limitField.value, 10)];
		}
	//}

	var type = null;

	if (g_data_type == 'hhp') {
		var typeField = document.getElementsByName('type_limit')[0];

		if (typeField.value != '') {
			type = typeField.value;
		}
	}

	// Create the filter object
	var filter = {
		min: startBox.value,
		max: limitBox.value,
		einzelplan: einzelplan,
		epAll: epAll,
		kapitel: kapitel,
		gruppe: gruppe,
		zaehlnr: zaehlnr,
		funktion: funktion,
		limit: limit,
		type: type
	};

	return filter;
}

/**
 * Get the current filter settings
 *
 * @param string name
 * @return array|null
 */
function getFilterState(name) {
	var fieldValues = [];
	var c = 0;

	// Get the select boxes values
	for (var i = 1; i <= g_maxFormFields; i++) {
		if (Ext.get(name + 'Text' + i).dom.value) {
			fieldValues[c++] = Ext.get(name + 'Text' + i).dom.value;
		}
	}

	var fieldStates = [];
	var c = 0;

	// Get the radio button values
	for (var i = 1; i < g_maxFormFields; i++) {
		if (document.getElementsByName(name + 'Radio' + i)[0].checked) {
			fieldStates[c++] = 1;
		} else if (document.getElementsByName(name + 'Radio' + i)[1].checked) {
			fieldStates[c++] = 2;
		}
	}

	var result = [];
	result['values'] = fieldValues;
	result['states'] = fieldStates;

	// Check for empty arrays
	if (fieldValues.length == 0 && fieldStates.length == 0) {
		return null;
	}

	return result;
}