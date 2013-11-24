/**
 * component to add pagination to a page
 * 
 * ```handlebars
 * {{nerdeez-pagination paginationController=this}}
 * ```
 * 
 * @param paginationController {subclass of Ember.ArrayController} holds the controller that his content will change
 * 
 * Created October 22nd, 2013
 * @author: Yariv Katz
 * @version: 1.0
 * @copyright: Nerdeez
 */

Nerdeez.NerdeezPaginationComponent = Ember.Component.extend({
    /**
     * holds the current page we are in
     * @type {int}
     */
    paginationPage: 0,    
    
    /**
     * if the pagination is loading then this will be true
     * @type {Boolean}
     */
    paginationIsLoading: false,
        
    /**
     * the controller that we are changing the content of
     * @type {subclass on Ember.ArrayController}
     */
    paginationController: null,
       

    didInsertElement: function(){
        var xthis = this;   
        $(window).scroll(function(e) {
            if (xthis.get('paginationIsLoading')) return;
            if ($(window).scrollTop() >= ($(document).height() - $(window).height())) {
                //will hold the total number of records of the model
                var paginationTotalResult = xthis.get('paginationController.content.content.totalCount');
                if(paginationTotalResult != null && xthis.get('paginationController.content.length') >= paginationTotalResult) return;
                xthis.set('paginationIsLoading', true);
                var page = xthis.get('paginationPage');
                if (page == null) page = 0;
                var offset = xthis.get('paginationController.content.query.limit');
                var model = xthis.get('paginationController.content.type');
                var controller = xthis.get('paginationController');
                var content = xthis.get('paginationController.content');
                //init extra params var
                var extraParams = {};
                //get extra params from content arrat query
                for (var property in content.query) {
                    if (content.query.hasOwnProperty(property)) {
                        //set extraParams key value pair to match
                        //the original query
                        extraParams[property] = content.query[property];
                    }
                }
                page = page + 1;
                if (extraParams == null) extraParams = {};
                extraParams['offset'] = offset * page;
                xthis.set('paginationPage', page);
                var newObjects = model.find(extraParams);
                newObjects.on('didLoad', function(){
                    content.addObjects(this);
                    controller.set('content', content);
                    xthis.set('paginationIsLoading', false);
                });
            }
        });
    }
    
    
});

