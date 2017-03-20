import '/imports/api/websites.js';
import '/imports/api/comments.js';
import '/imports/api/votes.js';

Router.configure({
    layoutTemplate: 'main'
});

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

Meteor.subscribe("websites");
Meteor.subscribe("comments");
Meteor.subscribe("votes");

Template.website_list.helpers({
	websites:function(){
		return Websites.find({}, {sort: {upvotes : -1, downvotes:1}});
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

      new_vote = {website:website_id, user:user_id, vote_type:vote_type};

			if(vote){
				Meteor.call('updateVote', vote._id, new_vote);
			} else {
				Meteor.call('addVote', new_vote);
			}

      upvotes = Votes.find({website: website_id, vote_type: 1}).count()
      downvotes = Votes.find({website: website_id, vote_type: 2}).count()
      all_votes = {upvotes: upvotes, downvotes: downvotes};
      Meteor.call('updateWebsite', website_id, all_votes);

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

      new_vote = { website:website_id, user:user_id, vote_type:vote_type};

			if(vote){
		    Meteor.call('updateVote', vote._id, new_vote);
		  } else {
		    Meteor.call('addVote', new_vote);
	    }

      upvotes = Votes.find({website: this._id, vote_type: 1}).count()
      downvotes = Votes.find({website: this._id, vote_type: 2}).count()

      all_votes = {upvotes: upvotes, downvotes: downvotes};
      Meteor.call('updateWebsite', website_id, all_votes);

      $().button('toggle')
      }
			return false;
	 }
 });

Template.registerHelper('date', function(){
  if(!jQuery.isEmptyObject(this)){
	   let obj_id = this._id;
     if(typeof this.url == "undefined")
		   var obj = Comments.findOne({_id: obj_id});
     else {
       var obj = Websites.findOne({_id: obj_id});
     }

		 return beautifyDate(obj.createdOn);
	}
});

Template.website_form.events({
  "click .js-toggle-website-form":function(event){
	   $("#website_url_form").toggle('slow');
	},
	"submit .js-save-website-form":function(event, template){
	   event.preventDefault();
		 let target = event.target;
		 let url = target.url.value;
		 let title = target.title.value;
		 let description = target.description.value;
		 console.log("The url they entered is: "+url);

     website = {
       title:title,
       url:url,
       description:description,
       createdOn:new Date(),
       upvotes:0,
       downvotes: 0,
     };

     if( title == "" || description == ""){
       Meteor.call('get_url_info', url, function(error, response){
       if(error)
         $("#website_form").toggle('slow');
       else{
         url = url.replace(/http:\/\/|https:\/\//gi, "");
         let title = response.title;
         let description = response.description;
         if(response.title != "" && response.description != ""){
           Meteor.call('addWebsite', website);

          template.find("form").reset();
       		$("#website_url_form").toggle('slow');
          } else {
            $("#website_form").toggle('slow');
          }
      }
        return false;
     });
    } else{
	     Meteor.call('addWebsite', website);
		 	 template.find("form").reset();
			 $("#website_form").toggle('slow');
      }
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
     comment = {
			 comment: comment,
			 createdOn:new Date(),
			 user: user,
			 website: website,
		 };
		 Meteor.call("addComment", comment);
		 template.find("form").reset();
		 return false;
	}
});

function beautifyDate(date){
  let month_index = date.getMonth();
  let month = get_months()[month_index];
  let day = date.getUTCDate();
  let year = date.getFullYear();
  let beautifulDate = month + ", " + day + ", " + year;

  return beautifulDate;
}

function get_months(){
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
