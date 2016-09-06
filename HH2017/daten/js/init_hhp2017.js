var g_year_html = 'Jahr <select size="1" onchange="document.location.href=this.value"><option value="auswertung_hhp.html" selected="selected">2017</option></select>';
var g_data_type = 'hhp';
var g_max_data_size = 1000;
var g_currentYear = 2017;
var g_hidePdf = true;

Ext.onReady(function() {
	// Initializes the data range input fields
	var startBox = Ext.get('data_start').dom;
	var limitBox = Ext.get('data_limit').dom;

	if (startBox.value.length == 0 && limitBox.value.length == 0) {
		startBox.value = 1;
		limitBox.value = origData.length;
	}
	
	// Listener for the grid button
	Ext.get('button1').on('click', function() {
		runProcessing('grid');
	});
});

/**
 * Creates the grid
 */
function runProcessing(type) {
	var filter = runFilter();
	processData(filter);
	
	if (type != 'print') {	
		var navShow = document.getElementsByName('nav_show')[0].checked ? 1 : 2;

		if (navShow == 1 && Data.length > g_max_data_size) {
			if (!confirm('Es wurden mehr als ' + g_max_data_size + ' Datensätze ausgewählt. Datensätze anzeigen?')) {
				return;
			}
		}
	}

	fields1 = [
		   	    {name: 'a'},
		   	    {name: 'b'},
		   	    {name: 'c'},
		   	    {name: 'd'},
		   	    {name: 'e'},
		   	    {name: 'f'},
		   	    {name: 'g'},
		   	    {name: 'h'},
		   	    {name: 'i'},
		   	    {name: 'j'},
		   	    {name: 'k'},
		   	    {name: 'l'},
		   	    {name: 'm'},
		   	    {name: 'n'}
		   	];
		   	
   	fields2 = [
   	      	{header: 'Jahr', dataIndex: 'a', sortable: true, width:60, align: 'left', summaryType: 'count', summaryRenderer: summaryCount},
   	    	{header: 'EP', dataIndex: 'b', sortable: true, width: 45, align: 'right'},
   	    	{header: 'Kap', dataIndex: 'c', sortable: true, width: 53, align: 'right'},
   	    	{header: 'Grp', dataIndex: 'd', sortable: true, width: 53, align: 'right'},
   	    	{header: 'Zahl', dataIndex: 'e', sortable: true, width: 45, align: 'right'},
   	    	{header: 'Fkt', dataIndex: 'f', sortable: true, width: 53, align: 'right'},
   	    	{header: 'Typ', dataIndex: 'g', sortable: true, width: 1, align: 'right'},
   	   	    {header: 'Ansatz Neu', dataIndex: 'h', sortable: true, width:135, align: 'right', renderer: renderValue, summaryType: 'sum', summaryRenderer: summarySum},
   	   	    {header: 'Ansatz Alt', dataIndex: 'i', sortable: true, width:135, align: 'right', renderer: renderValue, summaryType: 'sum', summaryRenderer: summarySum},
   	   	    {header: 'Differenz', dataIndex: 'j', sortable: true, width:135, align: 'right', renderer: renderValue, summaryType: 'sum', summaryRenderer: summarySum},
   	   	    {header: 'in %', dataIndex: 'k', sortable: true, width:80, align: 'right', summaryType: 'count', summaryRenderer: summaryPercent},
   	   	    {header: 'Ist', dataIndex: 'l', sortable: true, width:135, align: 'right', renderer: renderDetailValue, summaryType: 'sum', summaryRenderer: summaryDetailSum},
   	   	    {header: 'Ansatz VE', dataIndex: 'm', sortable: true, width:135, align: 'right', renderer: renderValue, summaryType: 'sum', summaryRenderer: summarySum}
   	   	];

	reloadGrid('Haushaltsplan', fields1, fields2, type, filter);
}