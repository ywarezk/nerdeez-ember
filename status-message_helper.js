

Ember.Handlebars.registerBoundHelper('status', function() {
  return new Handlebars.SafeString(
  	'<div class="status"><div class="alert alert-success">Message sent.</div>'
  	+'<div class="alert alert-error">Error: Message not sent.</div></div>');
});
