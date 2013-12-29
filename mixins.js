/**
* Global mixins to use with all our ember apps
* @copyright: Nerdeez
* @version: 1.0
**/


/**
  This mixin allows a class to return a singleton, as well as a method to quickly
  read/write attributes on the singleton.


  Example usage:

  ```javascript

    // Define your class and apply the Mixin
    User = Ember.Object.extend({});
    User.reopenClass(Discourse.Singleton);

    // Retrieve the current instance:
    var instance = User.current();

  ```

  Commonly you want to read or write a property on the singleton. There's a
  helper method which is a little nicer than `.current().get()`:

  ```javascript

    // Sets the age to 34
    User.currentProp('age', 34);

    console.log(User.currentProp('age')); // 34

  ```

  If you want to customize how the singleton is created, redefine the `createCurrent`
  method:

  ```javascript

    // Define your class and apply the Mixin
    Foot = Ember.Object.extend({});
    Foot.reopenClass(Discourse.Singleton, {
      createCurrent: function() {
        return Foot.create({toes: 5});
      }
    });

    console.log(Foot.currentProp('toes')); // 5

  ```
**/

//create the namespace if the namespace doesnt exist
if (typeof window.Nerdeez === "undefined"){
	var Nerdeez = window.Nerdeez = Ember.Namespace.create();
}
else{
	var Nerdeez = window.Nerdeez;
}

/**
  @class Discourse.Singleton
  @extends Ember.Mixin
  @namespace Discourse
  @module Discourse
**/
Nerdeez.Singleton = Ember.Mixin.create({

  /**
    Returns the current singleton instance of the class.

    @method current
    @returns {Ember.Object} the instance of the singleton
  **/
  current: function() {
    if (!this._current) {
      this._current = this.createCurrent();
    }

    return this._current;
  },


  /**
    How the singleton instance is created. This can be overridden
    with logic for creating (or even returning null) your instance.

    By default it just calls `create` with an empty object.

    @method createCurrent
    @returns {Ember.Object} the instance that will be your singleton
  **/
  createCurrent: function() {
    return this.create({});
  },

  /**
    Returns or sets a property on the singleton instance.

    @method currentProp
    @param {String} property the property we want to get or set
    @param {String} value the optional value to set the property to
    @returns the value of the property
  **/
  currentProp: function(property, value) {
    var instance = this.current();
    if (!instance) { return; }

    if (typeof(value) !== "undefined") {
      instance.set(property, value);
      return value;
    } else {
      return instance.get(property);
    }
  }

});

/**
 This mixin allows for facebook's "share" capability,
 provided by the share function.

 Properties are provided with default values.
 
 Example Usage (default values):

 ''''javascript

 App.myController = Ember.Controller.extend(Nerdeez.Share);

 ''''handlebars

 <a {{action share}}>

 ''''

 To customize properties' values,
 redefine the shareInit method.
 
 Example:

 '''javascript

 //the controller or view that'll use the mixin
 App.myController = Ember.Controller.extend(Nerdeez.share, {

  //using shareInit hook to customize default values
  shareInit: function() {
    this.set('method', this.get('content.method'));
    this.set('link', "http://www.Nerdeez.com");
  }
 })

**/

/**
  @class Nerdeez.Share
  @extends Ember.Mixin
  @namespace Nerdeez
  @module Nerdeez
**/
Nerdeez.Share = Ember.Mixin.create({

  /**
  * The UI dialog to invoke.
  * @property
  * @public
  * @type {string}
  */
  shareMethod: 'feed',
  /**
  * the dialog title
  * @property
  * @public
  * @type {string}
  */
  shareName: 'Nerdeez',
  /**
  * dialog caption
  * @property
  * @public
  * @type {string}
  */
  shareCaption: 'Nerdeez - Doing homework together',
  /**
  * dialog description
  * @property
  * @public
  * @type {string}
  */
  shareDescription: "",
  /**
  * dialog link
  * @property
  * @public
  * @type {string}
  */
  shareLink: window.location.href,
  /**
  * dialog image
  * @property
  * @public
  * @type {string}
  */
  sharePicture: 'https://s3-eu-west-1.amazonaws.com/nerdeez-public/nerdeez-logo.png',

  /**
    Init function, empty by default.

    @method shareInit
  **/
  shareInit: function() {},

  actions: {

    /**
    main function, holds FB.ui, a generic helper method for
    triggering Dialogs which allow the user to take some action.

    @method current
    @returns {Ember.Object} the instance of the singleton
  **/

    share: function() {
      this.shareInit();
      var xthis = this;
      FB.ui(
      {
        method: xthis.get('shareMethod'),
        name: xthis.get('shareName'),
        caption: xthis.get('shareCaption'),
        description: xthis.get('shareDescription'),
        link: xthis.get('shareLink'),
        picture: xthis.get('sharePicture')
      },
        function(response) {
          if (response && response.post_id) {
              //alert('Post was published.');
          } else {
              //alert('Post was not published.');
          }
        }
      );
    }
  }
});

/**
 This mixin allows for controllers to pass status messages and loading

 
 Example Usage (default values):

 ''''javascript

 App.myController = Ember.Controller.extend(Nerdeez.Status,{ ... });

 ''''handlebars

 {{#if isSuccess}}
	 ...
	 {{statusMessage}}
 {{/if}}
 
 {{#if isError}}
	 ...
	 {{statusMessage}}
 {{/if}}
 
 {{#if isLoading}}
	 ...
 {{/if}}

 ''''

**/

/**
  @class Nerdeez.Share
  @extends Ember.Mixin
  @namespace Nerdeez
  @module Nerdeez
**/
Nerdeez.Status = Ember.Mixin.create({
	/**
	 * if set to true will display the success alert
	 * @type {Boolean}
	 */
	isSuccess: false,
	
	/**
	 * if set to true will display the danger alert
	 * @type {Boolean}
	 */
	isError: false,
	
	/**
	 * if set to true will display the loading screen
	 * @type {Boolean}
	 */
	isLoading: false,
	
	/**
	 * will display a message in the alerts
	 * @type {String}
	 */
	statusMessage: null,
	
	/**
	 * will display an error
	 * @param {String} message - the message to display
	 */
	error: function(message){
		this.set('isError', true);
		this.set('isSuccess', false);
		this.set('isLoading', false);
		this.set('statusMessage', message);
	},
	
	/**
	 * will display an success
	 * @param {String} message - the message to display
	 */
	success: function(message){
		this.set('isError', false);
		this.set('isSuccess', true);
		this.set('isLoading', false);
		this.set('statusMessage', message);
	},
	
	/**
	 * put the loading screen on
	 */
	loading: function(){
		this.set('isLoading', true);
	}  
});


/**
 This mixin handles controllers errors returned from ember rejected promises

 
 Example Usage (default values):

 ''''javascript

 App.myController = Ember.Controller.extend(Nerdeez.ErrorHandler,{ ... });


 ''''

**/

/**
  @class Nerdeez.ErrorHandler
  @extends Ember.Mixin
  @namespace Nerdeez
  @module Nerdeez
**/
Nerdeez.ErrorHandler = Ember.Mixin.create({
  
  /**
   * will log the error, and will present the user
   * with the error details
   * @param {Ember.Object} error - the error from the rejected promise
   */
  errorHandler: function(error){
    
    console.log(error.errors);
    alert("An error has occured.\r\n error details : " + error.errors + " \r\nPlease contact System admin with the error details.");

  },
  
});

/**
 This mixin handles filtering content

 
 Example Usage (default values):

 ''''javascript

 App.myController = Ember.Controller.extend(Nerdeez.FilterContentHandler,{ ... });


 ''''

**/

/**
  @class Nerdeez.FilterContentHandler
  @extends Ember.Mixin
  @namespace Nerdeez
  @module Nerdeez
**/
Nerdeez.FilterContentHandler = Ember.Mixin.create({

  /**
   * will hold the limit param 
   * for each query
   * @type {int}
   */
  limit : 20,
  
  /**
    * function will send the server
    * a filtered query.
    * function will then set the 'content' object
    * to the result returned from the server.
    * @param {Object} - filterParams - an object that will hold
    * the query params. a propery with values 'All' or null will not
    * be inserted into the query
    * @param {extraFilterParams} - an object that will hold
    * common filter params for all queries.
    */

    filterContent: function(filterParams,extraFilterParams) {

      var xthis=this;

      //will count filter params which differ from null.
      //intended to prevent a situation where a unessecary
      //request is sent to server
      var notNullFilterParams=0;

      //will hold our final query object
      var query = {};
      query['limit'] = this.get('limit');

      //get the extraFilterParams
      for (var property in extraFilterParams) {
          if (extraFilterParams.hasOwnProperty(property)) {
                query[property] = extraFilterParams[property];
          }
      }

      //get the business id for the profile
      query['business_profile'] = Ticketz.auth.get('businessProfile.id');

      //build the query which will send to the server
        for (var property in filterParams) {
          if (filterParams.hasOwnProperty(property)) {
              //if equals "All", it means we want all properties
              //of the filter, so we won't add the property to
              //the query
              if (!Ember.isEmpty(filterParams[property]) && filterParams[property] != "All") {
                query[property] = filterParams[property];
                notNullFilterParams++;
              }
              else if (filterParams[property] == "All") {
                notNullFilterParams++;
              }
          }
      }

      //if at least one of the filterParams is not null
      //then GET from server, else return
      if (notNullFilterParams ==0) return;

      //set the model for the query
      var model = this.get('content.type');

      //get the model to filter upon
      //post to the server the filtered query
      model.find(query).then(
        //on success
        function(result) {
          xthis.set('content', result);
        },
        //on failure
        function(error) {
          console.log(error.errors);
          alert("An error has occured. Please contact System Admin.")
        });

    }
  
});