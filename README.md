## Overview

Simpler Apps Framework (or SA for short) is a minimal framework that allows you to build your application with your own components (or use existing component library). Coding HTML, CSS, templates, etc. are considered "runtime code" needed for the components to operate, but should not really be the "finished" code. The components can vary from full page to small widgets, action components, data manipulation elements, etc. Once you develop your application, you can copy all the component JavaScript files and resources into the PhoneGap "/www" directory. You can then build your PhoneGap application as a native Mobile App that you can test on simulators and install through the App Stores. 

The entire SA app is built with components called Adaptive Mobile Components (more on this below). The initial loading is done via a call to "SA.loadComponent()" call in index.html to load the "Main" component. Once loaded, the entire application is constructed based on other referenced components (as shown in the diagram below).

<img src="https://simplerapps.appspot.com/app/res/str/img/docs-app-comps.png" alt="drawing" width="700"/>

### What are Adaptive Mobile Components?

Adaptive Mobile Components (AMC) are components built with JavaScript and define within its local namespace all the UI elements and the controller logic needed to interact-with and/or render per device specification (patent filed). The adaptability is part of the components' architecture where it is designed as Responsive to the component level as well as changing its behavior based on usability and the device it runs on. For example, the "CodeTester" component on the home page changes its code editor view based on what device it is running on (make it simpler for mobile devices). Another example will be a component that shows up as a dialog box on a browser and single page on mobile devices.


### Why should I use Simpler Apps and AMCs?

As a developer it is more precise and elegant. It will lead you to creating your own component library. You can break up your app into a blend of components, each with its own css and html definitions (instead of having large number of global CSS and HTML scripts). Your components can interact seamlessly by passing asynchronous events or calling methods on specific instances. It is really smart and a lot of fun!

As an organization it will save you a lot of money. You can have one applications team that builds single codebase apps to deploy on many devices and Web. You can invest in building great reusable component library that will lower the cost of future app development. Such investments in app building infrastructure will greatly enhance your business.

### Component Structure

The entire component is defined as a single JavaScript object and can be defined in one file. The component name is the object name and can contain numbers for versioning. The component structure consists of the following:

CSS object definition where components can define their own local css classes. These classes can be defined for all devices or specific device specifications (basically responsive css defined local to the component).
View object definition to declare the component view as a blend of HTML, CSS and other component references
CreateUI method to generate its HTML view
PostLoad method to do some initialization after DOM has been initialized with this components html
HandleEvent method to handle events dispatched from other components asynchronously
Other controller code to define events and event processing for component

See below an example of the MainApp component of this site that references other components such as: SA.BannerHandler, SA.Button, App.Home, etc.

```
// Create an instance of the application object
var App = {};

/**
 * Object for main application
 */
App.MainApp = function ()
{
    // CSS declaration object that makes the component 
    // Responsive. In this case these declared classes 
    // are global to the entire application because this 
    // is the first component loaded. 
    this.css =  { items:
    	[
 		// Everything else 
		{name: "@media (min-width: 481px)", items: 
			[    	 
			{name:".parag", 
			   value:"font-size:16px;color:#6f5a40;"}
			]
    	},
 		// Cell phones 
		{name: "@media (max-width: 481px)", items: 
			[    	 
			{name:".parag", 
			   value:"font-size:14px;color:#6f5a40;"}
			]}
    	]
    };
    
    /**
     * Flow declaration object of the main app is very similar 
     * to the HTML div tags of an html app structure, but it is 
     * more effective in the sense that it can contain a blend 
     * raw HTML as well as other components. 
     */
    var flowList = { items: 
       [
       {name:"appBanner", lc:"SA.BannerHandler",  
          config: { "imageUrl":"sa.png" }, items: 
    		 [
   			 {name:"home-action", ac:"SA.Button", ilist:"home", tlist:"appTarget", 
   			    cmd:"view", label:"Home", config:{type:"block"} },
   			 {name:"docs-action", ac:"SA.Button", ilist:"docs", 
   			    tlist:"appTarget",cmd:"view", label:"Documents", 
   				config:{type:"block"} },
   			 {name:"about-action", ac:"SA.Button", 
   			    ilist:"about", tlist:"appTarget", cmd:"view", label:"About", 
   				config:{type:"block"} }
			 ]
    	 },
    	 {name:"pages", items: 
    		 [
  	    	 {name:"home", lc:"App.Home", config:{hidden:true} },
	    	 {name:"docs", lc:"App.Docs", config:{hidden:true} },
	    	 {name:"about", lc:"App.About", config:{hidden:true} }
    		 ]
    	 },
    	 {name:"appTarget", class:"container", 
    	 	style:"padding-top:10px;padding-left:10px; 
    	 	padding-right:10px;" }
    	 ]
    };
    
	/**
	 * Handles events posted asynchronously by other components. These 
	 * event objects are custom designed by the application. 
	 */
	this.handleEvent = function ( event ) 
	{
		if ( event.cmd == "show" ) {
			// show the page 
		}
	}    
	
	/**
	 * This method allows the component to provide its HTML view
	 */
	this.createUI = function ( parentAtom, allConfig )
	{
		return SA.createUI ( this.compId, flowList );
	}	 
}
``` 

### Simpler Apps Use of JavaScript

JavaScript is utilized for creating the components. Although there are a lot of different JavaScript programming patterns, we are using the following simpler approach:

#### 1. To define the component we use the following pattern:

```
NameSpace.ComponentName = function () 
{}

// for example: 
SA.TabsHandler = function () {
	...
}
``` 

#### 2. The component is not instantiated directly with "new" operator. You can use some of the functions described below to create and lookup components:

```
// Atom list Component definition 
// Important Note: the config object is passed to the component at rendering 
// time and not at creation time
var atomList = { name:"banner-tabs", lc:"SA.TabsHandler", config:{} };

// Create a component as part of an atomObj if instance doe not exist. 
// Once created, components can have instance names or unique compId integer value
var html = SA.createUI ( this.compId, atomList );

// lookup component by name
var bannerTabs = SA.lookupComponent ("banner-tabs" ) ;

// Also you can create a component instance directly if instance does 
// not exist
var bannerTabs2 = SA.createComponent ( "banner-tabs2", "SA.TabsHandler") ;
```

#### 3. Use "this.methodName()" for public methods and "function ()" for private method. See examples below:

```
App.MainApp = function ()
{
	// Visible to all other components
	this.css = {...}
	
	// Visible to all other components
	this.createUI = function ( ...)
	{
		var result = calculate ( 20, 45 );
	}
	
	// Visible only to this component
	function calculate ( x, y ) 
	{
		return x + y + 100;
	}
}
```

### Pre-defined Keys in Atom Object

When defining Atom objects in JavaScript, the following key names are have specific meaning to the framework:

name: to define unique instance name. If name is specified an instance if kept in cache for that component instance
value: to define a value if needed
values: to define a list of values if needed
config: to define the instance configuration that will be used for rendering
items: an array used by a list to define its children. If no items are specified then the list will not have any children
lc: defines the "ListComponent" if needed (not required)
ac: defines the "AtomComponent" if specified, the the object symbolizes an Atom
ilist: for actions, defines input list name (what list to render)
tlist: for actions, defines the target list name (where the output will go)
label: the atom label (for example for input fields will be used as prompt)
info: used to show information about the atom

### Lists, Atoms, and Actions

The declarative part of the components for "Flow" and "CSS" declarations uses the "List" and "Atom" constructs that are reminiscent of the LISP programming language. The definition is made with two main constructs:

1. Lists are JS objects that can contain other Lists and Atoms. A list can have a component handler name under the name "lc" (List Component). These components are instantiated and managed by the system. Any object is a list unless it is an Atom (i.e. contains Atom Component or "ac" key ).

2. Atoms cannot contain other objects. Must have a "ac" (Atom Component) name with atom component key. The rule is that if it is not an atom it is a list. There are two types of atoms:

Data atoms that are small components that represent data elements such as text field, radio button, chart, etc.
Action atoms that contain logic that alters the system`s state such as Button

You can always add plain html tag with "html" name but you should feel encouraged to use components and build a component library instead. An html name tag can be any html tag. The value is placed as the inner html value.

See below for some List and Atom examples:

```
// Minimal list without children
{ name:"min-list" }

// Define list of css classes 
this.css = { items:
	[
	{name:".parag", value:"font-size:16px;color:#6f5a40;"}
	]
};

// A list with a name and children (under items)
{ name:"some-name", items: 
	[  
	// Define html tag with custom style
	{html:"h2", style:"font-size:36px", value:"Header"}, // html tag (list)
	// Define "p" tag with local class name
	{html:"p", class:"parag", value:"some paragraph"},   // html tag (list)
	
	// Atom as Action Component (alters system state)
	{name:"button-name", ac:"SA.Button", label:"OK"} 
	]
};

// A list with a name, list component, and empty children list (under items)
{ name:"some-name", lc="SA.BannerHandler", items: 
	[
	] 
	
// A complete "flow" list example from this MainApp component
this.flow = { items: 
	[
	// Banner component that you see on top that creates 
	// buttons for its child action atoms
	{name:"appBanner", lc:"SA.BannerHandler", 
		config: { "imageUrl":"res/img/hqapps-dark.png" }, items: 
		[
		// Action Atom that takes input list (ilist name "home") and send output
		// to target list (tlist name "appTarget" )
		{ac:"SA.ActButton", ilist:"home", tlist:"appTarget",	
			cmd:"view", label:"Home" },
		{ac:"SA.ActButton", ilist:"docs", tlist:"appTarget",	// Action atom
			cmd:"view", label:"Documents" },
		{ac:"SA.ActButton", ilist:"about", tlist:"appTarget",	// Action Atom
			cmd:"view", label:"About" } 
		]
	},
	{name:"pages", items: 
		[
		{name:"home", lc:"App.Home", config:{hidden:true} },
		{name:"docs", lc:"App.Docs", config:{hidden:true} },
		{name:"about", lc:"App.About", config:{hidden:true} }
		]
	},
	{name:"appTarget", class:"container", style:"padding-left:10px; 
		padding-right:10px;" }
	]
};
```
