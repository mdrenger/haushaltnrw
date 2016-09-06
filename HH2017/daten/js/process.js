// This is our backup data
var origData = Data;

var origDataEinzelplan = DataEinzelplan;
var origDataKapitel = DataKapitel;
var origDataGruppe = DataGruppe;
var origDataZaehlnr = DataZaehlnr;
var origDataFunktion = DataFunktion;

var origDataType = DataType;

/**
 * Creates the data array according to the filter rules
 *
 * @param Object
 * @return array
 */
function processData(filter) {
	// Apply range filter
	var min = filter.min > 0 ? filter.min - 1 : 1;
	var max = filter.max;

	var tmp = [];
	var c = 0;
	Data = tmp;
	var dIndex = null;

	for (var i = min; i < max; i++) {
		dIndex = g_data_type == 'zr' ? 0 : 1;
		
		// Einzelplan
		if (filter.einzelplan && filter.epAll == false) {
			if (!isValidEP(origData[i][dIndex], filter.einzelplan)) {
				continue;
			}
		}
		
		dIndex++;
		
		// Kapitel
		if (filter.kapitel) {
			if (!isValid(origData[i][dIndex], filter.kapitel)) {
				continue;
			}
		}
		
		dIndex++;

		// Gruppe
		if (filter.gruppe) {
			if (!isValid(origData[i][dIndex], filter.gruppe)) {
				continue;
			}
		}
		
		dIndex++;

		// Zaehlnr
		if (filter.zaehlnr) {
			if (!isValid(origData[i][dIndex], filter.zaehlnr)) {
				continue;
			}
		}

		dIndex++;
		
		// Funktion
		if (filter.funktion) {
			if (!isValid(origData[i][dIndex], filter.funktion)) {
				continue;
			}
		}

		if (filter.limit) {
			if ((filter.limit[1] == 0 || filter.limit[1]) && parseInt(origData[i][filter.limit[0]], 10) < parseInt(filter.limit[1], 10)) {
				if ((filter.limit[0] == 9 || filter.limit[0] == 11) && parseInt(origData[i][filter.limit[0]], 10) > parseInt(filter.limit[1], 10) * -1) {
					continue;
				} else if (filter.limit[0] != 9 && filter.limit[0] != 11) {
					continue;
				}
			}
		}
			
		if (filter.type && filter.type == 'VE') {
			if (parseInt(origData[i][12], 10) == 0) {
				continue;
			}
		}

		tmp[c++] = origData[i];
	}

	Data = tmp;
}

/**
 * Validates the filter
 *
 * @param mixed value
 * @param array filter
 * @return bool
 */
function isValid(value, filter) {
	for (var i = 0; i < filter['values'].length; i++) {
		if (filter['states'][i] && filter['states'][i] == 2) { // "bis"
			if (filter['values'][i+1]) {
				if (parseFloat(value) >= parseFloat(filter['values'][i]) && parseFloat(value) <= parseFloat(filter['values'][i+1])) {
					return true;
				}
			}
		} else if (filter['states'][i] && filter['states'][i] == 1) { // "und"
			if (parseFloat(value) == parseFloat(filter['values'][i])) {
				return true;
			}
		// Make sure the last box has no "bis" rule
		} else if (!filter['states'][i] && (!filter['states'][i - 1] || filter['states'][i - 1] == 1)) {
			if (parseFloat(value) == parseFloat(filter['values'][i])) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Einzelplan filter validation
 *
 * @param mixed value
 * @param array filter
 * @return
 */
function isValidEP(value, filter) {
	for (var k = 0; k < filter.length; k++) {
		if (filter[k] != false) {
			if (parseInt(filter[k], 10) == parseInt(value, 10)) {
				return true;
			}
		}
	}

	return false;
}