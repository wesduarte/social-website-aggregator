import '/imports/api/websites.js';
import '/imports/api/comments.js';
import '/imports/api/votes.js';

Meteor.startup(function () {
  if (!Websites.findOne()){
    console.log("No websites yet. Creating starter data.");
    Websites.insert({
      title:"Goldsmiths Computing Department",
    	url:"https://www.gold.ac.uk/computing/",
    	description:"This is where this course was developed.",
    	createdOn:new Date(),
      upvotes:0,
      downvotes: 0,
    });
    Websites.insert({
    	title:"University of London",
    	url:"https://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
    	description:"University of London International Programme.",
    	createdOn:new Date(),
      upvotes:0,
      downvotes: 0,
    });
    Websites.insert({
    	title:"Coursera",
    	url:"https://www.coursera.org",
    	description:"Universal access to the world’s best education.",
    	createdOn:new Date(),
      upvotes:0,
      downvotes: 0,
    });
    Websites.insert({
    	title:"Google",
    	url:"http://www.google.com",
    	description:"Popular search engine.",
    	createdOn:new Date(),
      upvotes:0,
      downvotes: 0,
    });
  }
});

Meteor.publish("websites", function(){
  return Websites.find({});
});

Meteor.publish("comments", function(){
  return Comments.find({});
});

Meteor.publish("votes", function(){
  return Votes.find({});
});
