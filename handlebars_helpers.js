/*var getPath = Ember.Handlebars.getPath;
Ember.Handlebars.registerHelper('everyNth', function(label, every, options) {
	var context = (options.fn.contexts && options.fn.contexts[0]) || this;
	var val1 = getPath(context, label, options.fn);
	//var val2 = getPath(context, val2, options.fn);
	var fn = options.fn, inverse = options.inverse;
	var ret = "";
	if(val1 && val1.get('length') > 0) {
	    for(var i=0, j=val1.get('length'); i<j; i++) {
			var modZero = i % every === 0;
		    ret = ret + fn(_.extend({}, context[i], {
		        isModZero: modZero,
		        isModZeroNotFirst: modZero && i > 0,
		        isLast: i === val1.get('length') - 1
		    }));
	    }
	} else {
	    ret = inverse(this);
	}
	return ret;
});

/*Ember.Handlebars.registerBoundHelper('everyNth', function(label, every, options) {
  var options = Array.prototype.pop.call(arguments);
  var string = options.data.properties[1];
  return (count > 1 ? string+"s" : string);
});*/

WorkerimClient.registerViewHelper('everyNth', Ember.View.extend({
  tagName: 'span',

  template: Ember.Handlebars.compile('{{view.formattedContent}}'),

  formattedContent: (function() {
    var content = this.get('content');

    if (content != null) {
      // Capitalize `content`.
      return content.charAt(0).toUpperCase() + content.slice(1);
    }
  }).property('content')
}));