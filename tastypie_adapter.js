/**
 * ember store adapter for server that returns a django - tastypie response
 * 
 * Example
 * 
 * ```javascript
 * 
 * app.store = DS.Store.create(
 *     {
 * 	       adapter: DS.DjangoTastypieAdapter.extend({
 *              . . .  	
 *         })
 *     } 	
 * );
 * 
 * ``` 
 * 
 * @requires ember.js
 * @requires ember-data.js
 * @requires tastypie_serializer.js
 * @version 1.0
 * @copyright nerdeez.com
 * @author Yariv Katz
 */

var get = Ember.get, set = Ember.set;

//create the namespace if the namespace doesnt exist
if (typeof window.Nerdeez === "undefined"){
	var Nerdeez = Ember.Namespace.create();
}
else{
	var Nerdeez = window.Nerdeez;
}

/**
 * extending the rest adapter - this will create an adapter for django - tastypie
 * @class DjangoTastypieAdapter
 * @extends DS.RESTAdapter
 * @requires ember.js
 * @requires ember-data.js
 * @requires tastypie_serializer.js
 */
Nerdeez.DjangoTastypieAdapter = DS.RESTAdapter.extend({
	
	/**
	 * Set this parameter if you are planning to do cross-site
	 * requests to the destination domain. Remember trailing slash 
	 * @property serverDomain
	 * @public
	 * @type string
	 */
	serverDomain: null,

	/**
	 * This is the default Tastypie namespace found in the documentation.
	 * You may change it if necessary when creating the adapter
	 * @property namespace
	 * @public
	 * @type string 
	 */ 
	namespace: "api/v1",

	/**
	 * Bulk commits are not supported at this time by the adapter.
	 * Changing this setting will not work
	 * @property bulkCommit
	 * @type Boolean
	 * @private 
	 */
	bulkCommit: false,

	/**
	 * Tastypie returns the next URL when all the elements of a type
	 * cannot be fetched inside a single request. Unless you override this
	 * feature in Tastypie, you don't need to change this value. Pagination
	 * will work out of the box for findAll requests
	 * @property since
	 * @type string
	 * @public   
	 */
	since: 'next',

	/**
	 * Serializer object to manage JSON transformations
	 * @property serializer
	 * @type DS.JSONSerializer
	 * @public
	 */
	serializer: Nerdeez.DjangoTastypieSerializer,
	
	/**
	 * will append this to the url for tastypie api key authentication
	 * @property api_key
	 * @type string
	 * @public
	 */
	apiKey: null,
	
	/**
	 * will append this to the url for tastypie authentication
	 * @property username
	 * @type string
	 * @public
	 */
	username: null,
	
	/**
	 * hook for crossDomain communication.
	 * for example you can use Nerdeez.Wormhole (wormhole.js)
	 * if not set the default ajax will be set
	 */
	wormhole: null,
	
	/**
	 * hook to set the loading function to call when ajax starts
	 * @type {Function}
	 * @property
	 * @public 
	 */
	loadingFunction: null,
	
	/**
	 * hook to set the stop loading function to call when ajax finishes
	 * @type {Function}
	 * @property
	 * @public 
	 */
	stopLoadingFunction: null,

	/**
	 * @private
	 * @return void
	 */
	init: function() {
	    var serializer,
	        namespace;
	
	    this._super();
	
	    namespace = get(this, 'namespace');
	    Em.assert("tastypie namespace parameter is mandatory.", !!namespace);
	
	    // Make the adapter available for the serializer
	    serializer = get(this, 'serializer');
	    set(serializer, 'adapter', this);
	    set(serializer, 'namespace', namespace);
	    
	    //create wormhole instance
	    wormhole = this.get('wormhole');
	    if(wormhole != null)
		    this.set('wormhole', wormhole.create({serverUrl: this.get('serverDomain')}));
	},
	
	/**
     * override the ajax for cross domain communications
     * @private
     * @param {string} url ajax url
     * @param {string} type 'POST', 'PUT', 'DELETE'
     * @param {Object} hash {data: {holds the dicionary to post}, success: {holds success function}, error: {holds the error function}}
     * @return void
     */
    ajax: function (url, type, hash) {    	
		// if the api key and username are set then append them to url	    	
        if(this.get('apiKey') != null && this.get('username') != null && (type.toLowerCase() == "get" || type.toLowerCase() == "delete")){
            var api_key = this.get('apiKey');
            var username = this.get('username');
            var url = url + '?username=' + username + '&api_key=' + api_key;
        }
        
        //if its post put request then prepare the data
        pass_data = hash.data;

        if (type.toLowerCase() == "post" || type.toLowerCase() == "put"){
        	if(this.get('username') != null && this.get('apiKey') != null){
	        	hash.data['username'] = this.get('username');
	        	hash.data['api_key'] = this.get('apiKey');
	        }
            pass_data = JSON.stringify(hash.data);
        }
        
        //call wormhole ajax or super ajax if wormhole not set
        if(this.get('wormhole') == null){
	        	return this._super(url, type, hash);
        }
        else{
	        	if(this.get('loadingFunction') != null && this.get('stopLoadingFunction') != null)
		        	this.get('loadingFunction')();
	        return this.get('wormhole').ajax(
		        	{
		        		url: url, 
		        		type: type, 
		        		data: pass_data, 
		        		dataType: 'json', 
		        		contentType: 'application/json', 
		        		successFunction: hash.success, 
		        		failFunction: hash.error, 
		        		alwaysFunction: this.get('stopLoadingFunction')
		        	});	
        }
    },

	/**
	 * create a record in the server - sends a post request
	 * @param {DS.Store} store our store instance
	 * @param {subclass of DS.Model} type
	 * @param {subclass of DS.Model} record the record that called this function
	 * @return void 
	 */
	createRecord: function(store, type, record) {
	    var data,
	        root = this.rootForType(type);
	
	    data = record.serialize();
	    xthis = this;
	    this.ajax(this.buildURL(root), "POST", {
		      data: data,
		      success: function(json) {
		      	if(record.get('id') == null){
			        	record.set('id', json.id);
		        }
		        xthis.didCreateRecord(store, type, record, json);
		      },
		      error: function(xhr){
		      	xthis.didError(store, type, record, xhr);
		      }
	    });
	},

	/**
	 * sends a put update request to the server
	 * @param {DS.Store} store our store instance
	 * @param {subclass of DS.Model} type
	 * @param {subclass of DS.Model} record the record that invoke this function
	 * @return void
	 */  
	updateRecord: function(store, type, record) {
	    var id,
	        data;
	
	    id = Em.get(record, 'id');
	    root = this.rootForType(type);
	
	    data = record.serialize();
	    xthis = this;
	    this.ajax(this.buildURL(root, id), "PUT", {
		    data: data,
		    success: function(json) {
		        xthis.didSaveRecord(store, type, record, json);
		    },
		    error: function(xhr){
			    xthis.didError(store, type, record, xhr);
		    }
	    });
	},

	/**
	 * sends a delete request to the server
	 * @param {DS.Store} store our store instance
	 * @param {subclass of DS.Model} type
	 * @param {subclass of DS.Model} record the record that invoke this function
	 * @return void
	 */
	deleteRecord: function(store, type, record) {
	    var id,
	        root;

	    id = get(record, 'id');
	    root = this.rootForType(type);
	    xthis = this;
	    this.ajax(this.buildURL(root, id), "DELETE", {
		    success: function(json) {
		        xthis.didDeleteRecord(store, type, record, json);
		    },
		    error: function(xhr){
			    xthis.didError(store, type, record, xhr);
		    }
	    });
	},
	
	/**
	 * if we have a has many relationship this will help find
	 * the data from the server based on the ids on the objects
	 * @param {DS.Store} store our store instance
	 * @param {subclass of DS.Model} type
	 * @param {string|Array} ids the id to return
	 * @return void
	 */
	findMany: function(store, type, ids) {
	    var url,
	        root = this.rootForType(type);
	
	    ids = this.serializeIds(ids);
	
	    // FindMany array through subset of resources
	    if (ids instanceof Array) {
	      ids = "set/" + ids.join(";") + '/';
	    }
	
	    url = this.buildURL(root);
	    url += ids;
	    xthis = this;
	    this.ajax(url, "GET", {
	      success: function(json) {
	        xthis.didFindMany(store, type, json);
	      }
	    });
	},

	/**
	 * will return the server api url
	 * @param {subclass of DS.Model} record the url for this record
	 * @param {string} suffix used to append a string to the url
	 * @return {string} the url
	 */
	buildURL: function(record, suffix) {
	    var url = this._super(record, suffix);

	    // Add the trailing slash to avoid setting requirement in Django.settings
	    if (url.charAt(url.length -1) !== '/') {
	      url += '/';
	    }
	
	    // Add the server domain if any
	    if (!!this.serverDomain) {
	      url = this.removeTrailingSlash(this.serverDomain) + url;
	    }
	
	    return url;
	},

	/**
	 * The actual nextUrl is being stored. The offset must be extracted from
	 * the string to do a new call.
	 * When there are remaining objects to be returned, Tastypie returns a
	 * `next` URL that in the meta header. Whenever there are no
	 * more objects to be returned, the `next` paramater value will be null.
	 * Instead of calculating the next `offset` each time, we store the nextUrl
	 * from which the offset will be extrated for the next request 
	 */
	sinceQuery: function(since) {
	    var offsetParam,
	        query;
	
	    query = {};
	
	    if (!!since) {
	      offsetParam = since.match(/offset=(\d+)/);
	      offsetParam = (!!offsetParam && !!offsetParam[1]) ? offsetParam[1] : null;
	      query.offset = offsetParam;
	    }
	
	    return offsetParam ? query : null;
	},

	/**
	 * if there is a slash at the end of the url then remove it
	 * @private
	 * @param {string} url 
	 * @return {string} the new url
	 */
	removeTrailingSlash: function(url) {
	    if (url.charAt(url.length -1) === '/') {
	      return url.slice(0, -1);
	    }
	    return url;
	},

	/**
	 * django-tastypie does not pluralize names for lists 
	 * @param {string} name
	 */
	pluralize: function(name) {
	    return name;
	},
  
	/**
	 * find all records
	 * @param {DS.Store} store
	 * @param {subclass of DS.Model} type
	 * @param {DS.Model} record
	 * @return void
	 */
	findAll: function(store, type, record){
	    var json = {}
	    , root = this.rootForType(type)
	    , plural = this.pluralize(root);
	    xthis = this;
	    this.ajax(this.buildURL(root), "GET", {
	        data: null,
	        success: function(json) {
	                xthis.didFindAll(store, type, json);
	                
	        },
	        error: DS.rejectionHandler
	    });
	},

	/**
	 * pass a query to the server
	 * @param {DS.Store} store
	 * @param {subclass of DS.Model} type
	 * @param {Object} query dictionary to send to the server
	 * @param {Object} recordArray
	 */
    findQuery: function(store, type, query, recordArray) {
        var json = {}
        , root = this.rootForType(type)
        , plural = this.pluralize(root);
        xthis = this;
        data = query;
        this.ajax(this.buildURL(root), "GET", {
            data: data,
            success: function(json) {
                    xthis.didFindQuery(store, type, json, recordArray);
            },
            error: DS.rejectionHandler
        });
    },
    
    /**
     * 
	 * @param {DS.Store} store
	 * @param {subclass of DS.Model} type
	 * @param {string} id the id of the user we want to return
	 * @return void
     */
    find: function(store, type, id) {
        var json = {}
        , root = this.rootForType(type);
        xthis = this;
        this.ajax(this.buildURL(root, id), "GET", {
            success: function(json) {
                    xthis.didFindRecord(store, type, json, id);
            },
            error: DS.rejectionHandler
        });
    },
    
    /**
     * will handle the error
     * 
	 * @param {DS.Store} application store
	 * @param {submodule of DS.Model} type the class we are performing the action on
	 * @param {Object} record the problematic record
	 * @param {Object} xhr json response from the server
     */
    didError: function(store, type, record, xhr){
	    	//var json = JSON.parse(xhr.responseText),
	    	//var json = xhr;
		//var serializer = this.get('serializer');
		//errors = serializer.extractValidationErrors(type, json);
		//errors = {error: json.responseText}
		record.set('errors', xhr.responseText);
		store.recordWasError(record);
		//this._super(store, type, record, xhr);
    },
});
