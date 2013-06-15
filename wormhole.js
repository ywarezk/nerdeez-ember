/**
 * creates an ember object for cross domain communication
 * 
 * Example:
 * 
 * ```javascript
 * Nerdeez.crossDomain
 * ```
 * 
 * @requires porthole.js
 */

//create the namespace if the namespace doesnt exist
if (typeof Nerdeez === "undefined")
	var Nerdeez = Ember.Namespace.create();

/**
 * using porthole.js this will be used to create crossdomain ajax communications using iframes
 * this class is a singletone service and created once.
 * 
 * @class Wormhole
 * @namespace Nerdeez
 * @requires porthole.js
 * @extends Ember.Object
 */
Nerdeez.Wormhole = Ember.Object.extend({
	
	/**
	 * did i finish to create the porthole communication
	 * 
	 * @property linked
	 * @type Boolean
	 * @default false
	 * @private
	 */
	linked: false,
	
	/**
	 * if didn't finish iframe communication setup then 
	 * pend the request to use after communication is ready
	 * 
	 * @property pending
	 * @type Array
	 * @private
	 */
    pending: [],
    
    /**
     * pointing head to the current request
     * 
     * @property nextRequest
     * @type Number
     * @private
     */
    nextRequest: 1,
    
    /**
     * hold jquery defered objects
     * @property
     * @private
     * @type Object
     */
    deferreds: {},
    
    /**
     * holds the success functions for an ajax requests
     * @property
     * @private
     * @type Object
     */
    successFunction: {},
    
    /**
     * holds the fail functions for an ajax requests
     * @property
     * @private
     * @type Object
     */
    failFunction: {},
    
    /**
     * holds the server url
     * set this property to change the default connection url
     * @property
     * @public
     * @type strng
     */
    serverUrl: 'http://localhost:8000/',
    
	/**
	 * @private
	 * 
	 * - creates an iframe
	 * - init porthole to communicate with this iframe
	 * - capture response events
	 * important: set the serverUrl property to change the default server
	 *  
	 * @method init
	 */
    init: function() {
	    	this._super();
    	
        // create the iframe
        var target = "wormhole_iframe";
        this.iframe = $('<iframe id="' + target +
            '" name="' + target +
            '" src="' + WorkerimClient.server_url + 
            '" style="width: 0; height: 0; border: none; display: none;"></iframe>');
            $('body').append(this.iframe);
            
        // create a porthole.js proxy window to send and receive message from the vault iframe
        this.windowProxy = new Porthole.WindowProxy(this.get('serverUrl'), target);
 
        // handle messages based on their type
        var self = this;
        this.windowProxy.addEventListener(function(message) {
            var data = $.parseJSON(message.data);
            switch (data.type) {
                case "ready": return self.onReady(data);
                case "response": return self.onResponse(data);
                default: throw Error("unknown message type: " + data.type);
            }
        });
        
        //save the instance (singleton)
        Nerdeez.Wormhole.prototype.wormholeInstance = this;
    },

	/**
	 * creates an ajax request through the porthole to the server
	 * @param {Object} params
	 * @return {Object} the promise for the ajax request
	 */    
    ajax: function(params) {
        var requestId = this.nextRequest;
        this.nextRequest += 1;
 
        var deferred = $.Deferred();
        this.deferreds[requestId] = deferred;
        this.successFunction[requestId] = params.successFunction;
        this.failFunction[requestId] = params.failFunction;
        var request = {requestId: requestId, params: params};
        if (this.linked) {
            this.sendRequest(request);
        } else {
            this.pending.push(request);
        }
        return deferred.promise();
    },
    
    /**
     * send the request through the porthole 
	 * @param {Object} request
     */
    sendRequest: function(request) {
        try{
            this.windowProxy.post(JSON.stringify(request));
        }
        catch(err){
            console.log(err);
        }
    },
 
    /**
     * finished opening communication portal with the server
     * now we can send all the pending requests
	 * @param {Object} data
     */
    onReady: function(data) {
        this.linked = true;
        for (var i = 0; i < this.pending.length; i++) {
            this.sendRequest(this.pending[i]);
            //this.pending = this.pending.splice(i, 1);
            //this.sendRequest(this.pending.pop());
        }
        this.pending = [];
    },
    // handle responses to requests made through the wormhole
    
    /**
     * the server returned an answer run the success or fail function
	 * @param {Object} data
     */
    onResponse: function(data) {
        var deferred = this.deferreds[data.requestId];
        delete this.deferreds[data.requestId];
        if (data.success) {
            deferred.resolve(data.data, data.textStatus);
            this.successFunction[data.requestId](data.data);
        } else {
            deferred.reject(data.textStatus, data.errorThrown);
            //alert('Communication error');
            this.failFunction[data.requestId](data.data, {status: 500, responseText: 'Server error'});
        }
    }
});

//iterate on applications inject and register
/*var data = Ember.Application.NAMESPACES;
for (var i=0; i<data.length; i++) {
	app = data[i];
	appString = app.toString();
	appObject = window[appString];
    if(typeof appObject.register !== "undefined"){
       appObject.register('wormhole:current', Nerdeez.Wormhole, {singleton: true});
       appObject.inject('controller', 'wormhole', 'wormhole:current');
       appObject.inject('view', 'wormhole', 'wormhole:current');
       appObject.inject('DS.DjangoTastypieAdapter', 'wormhole', 'wormhole:current');
       appObject.inject('DS.Store', 'wormhole', 'wormhole:current');
       appObject.inject('WorkerimClient.store', 'wormhole', 'wormhole:current');
       appObject.inject('Ember.Object', 'wormhole', 'wormhole:current');
       appObject.inject('application', 'wormhole', 'wormhole:current');
       appObject.inject('application:store', 'wormhole', 'wormhole:current');
    }
}*/

Ember.Application.initializer({
	name: "wormhole",
	 
	initialize: function(container, application) {
		//var store = container.lookup('store:main');
		//var obj = store.load(CrashLog.User, currentUser);
	 
		container.optionsForType('wormhole', { instantiate: false, singleton: true });
		container.register('wormhole', 'current', Nerdeez.Wormhole);
	}
});
 
Ember.Application.initializer({
	name: "injectWormhole",
	after: 'wormhole',
	 
	initialize: function(container) {
		container.injection('application:main', 'wormhole', 'wormhole:current');
		container.typeInjection('application:main', 'wormhole', 'wormhole:current');
		//container.typeInjection('store', 'wormhole', 'wormhole:current');
		//container.typeInjection('store:adapter', 'wormhole', 'wormhole:current');
	}
});
