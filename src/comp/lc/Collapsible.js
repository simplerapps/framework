
/**
 * Component that collapses the sections defined by the sub-lists 
 */
SA.Collapsible = function ()
{
	// create new instance every time referenced in list
	this.stateful = false;
	
	this.flow = { 
	};
	
	/**
	 * This method creates the UI based on the lists provided
	 * 
	 * items:
	 * 
	 * config:
	 * 
	 */
	this.createUI = function ( flowList, allConfig )
	{
		if ( !flowList.items || flowList.items.length==0 ) {
			return '';
		}
		
		var html = '';
		html += '<div class="panel-group" id="accordion">';
		
		for ( i=0; i<flowList.items.length; i++ ) {
			var item = flowList.items [i];
			
			var content = SA.listCreateUI ( this.compId, item );
			var id = 'coll-' + this.id + '-' + i;
			
			html += '<div class="panel panel-default">';
			html +=     '<div class="panel-heading">';
			html +=       '<h4 class="panel-title">';
			html +=       '<a data-toggle="collapse" data-parent="#accordion" href="#' + id + '">';
			html +=          item.label;
			html +=       '</a>';
			html +=       '</h4>';
			html +=     '</div>';
			html +=     '<div id="' + id + '" class="panel-collapse collapse">';
			html +=        '<div class="panel-body">';
			html +=           content; 
			html +=        '</div>';
			html +=     '</div>';
			html += '</div>';			
		}
		  
		html += '</div>';
			
		return html;
		
		
	}
	
	function loadFile ( filePathUrl, dataHandler )
	{
		var content = '';
		$.ajax({
            url : filePathUrl,
            type: 'GET',
            dataType: 'text',  
            success : function (data) {
                content = data;
            },
            error: function (xhr,status,error) {
            	alert ( error );
            }
        });		
	}	
	
}
