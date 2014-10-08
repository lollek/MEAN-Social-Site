'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Newapp = new Module('newapp');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Newapp.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Newapp.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Newapp.menus.add({
    title: 'newapp example page',
    link: 'newapp example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Newapp.aggregateAsset('css', 'newapp.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Newapp.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Newapp.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Newapp.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Newapp;
});
