// https://github.com/firebase/emberFire

// http://www.bootply.com/85861#

App = Ember.Application.create({
    LOG_TRANSITIONS: false
});

App.ApplicationAdapter = DS.FirebaseAdapter.extend({
  firebase: new Firebase('https://spokaneedibletree.firebaseio.com')
});

App.ApplicationSerializer = DS.FirebaseSerializer.extend();

App.Trees = DS.Model.extend({
	contact: DS.attr('string'),
	dateAdded: DS.attr('date'),
    date: function() {
        return moment(this.get('dateAdded')).format('MMMM Do, YYYY');
    },
    type: DS.attr('string'),
	location: DS.attr('string'),
	photo: DS.attr('string')
});

App.Router.map(function() {
  this.resource('trees', { path: '/' });
});

App.TreesRoute = Ember.Route.extend({
    model: function(params) {
        return this.store.findAll('trees').then(function(data){
            return data;
        }, function(reason) {
            console.log("Couldn't get the answer! Reason: ", reason);
        });
    },
    actions: {
    }
});

App.TreesView = Ember.View.extend({

});
