var g_win = null;
var g_print = false;
var g_grid = null;
var g_tooltip = null;
var g_sorting = [];

var IE = document.all ? true : false;

if (!IE) {
	document.captureEvents(Event.MOUSEMOVE);
}

document.onmousemove = getMouseXY;
var tempX = 0;
var tempY = 0;

function reloadGrid(title, fields1, fields2, type, filter) {
	var showData = document.getElementsByName('nav_show')[0].checked;
	
	// Remember sorting
	if (g_grid && g_grid.getStore().getSortState()) {
		g_sorting[0] = g_grid.getStore().getSortState().field;
		g_sorting[1] = g_grid.getStore().getSortState().direction;
	}
	
	Ext.QuickTips.init();
	
	var store = new Ext.data.Store({
		proxy: new Ext.data.MemoryProxy(showData ? Data : []),
		reader: new Ext.data.ArrayReader({idIndex:null}, fields1)
	});

	store.load();

    if (g_sorting[0] && g_sorting[1]) {
    	store.sort(g_sorting[0], g_sorting[1]);
    }
    
    if (type == 'print' && g_data_type == 'hhp') {
    	var record = new store.recordType({a: "<div style=\"width:36px;white-space:nowrap;\">Summe Einnahmen</div>", h: calculateIncomings(7, false, true), i: calculateIncomings(8, false, true), j: calculateIncomings(9, false, true), k: printSummaryPercent(1), l: calculateIncomings(11, true, true), m: calculateIncomings(12, false, true)});
    	store.add(record);
    	var record = new store.recordType({a: "<div style=\"width:36px;white-space:nowrap;\">Summe Ausgaben</div>", h: calculateOutgoings(7, false, true), i: calculateOutgoings(8, false, true), j: calculateOutgoings(9, false, true),k: printSummaryPercent(2), l: calculateOutgoings(11, true, true), m: calculateOutgoings(12, false, true)});
    	store.add(record);
    } else if (type == 'print' && g_data_type == 'hhr') {
    	var record = new store.recordType({a: "<div style=\"width:36px;white-space:nowrap;\">Summe Einnahmen</div>", h: calculateIncomings(7, false, true), i: calculateIncomings(8, false, true), j: calculateIncomings(9, false, true), k: calculateIncomings(10, false, true), l: calculateIncomings(11, true, true), m: calculateIncomings(12, false, true)});
    	store.add(record);
    	var record = new store.recordType({a: "<div style=\"width:36px;white-space:nowrap;\">Summe Ausgaben</div>", h: calculateOutgoings(7, false, true), i: calculateOutgoings(8, false, true), j: calculateOutgoings(9, false, true),k: calculateOutgoings(10, false, true), l: calculateOutgoings(11, true, true), m: calculateOutgoings(12, false, true)});
    	store.add(record);    	
    }

	var model = new Ext.grid.ColumnModel(fields2);

    var summary = new Ext.ux.grid.GridSummary();
	
    Ext.get('grid-content').dom.innerHTML = '';
    Ext.get('content-frame').dom.style.visibility = 'visible';
    Ext.get('dataCount').dom.innerHTML = Data.length;
    
    var navShow = document.getElementsByName('nav_show')[0].checked ? 1 : 2;
    
    if (g_grid) {
    	g_grid.destroy();
    }
        
    if (type == 'print') {
    	g_grid = new Ext.grid.GridPanel({
    		store: store,
    		colModel: model,
    		plugins: [summary],
    		autoHeight: g_print,
    		height: navShow == 1 ? 300 : null
    	});
    } else {
    	g_grid = new Ext.grid.GridPanel({
    		store: store,
    		colModel: model,
    		plugins: [summary],
    		autoHeight: g_print,
    		height: navShow == 1 ? 300 : null,
    		view: new Ext.ux.grid.BufferView({
    			scrollDelay: false
    		})
    	});
    	
    	g_grid.render('grid-content');
    }

    if (g_data_type != 'zr') {
        if (typeof g_hidePdf === 'undefined' || g_hidePdf == false) {
        	// Show PDF on click
        	g_grid.addListener('cellclick', function(grid, index, row, event) {
        		var record = grid.getStore().getAt(index);
        		var i1 = record.get('b');
        		var i2 = record.get('c')
    
        		var win = window.open('../pdf/' + g_currentYear + '/hh' + i1 + '/kap' + i2 + '.pdf', 'PDF', 'width=800,height=600');
        	});
        }
    }

    if (g_data_type == 'hhp' || g_data_type == 'hhr') {
		g_grid.addListener('mouseover', function(event, t, a) {
			var row = this.getView().findRowIndex(t);
			var record = g_grid.getStore().getAt(row);

			if (record && record.get('n')) {
				g_tooltip = new Ext.Element(document.createElement('div'));
				g_tooltip.addClass('tooltip');
				g_tooltip.update(record.get('n'));
				g_tooltip.setStyle('visibility', 'hidden');
				Ext.get(document.body).appendChild(g_tooltip);
			}
		});
		
		g_grid.addListener('mouseout', function(event, t, a) {
			if (g_tooltip) {
				g_tooltip.remove();
				g_tooltip = null;
			}
		});
    }
    
    if (filter.type == 'TIT') {
    	g_grid.getColumnModel().setHidden(6, true);
    	g_grid.getColumnModel().setHidden(12, true);
    } else if (filter.type == 'VE') {
    	g_grid.getColumnModel().setHidden(6, true);
    	g_grid.getColumnModel().setHidden(7, true);
    	g_grid.getColumnModel().setHidden(8, true);
    	g_grid.getColumnModel().setHidden(9, true);
    	g_grid.getColumnModel().setHidden(10, true);
    	g_grid.getColumnModel().setHidden(11, true);
    	g_grid.getColumnModel().setHidden(12, false);
    }
}

function getMouseXY(e) {
    if (g_tooltip) {
	    if (IE) {
	        tempX = event.clientX + document.body.scrollLeft;
	        tempY = event.clientY + document.body.scrollTop;
	    } else {
    	    tempX = e.pageX;
	        tempY = e.pageY;
	    }  

	    if (tempX < 0) {
	    	tempX = 0;
	    }
  
	    if (tempY < 0) {
	    	tempY = 0;
	    }  

	    g_tooltip.setStyle('visibility', 'visible');
		g_tooltip.setStyle('left', (tempX + 10) + 'px');
		g_tooltip.setStyle('top', (tempY - 50) + 'px');
    }

    return true
}

/**
 * Render numeric cells with different colors
 * 
 * @param int value
 * @return string
 */
function renderColor(value) {
	if (parseFloat(value) < 0) {
		return '<span class="negativ">' + value + '</span>';
	} else if (parseFloat(value) > 0) {
		return '<span class="positiv">' + value + '</span>';
	} else {
		return '<span class="null">' + value + '</span>';
	}
}

/**
 * Render a value with comma/period
 * 
 * @param mixed value
 * @return mixed
 */
function renderValue(value) {
	if (!value || value == '-') {
		if (!value) {
			return '0';
		}
		
		return value;
	}

	var s = ('' + value).split('.');
	
	s[0] = s[0].split('').reverse().join('').match(/\d{1,3}/gi).join('.').split('').reverse().join('');
	
	var res = s[0];//(s.join(',')); 
	
	if (value < 0) {
		res = '-' + res;
	}	
	
	return res;
}

/**
 * Render a value with comma/period
 * 
 * @param mixed value
 * @return mixed
 */
function renderDetailValue(value) {
	if (!value || value == '-') {
		return value;
	}
	 
    var s = ('' + value).split('.');

	if (s[1] && s[1].length == 1) {
		s[1] = ('' + s[1]) + '0';
	}

	s[0] = s[0].split('').reverse().join('').match(/\d{1,3}/gi).join('.').split('').reverse().join('');
	
	var res = (s.join(',')); 
	
	if (value < 0) {
		res = '-' + res;
	}

	if (res.indexOf(",") == -1) {
		res = res + ',00';
	}
	
	return res;
}
 
function renderVValue(value) {
	return "";
}
 
/**
 * Print the grid
 */
function printGrid() {
	document.getElementsByName('nav_show')[0].checked = true;

	g_print = true;
	runProcessing('print');
	Ext.ux.Printer.BaseRenderer.prototype.stylesheetPath = '../css/print.css';
	Ext.ux.Printer.print(g_grid);
	g_print = false;
	
	runProcessing('grid');
}
