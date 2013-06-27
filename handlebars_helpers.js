/**
 * put this in each handlebar block to see if this is not the first item of the array
 * 
 * usage
 * 
 * ```handlebar
 * {{#each controller}}
 *    {{notFirst this controller.content html="<div>Not the fist item in array</div>"}}
 * {{/each}}
 * ```
 * 
 * @param {DS.Model} item teh object to check in the each
 * @param {DS.RecordArray} array - the arrays of objects to check from
 * @param {Object} options {html: "the html if this is true"}
 * @return {Handlebars.SafeString}
 */
Ember.Handlebars.registerBoundHelper('notFirst', function(item, array, options) {
  firstObject = array.objectAt(0);
  if(item != firstObject){
	  	console.log('notFirst');
	  	return new Ember.Handlebars.SafeString(options.hash.html);
  }
  return '';
});

/**
 * put this in each handlebar block to check every time you reached the nth item 
 * 
 * usage
 * 
 * ```handlebar
 * {{#each controller}}
 *    {{modZero this controller.content mod="4" html='<div class="row-fluid">'}}
 * {{/each}}
 * ```
 * 
 * @param {DS.Model} item teh object to check in the each
 * @param {DS.RecordArray} array - the arrays of objects to check from
 * @param {Object} options {html: "the html if this is true", mod: "4"}
 * @return {Handlebars.SafeString}
 */
Ember.Handlebars.registerBoundHelper('modZero', function(item, array, options) {
	var whichItem = 0;
	mod = options.hash.mod;
	for(var i=0; i<array.get('length'); i++){
		currentObject = array.objectAt(i);
		if(item == currentObject){
			whichItem = i;
		}
	}
	if(whichItem%mod == 0){
		console.log('modZero');
		return new Ember.Handlebars.SafeString(options.hash.html);
	}
	return '';
});

/**
 * put this in each handlebar block to check every time you reached the nth item but if zero then ignore
 * 
 * usage
 * 
 * ```handlebar
 * {{#each controller}}
 *    {{modZero this controller.content mod="4" html='<div class="row-fluid">'}}
 * {{/each}}
 * ```
 * 
 * @param {DS.Model} item teh object to check in the each
 * @param {DS.RecordArray} array - the arrays of objects to check from
 * @param {Object} options {html: "the html if this is true", mod: "4"}
 * @return {Handlebars.SafeString}
 */
Ember.Handlebars.registerBoundHelper('modZeroExcludeFirst', function(item, array, options) {
	var whichItem = 0;
	mod = options.hash.mod;
	for(var i=0; i<array.get('length'); i++){
		currentObject = array.objectAt(i);
		if(item == currentObject){
			whichItem = i;
		}
	}
	if(whichItem%mod == 0 && whichItem != 0){
		console.log('modZeroExcludeFirst');
		return new Ember.Handlebars.SafeString(options.hash.html);
	}
	return '';
});

/**
 * put this in each handlebar block to check every time you reached the last item 
 * 
 * usage
 * 
 * ```handlebar
 * {{#each controller}}
 *    {{isLast this controller.content html="</div>"}}
 * {{/each}}
 * ```
 * 
 * @param {DS.Model} item teh object to check in the each
 * @param {DS.RecordArray} array - the arrays of objects to check from
 * @param {Object} options {html: "the html if this is true"}
 * @return {Handlebars.SafeString}
 */
Ember.Handlebars.registerBoundHelper('isLast', function(item, array, options) {
	if(item == array.objectAt(array.get('length') - 1) && array.get('isUpdating') == false){
		console.log('isLast');
		return new Ember.Handlebars.SafeString(options.hash.html);
	}
	return '';	
});

/**
 * put this in each handlebar block to check every time you're in the first item 
 * 
 * usage
 * 
 * ```handlebar
 * {{#each controller}}
 *    {{isFirst this controller.content html="<div>The first item of an array</div>"}}
 * {{/each}}
 * ```
 * 
 * @param {DS.Model} item teh object to check in the each
 * @param {DS.RecordArray} array - the arrays of objects to check from
 * @param {Object} options {html: "the html if this is true"}
 * @return {Handlebars.SafeString}
 */
Ember.Handlebars.registerBoundHelper('isFirst', function(item, array, options) {
	firstObject = array.objectAt(0);
	if(item == firstObject){
		console.log('isFirst');
		return new Ember.Handlebars.SafeString(options.hash.html);
	}
	return '';
});