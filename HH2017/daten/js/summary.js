/**
 * Calculates number of entries
 *
 * @param v
 * @param params
 * @param data
 * @return
 */
function summaryCount(v, params, data) {
	return '<div style="white-space:nowrap;position:relative">Summe Einnahmen</div><div style="white-space:nowrap;position:relative">Summe Ausgaben</div>';
}

/**
 * Prints the row sum
 *
 * @param v
 * @param params
 * @param data
 * @return
 */
function summaryDetailSum(v, params, data) {
	return (calculateIncomings(params.id, true, false) + '<br/>' + calculateOutgoings(params.id, true, false));
}

/**
 * Prints the row sum
 *
 * @param v
 * @param params
 * @param data
 * @return
 */
function summarySum(v, params, data) {
	return (calculateIncomings(params.id, false, false) + '<br/>' + calculateOutgoings(params.id, false, false));
}

/**
 * Calculates the income
 *
 * @param int index
 * @return float
 */
function calculateIncomings(index, renderDetail, print) {
	var result = 0;
	var newValue;

	for (var i = 0; i < Data.length; i++) {
		newValue = null;
		
		if (Data[i][index] == '-') {
			newValue = 0;
		}
		
		if (parseInt(Data[i][g_data_type == 'zr' ? 2 : 3], 10) < 400) {
			if (newValue != null) {
				result += 0.0;
			} else {
				result += parseFloat(Data[i][index]);
			}
		}
	}

	result = Math.round(result * 100) / 100;

	if (renderDetail) {
		if (g_print && print) {
			return result;
		}
		
		return renderDetailValue(result);
	}

	result = Math.round(result);
	
	if (g_print && print) {
		return result;
	}
	
	return renderValue(result);
}

/**
 * Calculates the outgoing
 *
 * @param int index
 * @return float
 */
function calculateOutgoings(index, renderDetail, print) {
	var result = 0;
	var newValue = null;

	for (var i = 0; i < Data.length; i++) {
		newValue = null;
		
		if (Data[i][index] == '-') {
			newValue = 0;
		}
		
		if (parseInt(Data[i][g_data_type == 'zr' ? 2 : 3], 10) >= 400) {
			if (newValue != null) {
				result += 0.0;
			} else {
				result += parseFloat(Data[i][index]);
			}
		}
	}

	result = Math.round(result * 100) / 100;

	if (renderDetail) {
		if (g_print && print) {
			return result;
		}

		return renderDetailValue(result);
	}

	result = Math.round(result);

	if (g_print && print) {
		return result;
	}

	return renderValue(result);
}
 
function printSummaryDetailSum(id) {
	return (calculateIncomings(id, true, true) + '<br/>' + calculateOutgoings(id, true, true));
}

function printSummarySum(id) {
	return (calculateIncomings(id, false, true) + '<br/>' + calculateOutgoings(id, false, true));
}

function summaryPercent(id) {
	var result = 0;
	
	for (var i = 0; i < Data.length; i++) {
		if (parseInt(Data[i][3], 10) < 400) {
			result += parseFloat(Data[i][7]);
		}
	}

	var incNeu = result;

	var result = 0;

	for (var i = 0; i < Data.length; i++) {
		if (parseInt(Data[i][3], 10) >= 400) {
			result += parseFloat(Data[i][7]);
		}
	}

	var outNeu = result;
	
	var result = 0;
	
	for (var i = 0; i < Data.length; i++) {
		if (parseInt(Data[i][3], 10) < 400) {
			result += parseFloat(Data[i][8]);
		}
	}

	var incAlt = result;

	var result = 0;

	for (var i = 0; i < Data.length; i++) {
		if (parseInt(Data[i][3], 10) >= 400) {
			result += parseFloat(Data[i][8]);
		}
	}

	var outAlt = result;

	var incRes = incNeu-incAlt;
	
	if (incRes != 0) {
		incRes = incRes * 100 / incNeu;
		incRes = Math.round(incRes * 10) / 10;
	}
	
	var outRes = outNeu-outAlt;
	
	if (outRes != 0) {
		outRes = outRes * 100 / outNeu;
		outRes = Math.round(outRes * 10) / 10;
	}
	
	return incRes + "<br/>" + outRes;
}

function printSummaryPercent(opt) {
	var result = 0;
	
	for (var i = 0; i < Data.length; i++) {
		if (parseInt(Data[i][3], 10) < 400) {
			result += parseFloat(Data[i][7]);
		}
	}

	var incNeu = result;

	var result = 0;

	for (var i = 0; i < Data.length; i++) {
		if (parseInt(Data[i][3], 10) >= 400) {
			result += parseFloat(Data[i][7]);
		}
	}

	var outNeu = result;
	
	var result = 0;
	
	for (var i = 0; i < Data.length; i++) {
		if (parseInt(Data[i][3], 10) < 400) {
			result += parseFloat(Data[i][8]);
		}
	}

	var incAlt = result;

	var result = 0;

	for (var i = 0; i < Data.length; i++) {
		if (parseInt(Data[i][3], 10) >= 400) {
			result += parseFloat(Data[i][8]);
		}
	}

	var outAlt = result;

	var incRes = incNeu-incAlt;
	
	if (incRes != 0) {
		incRes = incRes * 100 / incNeu;
		incRes = Math.round(incRes * 10) / 10;
	}
	
	var outRes = outNeu-outAlt;
	
	if (outRes != 0) {
		outRes = outRes * 100 / outNeu;
		outRes = Math.round(outRes * 10) / 10;
	}
	
	if (opt == 1) {
		return incRes;
	}
	
	return outRes;	
}