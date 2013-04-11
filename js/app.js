// Backbone Modesl 

var FeedItem = Backbone.Model.extend({});

var FeedItems = Backbone.Collection.extend({
    model: FeedItem
});

var FeedComment = Backbone.Model.extend({});

var FeedComments = Backbone.Collection.extend({
    model: FeedComment
});

//Backbone Views

var FeedItemView = Backbone.View.extend({
    template: _.template($("#feed_item_template").html()),

    render: function() {
        //Append Feed Item to DOM
        this.$el.append(this.template(this.model.toJSON()));
        //Check if there are any comments
        _.each(this.model.get('comments')['comments'], function (item) {
            console.log(item);
            feed_comment_view = new FeedCommentView({
                model: new FeedComment(item)
            });
            this.$('#feed_comment_placeholder').append(feed_comment_view.render().el);
        }, this);

        return this;
    }
});


var FeedCommentView = Backbone.View.extend({
    template: _.template($("#feed_comment_template").html()),

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var FeedView = Backbone.View.extend({
    el: '#main-article',
    tagName: 'ul',
    template: _.template($("#feed_template").html()),
    initialize: function(){
        //Render Views
        this.render();
        this.render_feed_items();
    },
    render: function() {
        this.$el.html(this.template());
        return this;
    },
    render_feed_items: function() {
        
        _.each(this.collection.models, function (item) {
            feed_item_view = new FeedItemView({
                model: item
            });
            this.$('#feed_item_placeholder').append(feed_item_view.render().el);
        }, this);

    }
});

var sf_token;

//Render Views and bind data
function display_feed(feed_items){

    var feed = new FeedItems(feed_items['items']); //For user and group feeds call - /services/data/v27.0/chatter/feeds/record/0F9x000000009dUCAQ/feed-items

    var feed_view = new FeedView({
        collection: feed,
    });

};

//Salesforce login
function login(){
    // Salesforce login URL
    var loginURL = 'https://login.salesforce.com/',

    // Consumer Key from Setup | Develop | Remote Access
        consumerKey = '3MVG9A2kN3Bn17htg1ij7N9teKYZE8ggmc31EJ5gUvf5aslbR5nUL4KivH0nUDxMG3etRgCTP0WFNCEkBFu0L',

    // Callback URL from Setup | Develop | Remote Access
        callbackURL = 'https://login.salesforce.com/services/oauth2/success',

    // Instantiating forcetk ClientUI
        ftkClientUI = new forcetk.ClientUI(loginURL, consumerKey, callbackURL,
                function forceOAuthUI_successHandler(forcetkClient) { // successCallback
                    sf_token = forcetkClient.sessionId;

                    forcetkClient.ajax('/v27.0/chatter/feeds/news/me/feed-items',
                        function(data){
                            display_feed(data);
                        },
                        function(error){
                            console.log(error);
                        },
                        'GET',
                        {},
                        false
                    );
                },

                function forceOAuthUI_errorHandler(error) { // errorCallback
                    console.log(error);
                }
            );

    // Initiating login process
    ftkClientUI.login();
}

