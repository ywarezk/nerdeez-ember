/**
 * django-tastypie serializer - used to communicate with a rest server implemented in tastypie
 * usually works with tastypie adapter
 * 
 * Example
 * 
 * ```javascript
 * app.store = DS.Store.create(
 *     {
 * 	       adapter: DS.DjangoTastypieAdapter.extend({
 *              serializer: DS.DjangoTastypieSerializer.extend({
 * 	                . . .
 *              }) 	  	
 *         })
 *     } 	
 * );
 * ```
 * 
 * @requires ember.js
 * @requires ember-data.js
 * @version 1.0
 * @copyright nerdeez.com
 * @author Yariv Katz
 * 
 */

var get = Ember.get, set = Ember.set;

//create the namespace if the namespace doesnt exist
if (typeof Nerdeez === "undefined")
	var Nerdeez = Ember.Namespace.create();

/**
 * this class knows how to handle with the json response of a django-tastypie server
 * @class DjangoTastypieSerializer
 * @namespace Nerdeez
 * @extends DS.JSONSerializer
 * @requires ember.js
 * @requires ember-data.js 
 */
Nerdeez.DjangoTastypieSerializer = DS.JSONSerializer.extend({

	type: null,

	/**
	 * @private
	 * from the meta return a url
	 * @param {Object} meta the meta recieved from the server response
	 * @param {number} id
	 * @return {string}
	 */
	getItemUrl: function(meta, id){
	    var url;
	
	    url = get(this, 'adapter').rootForType(meta.type);
	    return ["", get(this, 'namespace'), url, id, ""].join('/');
	},

	/**
	 * @see {DS.Serializer}
	 */
	keyForBelongsTo: function(type, name) {
	    //return this.keyForAttributeName(type, name) + "_id";
	    return this.keyForAttributeName(type, name);
	},

	/**
	 * @see {DS.Serializer}
	 */
	addBelongsTo: function(hash, record, key, relationship) {
	    var id,
	        related = get(record, relationship.key);
	    if(related != null)
	        id = get(related, this.primaryKey(related));
	
	    if (!Ember.isNone(id)) { hash[key] = this.getItemUrl(relationship, id); }
	},

	/**
	 * @see {DS.Serializer}
	 */
	addHasMany: function(hash, record, key, relationship) {
	    var self = this,
	        serializedValues = [],
	        id = null;
	
	    key = this.keyForHasMany(relationship.type, key);
	
	    value = record.get(key) || [];
	
	    value.forEach(function(item) {
	      id = get(item, self.primaryKey(item));
	      serializedValues.push(self.getItemUrl(relationship, id));
	    });
	
	    hash[key] = serializedValues;
	},

	/**
	 * @see {DS.Serializer}
	 */
	extract: function(loader, json, type, record) {
	    this.extractMeta(loader, type, json);
	    this.sideload(loader, type, json);
	
	    if (json) {
	      if (record) { loader.updateId(record, json); }
	      this.extractRecordRepresentation(loader, type, json);
	    }
	},

	/**
	 * @see {DS.Serializer}
	 */
	extractMany: function(loader, json, type, records) {
	    this.sideload(loader, type, json);
	    //this.extractMeta(loader, type, json);
	
	    if (json.objects) {
	      var objects = json.objects, references = [];
	      if (records) { records = records.toArray(); }
	
	      for (var i = 0; i < objects.length; i++) {
	        if (records) { loader.updateId(records[i], objects[i]); }
	        var reference = this.extractRecordRepresentation(loader, type, objects[i]);
	        references.push(reference);
	      }
	      references.set('totalCount', json.meta.total_count);
	      loader.populateArray(references);
	    }
	},

	/**
	 * @see {DS.Serializer}
	 */
	extractMeta: function(loader, type, json) {
	    var meta = json.meta,
	      since = this.extractSince(meta);
	
	    // this registers the id with the store, so it will be passed
	    // into the next call to `findAll`
	    if (since) { loader.sinceForType(type, since); }
	},

	/**
	 * @see {DS.Serializer}
	 */
	extractSince: function(meta) {
	    if (meta) {
	      return meta.next;
	    }
	},
  
	/**
     * Tastypie default does not support sideloading
     */
	sideload: function(loader, type, json, root) {

	},

	/**
     * ASSOCIATIONS: DESERIALIZATION
     * Transforms the association fields from Resource URI django-tastypie format
     */
	_deurlify: function(value) {
	    if (typeof value === "string") {
	      return value.split('/').reverse()[1];
	    } else {
	      return value;
	    }
	},

	/**
	 * @see {DS.Serializer}
	 */
	extractHasMany: function(type, hash, key) {
	    var value,
	      self = this;
	
	    value = hash[key];
	    //var xtype = type;
	    self.typeFromAlias();
	    this.set('type', self.aliases.get(key));
	    if (!!value) {
	      value.forEach(function(item, i, collection) {
	        collection[i] = self._deurlify(item);
	        collection[i].type = self.get('type');
	      });
	    }
	
	    return value;
	},

	/**
	 * @see {DS.Serializer}
	 */
	extractBelongsTo: function(type, hash, key) {
	    var value = hash[key];
	
	    if (!!value) {
	      value = this._deurlify(value);
	    }
	    return value;
	}

});

