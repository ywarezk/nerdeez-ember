/**
* Changes Ember's url hash (#) to hashbang (#!)
* NOTE: To enable in the application, add the following code after app creation
*
* APP.Router.reopen({
*     location: 'hashbang'
* })
* @copyright: nerdeez.com Ltd.
* @version: 1.0
**/


(function() {

var get = Ember.get, set = Ember.set;

Ember.Location.registerImplementation('hashbang', Ember.HashLocation.extend({   

    getURL: function() {
        return get(this, 'location').hash.substr(2);
    },

    setURL: function(path) {
        get(this, 'location').hash = "!"+path;
        set(this, 'lastSetURL', "!"+path);
    },

    onUpdateURL: function(callback) {
        var self = this;
        var guid = Ember.guidFor(this);

        Ember.$(window).bind('hashchange.ember-location-'+guid, function() {
        Ember.run(function() {
            var path = location.hash.substr(2);
            if (get(self, 'lastSetURL') === path) { return; }

            set(self, 'lastSetURL', null);

            callback(location.hash.substr(2));
        });
        });
    },

    formatURL: function(url) {
        return '#!'+url;
    }

    })
);

})();