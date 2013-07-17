/**
 * creates an ember object for cross domain communication
 * 
 * Example:
 * 
 * ```javascript
 * 
 * wormhole = Nerdeez.Wormhole.create({serverUrl: 'http://foo.com'});
 * wormhole.ajax({url: url, type: type, data: pass_data, dataType: 'json', contentType: 'application/json', successFunction: successFunction, failFunction: failFunction});
 * ```
 * @requires porthole.js
 * @version 1.0
 * @copyright nerdeez.com
 * @author Yariv Katz
 */

//create the namespace if the namespace doesnt exist
if (typeof window.Nerdeez === "undefined"){
	var Nerdeez = Ember.Namespace.create();
}
else{
	var Nerdeez = window.Nerdeez;
}

/**
 * using porthole.js this will be used to create crossdomain ajax communications using iframes
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
     * holds the ajax always function
     * @property
     * @private
     * @type Object
     */
    alwaysFunction: {},
    
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
            '" src="' + this.get('serverUrl') +
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
                case "response":
	                console.log('test response'); 
	                return self.onResponse(data);
                default: throw Error("unknown message type: " + data.type);
            }
        });
        
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
        this.alwaysFunction[requestId] = params.alwaysFunction;
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
            deferred.resolve(data.data.hash, data.textStatus);
            this.successFunction[data.requestId](data.data.hash);
        } else {
            deferred.reject(data.data.textStatus, data.errorThrown);
            //alert('Communication error');
            this.alwaysFunction[data.requestId]();
            this.failFunction[data.requestId]({status: data.data.jqXHR.status, responseText: data.data.jqXHR.responseText});
        }
        this.alwaysFunction[data.requestId]();
    }
});

