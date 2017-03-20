Meteor.methods({
  'get_url_info':function(url){
    this.unblock();
    let content = HTTP.get(url).content;
    let title = "";
    let description = "";
    let titleRegExp = /<title.*?>([\w\W]+)<\/title>/g;
    let descriptionRegExp = /<meta.+?name="description".+?content="(.+?)"/g;
    let title_matchs = titleRegExp.exec(content);
    let description_matchs = descriptionRegExp.exec(content);

    if(title_matchs)
      title = title_matchs[1];
    if(description_matchs)
      description = description_matchs[1];

    return {title: title, description: description};
  },
  'addWebsite':function(website){
    Websites.insert(website);
  },
  'updateWebsite':function(website_id, all_votes){
    Websites.update(website_id,{
      $set: all_votes
    });
  },
  'addComment':function(comment){
    Comments.insert(comment);
  },
  'addVote':function(vote){
    Votes.insert(vote);
  },
  'updateVote':function(vote_id, vote){
    Votes.update(vote_id, vote);
  },
});
