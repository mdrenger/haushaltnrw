var g_maxFormFields = 10;
var g_pageSize = 950;

Ext.onReady(function() {
    Ext.QuickTips.init();

    searchForm = new Ext.FormPanel({
        labelWidth: 75, // label settings here cascade unless overridden
        url: null,
        frame: true,
        width: g_pageSize,
        defaults: {width: 230},
        defaultType: 'textfield',
        items: [
            createPanel('Einzelplan', 1),
            createPanel('Kapitel', 2),
            createPanel('Gruppe', 3),
            createPanel('Z&auml;hlnr.', 4),
            createPanel('Funktion', 5)
        ],
        buttons: [
            new Ext.Panel({bodyStyle: 'border:0px; background: transparent;', html: createSubNavigation()}),
            new Ext.Panel({html:'<div class="x-btn-text" style="margin-bottom:3px;" onclick="resetForm()">Reset</div><div class="x-btn-text" onclick="runProcessing()">Auswertung</div>'})
            //{text: 'Reset', handler: resetForm},
            //{text: 'Auswerten', handler: runProcessing}
        ]
    });

    if (!Ext.isIE8) {
    	document.getElementById('form').style.marginLeft = '40';
    }

    searchForm.on('afterrender', function() { createListeners(); });
    searchForm.render(document.getElementById('form'));
    
    
});

/**
 * When changing type update limit select
 * 
 * @param type
 */
function onChangeType(type) {
	var limitBy = document.getElementById('nav_limit_by');//Ext.fly('nav_limit_by');
	var html = '';

	if (type == 'TIT') {
		limitBy.options.length = 0;
		limitBy.options[0] = new Option('Ansatz Neu', '7');
		limitBy.options[1] = new Option('Ansatz Alt', '8');
		limitBy.options[2] = new Option('Differenz', '9');
		limitBy.options[3] = new Option('Ist', '11');
	} else {
		limitBy.options.length = 0;
		limitBy.options[0] = new Option('Ansatz VE', '12');
	}
}

/**
 * Creates the sub navigation
 *
 * @return string
 */
function createSubNavigation() {
	var yearSelect = g_year_html; // defined in init.js

	if (g_data_type == 'hhr') {
		var limitSelect = '<table><tr><td class="right">Begrenzen nach <select size="1" name="nav_limit_by"><option value="7" selected="selected">Ist-Betrag</option><option value="8">Haushaltsbetrag</option><option value="9">Differenz</option><option value="10">Rechnung-Ist</option><option value="11">Gesamtsoll</option><option value="12">mehr/weniger</option></select></td></tr><tr><td class="right">ab Betrag <input type="text" size="10" name="nav_limit_from" value=""/></td></tr></table>';
		var typeSelect = '';
	} else if (g_data_type == 'zr') {
		var limitSelect = '<table><tr><td class="right">Auswertung nach Ist-Betrag</td></tr><tr><td class="left">ab Betrag <input type="text" size="10" name="nav_limit_from" value=""/></td></tr></table>';
		var typeSelect = '';
	} else {
		var limitSelect = '<table><tr><td class="right">Begrenzen nach <select size="1" name="nav_limit_by" id="nav_limit_by"><option value="7" selected="selected">Ansatz Neu</option><option value="8">Ansatz Alt</option><option value="9">Differenz</option><option value="11">Ist</option></select></td></tr><tr><td class="right">ab Betrag <input type="text" size="10" name="nav_limit_from" value=""/></td></tr></table>';
		var typeSelect = 'Typ <select size="1" name="type_limit" onchange="onChangeType(this.value)"><option value="TIT">TIT</option><option value="VE">VE</option></select>';
	}

	var showOptions = '<table><tr><td><input type="radio" name="nav_show" value="1"/> mit Detailzeilen</td></tr><tr><td><input type="radio" name="nav_show" value="2" checked="checked"/> nur Summenzeilen</td></tr></table>';

	return '<div id="subnavigation"><table><tr><td class="year">' + yearSelect + '</td><td>' + limitSelect + '</td><td>' + typeSelect + '</td><td>' + showOptions + '</td></tr></table></div>';
}

/**
 * Creates a panel for the form
 *
 * @param string title
 * @param int id
 * @return Ext.Panel
 */
function createPanel(title, id) {
	var panelHtml = '<table class="form-layout" cellspacing="0"><tr><td class="title">' + title + '</td><td class="content' + (id == 5 ? ' content-last' : '') + '"><div id="form-panel' + id + '">' + createPanelFields(id) + '</div></td></tr></table>';

    var panel = new Ext.Panel({
        renderTo: 'grid-content',
        width: (g_pageSize - 10),
        html: panelHtml
    });

	return panel;
}

/**
 * Creates the HTML for the panel
 *
 * @param int id
 * @return string
 */
function createPanelFields(id) {
	var fields = '<div class="form-all">';

	switch (id) {
		case 1:
			fields += '<div class="all-button"><span class="all"><input type="radio" name="einzelplan" value="all" checked="checked" onclick="unselectOther(true);"/> Alle</span></div>';
			for (var i = 0; i < origDataEinzelplan.length; i++) {
				fields += '<input class="form1" type="checkbox" name="einzelplan[]" value="' + origDataEinzelplan[i] + '" onclick="unselectOther(false);"/> ' + origDataEinzelplan[i];
			}
			break;
		case 2:
			fields += '<span class="all"><input type="radio" name="kapitel" value="all" checked="checked" onclick="resetForms(\'kapitel\')"/> Alle</span>';
			fields += createDynamicFields('kapitel');
			break;
		case 3:
			fields += '<span class="all"><input type="radio" name="gruppe" value="all" checked="checked" onclick="resetForms(\'gruppe\')"/> Alle</span>';
			fields += createDynamicFields('gruppe');
			break;
		case 4:
			fields += '<span class="all"><input type="radio" name="zaehlnr" value="all" checked="checked" onclick="resetForms(\'zaehlnr\')"/> Alle</span>';
			fields += createDynamicFields('zaehlnr');
			break;
		case 5:
			fields += '<span class="all"><input type="radio" name="funktion" value="all" checked="checked" onclick="resetForms(\'funktion\')"/> Alle</span>';
			fields += createDynamicFields('funktion');
			break;
	}

	fields += '</div>';

	return fields;
}

/**
 * Create the dynamic input fields
 *
 * @param string name
 * @return string
 */
function createDynamicFields(name) {
	var fields = '';

	for (var i = 1; i <= g_maxFormFields; i++) {
		fields += '<div class="floatElement select select_' + i + '"><select size="1" id="' + name + 'Text' + i + '">' + createOptions(name) + '</select></div>';

		if (i < g_maxFormFields) {
			fields += '<div class="floatElement table table_' + i + '"><table class="inline" id="' + name + 'RadioTable' + i + '"><tr><td><input type="radio" name="' +  name + 'Radio' + i + '" value="1" onclick="handleRadio(\'' + name + '\', ' + i + ')"/> und</td></tr><tr><td><input type="radio" name="' +  name + 'Radio' + i + '" value="2" onclick="handleRadio(\'' + name + '\', ' + i + ')"/> bis</td></tr></table></div>';
		}
	}

	return fields;
}

/**
 * Creates the options for the select boxes
 *
 * @param string name
 * @return string
 */
function createOptions(name) {
	var optionArray = null;

	switch (name) {
		case 'kapitel': optionArray = origDataKapitel; break;
		case 'gruppe': optionArray = origDataGruppe; break;
		case 'zaehlnr': optionArray = origDataZaehlnr; break;
		case 'funktion': optionArray = origDataFunktion; break;
		default:
			return '';
	}

	options = '<option value="">---</option>';
	var padded = null;

	for (var i = 0; i < optionArray.length; i++) {
		padded = str_pad(optionArray[i], (name != 'zaehlnr' ? 3 : 2), '0', 'STR_PAD_LEFT');

		options += '<option value="' + optionArray[i] + '">' + padded + '</option>';
	}

	return options;
}

/**
 * Creates listeners for the select boxes
 *
 */
function createListeners() {
	var names = ["kapitel", "gruppe", "zaehlnr", "funktion"];
	var name = null;

	for (var j = 0; j < names.length; j++) {
		for (var i = 1; i <= g_maxFormFields; i++) {
			name = names[j] + 'Text' + i;
			obj = new Object();
			obj.name = names[j];
			obj.index = i;
			Ext.get(name).on('change', function() { handleSelect(this.name, this.index); }, obj);
		}
		resetForms(names[j]);
	}
}

/**
 * Handles the select fields
 *
 * Show the next radio button when not empty
 * Hide the next radio button, previous radio button and itself when empty
 *
 * @param string name
 * @param int index
 */
function handleSelect(name, index) {
	var element = Ext.get(name + 'Text' + index).dom;

	if (element.value != '' && index < g_maxFormFields) { // Select box not empty and not the last box
		document.getElementsByName(name)[0].checked = false;
		Ext.get(name + 'RadioTable' + index).dom.style.display = 'block';
		Ext.get(name + 'RadioTable' + index).dom.parentNode.style.display = 'block';
	} else if (index < g_maxFormFields) { // Select box is empty
		if (index == 1) {
			document.getElementsByName(name)[0].checked = true;
		}

		for (var i = (index > 1 ? index - 1 : 1); i < g_maxFormFields; i++) {
			document.getElementsByName(name + 'Radio' + i)[0].checked = false;
			document.getElementsByName(name + 'Radio' + i)[1].checked = false;

			if (i != index - 1) {
				Ext.get(name + 'RadioTable' + i).dom.style.display = 'none';
			}
		}

		for (var i = (index < 2 ? 2 : index); i <= g_maxFormFields; i++) {
			Ext.get(name + 'Text' + i).dom.style.display = 'none';
			Ext.get(name + 'Text' + i).dom.selectedIndex = 0;
		}
	} else if (index == g_maxFormFields && element.value == '') { // Last select box is empty
		document.getElementsByName(name + 'Radio' + (index - 1))[0].checked = false;
		document.getElementsByName(name + 'Radio' + (index - 1))[1].checked = false;
		Ext.get(name + 'Text' + index).dom.style.display = 'none';
	}
}

/**
 * Handle the radio buttons
 *
 * Show the next select box if it is not visible yet
 *
 * @param string name
 * @param int index
 */
function handleRadio(name, index) {
	var select = Ext.get(name + 'Text' + (index + 1)).dom;

	if (select.style.display == 'none') {
		select.style.display = 'block';
		select.parentNode.style.display = 'block';
		select.selectedIndex = 0;
	}
}

/**
 * Reset all fields (called after rendering and when "Alle" is checked)
 *
 * Hides and unsets all select boxes and radio buttons
 *
 * @param string name
 */
function resetForms(name) {
	for (var i = 1; i <= g_maxFormFields; i++) {
		Ext.get(name + 'Text' + i).dom.selectedIndex = 0;
	}

	for (var i = 1; i < g_maxFormFields; i++) {
      	document.getElementsByName(name + 'Radio' + i)[0].checked = false;
      	document.getElementsByName(name + 'Radio' + i)[1].checked = false;
      	Ext.get(name + 'RadioTable' + i).dom.style.display = 'none';
      	Ext.get(name + 'RadioTable' + i).dom.parentNode.style.display = 'none';
	}

	for (var i = 2; i <= g_maxFormFields; i++) {
		Ext.get(name + 'Text' + i).dom.style.display = 'none';
		Ext.get(name + 'Text' + i).dom.parentNode.style.display = 'none';
	}
}

/**
 * Unselect all checkboxes when "alle" is clicked
 */
function unselectOther(all) {
	var element = document.getElementsByName('einzelplan[]');
	var einzelplan = document.getElementsByName('einzelplan')[0];

	if (all) {
		for (var i = 0; i < element.length; i++) {
			element[i].checked = false;
		}
	} else {
		var allUnchecked = true;

		for (var i = 0; i < element.length; i++) {
			if (element[i].checked) {
				allUnchecked = false;
				break;
			}
		}

		if (allUnchecked) {
			einzelplan.checked = true;
	 	} else {
	 		einzelplan.checked = false;
	 	}
	}

	document.getElementsByName('kapitel')[0].checked = true;
	resetForms('kapitel');

	limitChapters();

}

/**
 * Limits chapters (Kapitel) to the selected EPs
 */
function limitChapters() {
	var selected = null;

	if (document.getElementsByName('einzelplan')[0].checked == true) {
		selected = 'all';
	} else {
		var checkboxes = document.getElementsByName('einzelplan[]');
		selected = [];

		for (var i = 0; i < checkboxes.length; i++) {
			selected[i] = checkboxes[i].checked ? checkboxes[i].value : null;
		}
	}

	var size = 0;
	var element = null;

	var chapters = getChapters(selected);

	// Clear select boxes
	for (var i = 1; i <= g_maxFormFields; i++) {
		element = Ext.get('kapitelText' + i).dom
		size = element.options.length;

		while ((size = element.options.length) > 0) {
			element.options[size - 1] = null;
		}

		rebuildSelectBox(i, chapters);
	}	
}

function getChapters(selected) {
	if (selected == 'all') {
		var chapters = origDataKapitel;
	} else {
		var chapters = [];
		var c = 0;
		var index = g_data_type == 'zr' ? 0 : 1;

		for (var i = 0; i < origData.length; i++) {
			for (var k = 0; k < selected.length; k++) {
				if (selected[k] == null) {
					continue;
				}

				if (parseInt(origData[i][index], 10) == parseInt(selected[k], 10)) {
					if (!int_in_array(origData[i][index+1], chapters)) {
						chapters[c++] = origData[i][index+1];
					}

					break;
				}
			}
		}
	}

	chapters.sort(boxSort);
	
	return chapters;
}

/**
 * Rebuild the select box
 *
 * @param index
 * @param selected
 */
function rebuildSelectBox(index, chapters) {
	var element = Ext.get('kapitelText' + index).dom;
	element.options[element.length] = new Option('---', '', true, true);

	for (var i = 0; i < chapters.length; i++) {
		element.options[element.length] = new Option(str_pad(chapters[i], 3, '0', 'STR_PAD_LEFT'), chapters[i], false, false);
	}
}

/**
 * In array check for integers
 * @param int value
 * @param array arr
 * @return bool
 */
function int_in_array(value, arr) {
	for (var i = 0; i < arr.length; i++) {
		if (parseInt(arr[i], 10) == parseInt(value, 10)) {
			return true;
		}
	}

	return false;
}

/**
 * Pad a string to another string
 *
 * @param string input
 * @param int pad_length
 * @param string pad_string
 * @param string pad_type
 * @return
 */
function str_pad (input, pad_length, pad_string, pad_type) {
    var half = '', pad_to_go;

    var str_pad_repeater = function (s, len) {
    	var collect = '', i;

    	while (collect.length < len) {
    		collect += s;
    	}

    	collect = collect.substr(0, len);
    	return collect;
    };

    input += '';
    pad_string = pad_string !== undefined ? pad_string : ' ';

    if (pad_type != 'STR_PAD_LEFT' && pad_type != 'STR_PAD_RIGHT' && pad_type != 'STR_PAD_BOTH') {
    	pad_type = 'STR_PAD_RIGHT';
    }

    if ((pad_to_go = pad_length - input.length) > 0) {
        if (pad_type == 'STR_PAD_LEFT') {
        	input = str_pad_repeater(pad_string, pad_to_go) + input;
        } else if (pad_type == 'STR_PAD_RIGHT') {
        	input = input + str_pad_repeater(pad_string, pad_to_go);
        } else if (pad_type == 'STR_PAD_BOTH') {
            half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
            input = half + input + half;
            input = input.substr(0, pad_length);
        }
    }

    return input;
}

/**
 * Sorting function for chapter select box
 *
 * @param v1
 * @param v2
 * @return int
 */
function boxSort(v1, v2) {
	if (v1 > v2) {
		return 1;
	} else if (v1 < v2) {
		return -1;
	}

	return 0;
}

function resetForm() {
	document.location.href = document.location.href;
}