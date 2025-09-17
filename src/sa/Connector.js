/**
 * Connection handler object
 */
function Connector ( connectUrl, wsListener )
{
	this.ws = undefined; 
	this.connectUrl = connectUrl;
	this.wsListener = wsListener;
	
	this.connect = function ()
	{
		if ("WebSocket" in window) {

			// Let us open a web socket
			this.ws = new WebSocket( this.connectUrl );
			this.ws.onopen = function()
			{
				wsListener.onOpen ();
			};
			this.ws.onmessage = function (evt) 
			{ 
				var receivedMsg = evt.data;
				wsListener.onMessage ( receivedMsg);
			};
			this.ws.onclose = function()
			{ 
				wsListener.onClose ();
			};
		}
		else {
		     // The browser doesn't support WebSocket
		     alert ( "WebSocket NOT supported by your Browser!");
		}
	}
	
	this.setConnectionListener = function ( listener )
	{
		this.wsListener.listener = listener;
	}

	this.sendString = function ( someString )
	{
		if ( this.ws ) {
			this.ws.send ( someString );
			return true;
		}
		else {
			alert ("Not connected yet!");
			return false;
		}
	}

	this.sendJsonObj = function ( jsonMsgObject )
	{
		if ( this.ws ) {
			this.ws.send ( JSON.stringify (jsonMsgObject) );
			return true;
		}
		else {
			alert ("Not connected yet!");
			return false;
		}
	};
};

/**
 * Connection handler
 */
function ConnectListener ()
{
	this.listener = undefined;
	
	this.onOpen = function ()
	{
		console.log ( 'connection open');
	}
	this.onMessage = function ( jsonString )
	{
		if ( this.listener ) {
			var msgObj = JSON.parse(jsonString);
			this.listener.onMessage (msgObj);
		}
	}
	this.onClose = function ()
	{
		console.log ( 'connection closed');
	}
}

// create server connector
SA.connector = new Connector( "ws://localhost:8080/simplq/search", new ConnectListener());

