/**
 * Create events handler object for HQ APPS framework
 */
function Events () 
{
	var eventsQueue = new Array();
	var timerRunning = false;
	
	/**
	 * post an event on a component selector. This method will only fire the event if the component 
	 * exists and then removes the event
	 */
	this.fireEvent = function ( compNameOrId, event )
	{
		//console.debug ( 'req fire event to compId: ' + compNameOrId  );
		
		// add event
		var eventObj = {};
		eventObj.selector = compNameOrId;
		eventObj.event = event;
		eventObj.fc = 0; 
		eventsQueue.push ( eventObj );
		
		// start timer
		startTimer ( timerHandler );
		
		function timerHandler ()
		{
			//console.log ( 'timer queueSize: ' + eventsQueue.length );
			
			//alert ( 'fire all events');
			fireAllEvents ();
			
			if ( eventsQueue.length > 0 ) {
				stopTimer ();
				startTimer ( timerHandler );
			}
			else { 
				stopTimer ();
			}
		}
	}
	
	// internal functions
	function startTimer (handler)
	{
		if ( timerRunning == false ) {
			//alert ( 'start timer');
			setTimeout(handler, 10);
			timerRunning = true;
		}
	}
	
	function stopTimer ()
	{
		timerRunning = false;
	}
	
	function fireAllEvents ()
	{
		for (i=0; i<eventsQueue.length; i++ ) {
			var evt = eventsQueue [i];
			fireEvent ( evt );
		}
		var i = eventsQueue.length;
		while ( i-- ) {
			evt = eventsQueue [i];
			if ( evt.done == true ) {
				eventsQueue.splice (i);
			}
		}
	}
	
	function fireEvent ( evt )
	{
		//alert ( 'fire event');
		
		// if hQA component has handleEvent function, call it
		var comp = SA.comps.getCompByIdOrName ( evt.selector );
		
		//alert ( 'get comp for selector: ' + evt.selector);
		
		if ( comp && comp.handleEvent ) {
			comp.handleEvent ( evt.event );
			evt.done = true;
			return;
		}
		
		// call trigger on js component
		var sel = $('#' + evt.selector);
		if ( sel.length ) {
			sel.trigger( evt.event );
			evt.done = true;
		}
		else {
			evt.fc++;
			if ( evt.fc == 5 ) {
				//console.log ('Warn: cannot fire event for selector name: ' + evt.selector + ', event: ' + evt.event );
				evt.done = true;
			}
		}
	}
}
// create on instance of the events handler object
SA.events = new Events();
