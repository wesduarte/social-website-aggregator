Router.configure({
    layoutTemplate: 'main'
});

Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");
Votes = new Mongo.Collection("votes");

if (Meteor.isClient) {

	Router.route('/', {
		template:'website_list_page'
	});

	Router.route('/details/:_id', {
		template: 'website_details',
		data: function() {
				var website_id = this.params._id;
				return Websites.findOne({_id: website_id});
			}
		});

	Accounts.ui.config({
	  requestPermissions: {
	    facebook: ['user_likes'],
	    github: ['user', 'repo']
	  },
	  requestOfflineToken: {
	    google: true
	  },
	  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
	});

	/////
	// template helpers
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({});
		}
	});

	Template.website_item.helpers({
		upvotes:function(){
			console.log(Votes.find({website: this._id, vote_type: 1}).count());
			return Votes.find({website: this._id, vote_type: 1}).count();
		},
		downvotes:function(){
			return Votes.find({website: this._id, vote_type: 2}).count();
		}

	});

	Template.website_details.helpers({
		comments:function(){
			return Comments.find({website: this._id});
		}
	});

	Template.comment_item.helpers({
		get_user:function(user_id){
			var user = Meteor.users.findOne({_id: user_id});
			return user.username;
		}
	});


	/////
	// template events
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			var user_id = Meteor.userId();
			var vote_type = 1;
			console.log("Up voting website with id "+website_id);

			var vote = Votes.findOne({website: website_id, user: user_id});

			if(vote){
				Votes.update(vote._id, {website:website_id, user:user_id, vote_type:vote_type});
			} else {
				Votes.insert({website:website_id, user:user_id, vote_type:vote_type});
			}
			// put the code in here to add a vote to a website!

			return false;// prevent the button from reloading the page
		},
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			var user_id = Meteor.userId();
			var vote_type = 0;
			console.log("Down voting website with id "+website_id);

			var vote = Votes.findOne({website: website_id, user: user_id});

			if(vote){
				Votes.update({_id: vote._id}, { website:website_id, user:user_id, vote_type:vote_type});
			} else {
				Votes.insert({website:website_id, user:user_id, vote_type:vote_type});
			}

			// put the code in here to remove a vote from a website!

			return false;// prevent the button from reloading the page
		}
	})

	Template.registerHelper('date', function(){
		//console.log(this);

		if(!jQuery.isEmptyObject(this)){
			var website_id = this._id;
			var website = Websites.findOne({_id: website_id});
			return (website.createdOn.getMonth() + 1) + "/" +  website.createdOn.getDay() + "/" + website.createdOn.getFullYear();
		}
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		},
		"submit .js-save-website-form":function(event, template){
			event.preventDefault();
			// here is an example of how to get the url out of the form:
			var target = event.target;
			console.log("My target: "+target);
			var url = target.url.value;
			var title = target.title.value;
			var description = target.description.value;
			console.log("The url they entered is: "+url);

			//  put your website saving code in here!

			Websites.insert({
			 title:title,
			 url:url,
			 description:description,
			 createdOn:new Date(),
		 });

		 	template.find("form").reset();
			$("#website_form").toggle('slow');

			return false;// stop the form submit from reloading the page

		}
	});

	Template.comment_form.events({
		"submit .js-save-comment-form":function(event, template){
			event.preventDefault();
			// here is an example of how to get the url out of the form:
			var target = event.target;
			var website = this._id;
			var user = Meteor.userId();
			var comment = target.comment.value;


			console.log("The comment they entered is: "+comment);

			//  put your website saving code in here!

			Comments.insert({
			 comment: comment,
			 createdOn:new Date(),
			 user: user,
			 website: website,
		 });

		 	template.find("form").reset();

			return false;// stop the form submit from reloading the page

		}
	});

}


if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department",
    		url:"http://www.gold.ac.uk/computing/",
    		description:"This is where this course was developed.",
    		createdOn:new Date(),

    	});
    	 Websites.insert({
    		title:"University of London",
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
    		description:"University of London International Programme.",
    		createdOn:new Date(),

    	});
    	 Websites.insert({
    		title:"Coursera",
    		url:"http://www.coursera.org",
    		description:"Universal access to the world’s best education.",
    		createdOn:new Date(),

    	});
    	Websites.insert({
    		title:"Google",
    		url:"http://www.google.com",
    		description:"Popular search engine.",
    		createdOn:new Date(),

    	});
    }
  });
}
