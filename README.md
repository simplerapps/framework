### Overview

Simpler Apps (or SA) is a minimal framework that encourages you to build your application with your own components (or use existing component library). Coding HTML, CSS, templates, etc. are considered "runtime code" needed for the components to operate, but should not really be the "finished" code. The components can vary from full page to small widgets, action components, data manipulation elements, etc.

Once you develop your application, you can copy all the component JavaScript files and resources into the PhoneGap "/www" directory. You can then build your PhoneGap application as a native Mobile App that you can test on simulators and install through the App Stores. You can also test your pre-built app on browsers with different types and sizes.

The entire SA app is built with components called Adaptive Mobile Components (more on this below). The initial loading is done via a call to "SA.loadComponent()" call in index.html to load the "Main" component. Once loaded, the entire application is constructed based on other referenced components (as shown in the diagram below).

![This is an alt text.](https://simplerapps.appspot.com/app/res/str/img/docs-app-comps.png "Simpler app architecture")
