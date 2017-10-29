# social-website-aggregator

This project was created as an assignment of Introduction To Meteor.js Development Course.

The project consists in a simple social website aggregator.

- The application allow users to:

 1. Sign in or sign up. Post an website. Up vote a website by clicking an up arrow button on the page.
 2. Down vote a website by clicking a down arrow button on the page.
 3. Leave a comment in a website's details page.

- Anonymous users can see posted websites and their details pages.

- An website have an title, an url, a description, a creation date and a link to a details page.
	- On a details page is displayed the title of website, which redirects to its url, creation date, description and comments of the website. 


## Setting Up:

#### Install Meteor

    meteor npm install

#### Dependencies:

    meteor add twbs:bootstrap
    meteor add shell-server
    meteor add iron:router
    meteor add http
    meteor add stylus
    meteor add accounts-password
    meteor add ian:accounts-ui-bootstrap-3

