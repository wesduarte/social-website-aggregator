Router.configure({
    layoutTemplate: 'main'
});

Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");
Votes = new Mongo.Collection("votes");

get_months = function(){
  months = new Array(12);
  months[0] = "January";
  months[1] = "February";
  months[2] = "March";
  months[3] = "April";
  months[4] = "May";
  months[5] = "June";
  months[6] = "July";
  months[7] = "August";
  months[8] = "September";
  months[9] = "October";
  months[10] = "November";
  months[11] = "December";

  return months;
}

months = get_months();

if (Meteor.isClient) {

	Router.route('/', {
		template:'website_list_page'
	});

	Router.route('/details/:_id', {
		template: 'website_details',
		data: function() {
				let website_id = this.params._id;
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
			return Comments.find({website: this._id}, {sort: {createdOn: -1}});
		}
	});

	Template.comment_item.helpers({
		get_user:function(user_id){
			let user = Meteor.users.findOne({_id: user_id});
			return user.username;
		}
	});

	Template.website_item.events({
		"click .js-upvote":function(event){

      if(Meteor.user()){
			   let website_id = this._id;
			   let user_id = Meteor.userId();
			   let vote_type = 1;
			   console.log("Up voting website with id "+website_id);

			   let vote = Votes.findOne({website: website_id, user: user_id});

			   if(vote){
				    Votes.update(vote._id, {website:website_id, user:user_id, vote_type:vote_type});
			   } else {
				    Votes.insert({website:website_id, user:user_id, vote_type:vote_type});
			   }

         $().button('toggle')

      }

			return false;
		},
		"click .js-downvote":function(event){

      if(Meteor.user()){
			   let website_id = this._id;
			   let user_id = Meteor.userId();
			   let vote_type = 2;
			   console.log("Down voting website with id "+website_id);

			   var vote = Votes.findOne({website: website_id, user: user_id});

			   if(vote){
				    Votes.update({_id: vote._id}, { website:website_id, user:user_id, vote_type:vote_type});
			   } else {
				    Votes.insert({website:website_id, user:user_id, vote_type:vote_type});
			   }

         $().button('toggle')
      }

			return false;
		}
	})

	Template.registerHelper('date', function(){

		if(!jQuery.isEmptyObject(this)){
      console.log(this);
			let obj_id = this._id;



      if(typeof this.url == "undefined")
			   var obj = Comments.findOne({_id: obj_id});
      else {
         var obj = Websites.findOne({_id: obj_id});
      }

      let month_index = obj.createdOn.getMonth();
      let month = months[month_index];
      let day = obj.createdOn.getUTCDate();
      let year = obj.createdOn.getFullYear();
      let date = month + ", " + day + ", " + year;

      console.log(months);

			return date;
		}
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		},
		"submit .js-save-website-form":function(event, template){
			event.preventDefault();
			let target = event.target;
			console.log("My target: "+target);
			let url = target.url.value;
      url = url.replace(/http:\/\/|https:\/\//gi, "");
			let title = target.title.value;
			let description = target.description.value;
			console.log("The url they entered is: "+url);

			Websites.insert({
			 title:title,
			 url:url,
			 description:description,
			 createdOn:new Date(),
		 });

		 	template.find("form").reset();
			$("#website_form").toggle('slow');

			return false;

		}
	});

	Template.comment_form.events({
		"submit .js-save-comment-form":function(event, template){
			event.preventDefault();
			let target = event.target;
			let website = this._id;
			let user = Meteor.userId();
			let comment = target.comment.value;


			console.log("The comment they entered is: "+comment);

			Comments.insert({
			 comment: comment,
			 createdOn:new Date(),
			 user: user,
			 website: website,
		 });

		 	template.find("form").reset();

			return false;

		}
	});

}


if (Meteor.isServer) {
  Meteor.startup(function () {
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
