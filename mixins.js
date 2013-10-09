/**
* Global mixins to use with all our ember apps
* @copyright: nerdeez.com Ltd.
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
	var Nerdeez = Ember.Namespace.create();
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
  method: 'feed',
  /**
  * the dialog title
  * @property
  * @public
  * @type {string}
  */
  name: 'Nerdeez',
  /**
  * dialog caption
  * @property
  * @public
  * @type {string}
  */
  caption: 'Nerdeez - Doing homework together',
  /**
  * dialog description
  * @property
  * @public
  * @type {string}
  */
  description: "",
  /**
  * dialog link
  * @property
  * @public
  * @type {string}
  */
  link: window.location.href,
  /**
  * dialog image
  * @property
  * @public
  * @type {string}
  */
  picture: 'https://s3-eu-west-1.amazonaws.com/nerdeez-public/nerdeez-logo.png',

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
        method: xthis.get('method'),
        name: xthis.get('name'),
        caption: xthis.get('caption'),
        description: xthis.get('description'),
        link: xthis.get('link'),
        picture: xthis.get('picture')
      },
        function(response) {
          if (response && response.post_id) {
              alert('Post was published.');
          } else {
              alert('Post was not published.');
          }
        }
      );
    }
  }
});