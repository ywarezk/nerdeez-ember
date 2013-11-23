var Ember = window.Ember;

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
  var firstObject = array.objectAt(0);
  if(item != firstObject){
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
	var mod = options.hash.mod;
	for(var i=0; i<array.get('length'); i++){
		var currentObject = array.objectAt(i);
		if(item == currentObject){
			whichItem = i;
		}
	}
	if(whichItem%mod == 0){
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
	var mod = options.hash.mod;
	for(var i=0; i<array.get('length'); i++){
		var currentObject = array.objectAt(i);
		if(item == currentObject){
			whichItem = i;
		}
	}
	if(whichItem%mod == 0 && whichItem != 0){
		//console.log('modZeroExcludeFirst');
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
	if(item == array.objectAt(array.get('length') - 1)){
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
	var firstObject = array.objectAt(0);
	if(item == firstObject){
		//console.log('isFirst');
		return new Ember.Handlebars.SafeString(options.hash.html);
	}
	return '';
});

/**
 * put this in each handlebar block usually before the end of the form element
 * to return the status from the form submition
 * 
 * usage
 * 
 * ```handlebar
 * {{status controller messageBinding="message" isSuccessBinding="isSuccess" isShowBinding="isShowStatus"}}
 * ```
 * 
 * the above will create a status info bind it to the controller and in the controller bind the properties: message, isSuccess, isShowStatus
 * 
 * @param {Ember.Object} the item which is bounded to the status paramaters
 * @param {Object} options inside the hash we have {isShow: "true if need to show the status", isSuccess: "true if its a success status", message: 'the message to display'}
 * @return {Handlebars.SafeString}
 */
Ember.Handlebars.registerBoundHelper('status', function(item, options) {
    var isShow = options.hash.isShow;
    var isSuccess = options.hash.isSuccess;
    var message = options.hash.message;
    var html = '';
    if(isShow){
        html = '<div class="info">';
        if(isSuccess){
            html+='<div class="alert alert-success"><i class="icon-ok"></i>' + message + '<a class="close" data-dismiss="alert">x</a></div>';
        }
        else{
            html+='<div class="alert alert-danger"><i class="icon-remove"></i>' + message + '<a class="close" data-dismiss="alert">x</a></div>';
        }
        html+='</div>';
    }
    return new Handlebars.SafeString(html);
});

/**
 * 
 * will put a loading roller and bind it to what is sent to the handlebar
 * 
 * usage
 * 
 * ```handlebar
 * {{loading controller isLoadingBinding="isLoading"}}
 * ```
 * 
 * the above will bind the loading screen to the controller isLoading property
 * 
 * @param {Ember.Object} the item which is bounded to the status paramaters
 * @param {Object} options inside the hash we have {isLoading: "true if need to show the loading"}
 * @return {Handlebars.SafeString}
 */
// Ember.Handlebars.registerBoundHelper('loading', function(item, options) {
    // var isLoading = options.hash.isLoading;
    // var html = '';
    // if(isLoading){
        // html = '<div class="loading"><i class="icon-spin icon-spinner"></i></div>';
    // }
    // return new Handlebars.SafeString(html);
// });
Ember.Handlebars.registerBoundHelper('loading', function() {
    return new Ember.Handlebars.SafeString('<div class="loading"><i class="icon-refresh icon-spin"></i></div>');
});

/**
 * 
 * will check if 2 vars are equal
 * 
 * usage
 * 
 * ```handlebar
 * {{#ifCond v1 v2}}
 * {{/ifCond}}
 * ```
 * 
 * 
 * @param {number|string} v1 the first variable
 * @param {number|string} v2 the second variable
 * @return {Handlebars.SafeString}
 */
Ember.Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if (Ember.typeOf(v2) === "string"){    
        if(this.get(v1) == v2 || this.get(v1) == this.get(v2)) {
            return options.fn(this);
        }
    }
    else{
        if(this.get(v1) == v2) {
            return options.fn(this);
        }
    }
    return options.inverse(this);
});

/**
 * 
 * will format the date
 *
 * in order to use this helper you must include 'moment.js' library in your project.
 *
 * you can change the language format
 * by passing a language parameter.
 *
 * you can change the format of the date by passing a format 
 * parameter. 
 * 
 * parameters can be found in the library docs at: http://momentjs.com/
 * 
 * usage
 * 
 * ```handlebars
 * {{format-date date "L" "he"}}
 *
 * ```
 * where date is object of type Date, "L" - is format type, and "he" - is language (hebrew) 
 *
 * another usage example :
 *
 * '''handlebars
 * 
 * {{format-date date "DD/MM/YY HH:mm" "he"}}
 *
 * '''
 *
 * note : you don't have to pass the language param, if you're only formatting to 
 * date which includes only numbers (for example, if you would like to add November, 
 * you would have to add lang='en')
 * 
 * @param {date} date 
 * @param {string} format
 * @param {string} lang
 * @return {string}
 */

Ember.Handlebars.registerHelper('format-date', function(date,format,lang) {
    debugger;
    return moment(this.get(date)).lang(lang).format(format);
});
