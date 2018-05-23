### Lab 27: Reddit Search

#Overview
- This is a lab assignment from Code Fellows 401 - Javascript.  The objective was to build a simple React App with a search form and a search list component.  The completed project should return a subreddit board as a list of url's contained in hrefs.

##Getting Started
- In order to get started with this code please fork and clone the repo.  You will need a number of dependencies in order to run this project.  See the package.json for a list of dependencies.  This project runs via a webpack build.  There is a script that will give you a development version of the project, npm run watch.  This script enables webpack-dev-server which hot reloads the build based on changes to the code.   

##Architecture
- This project is built using Javascript ES6 with transpilation using Babel.  The code is bundled via webpack.  Main.js contains a React App with a search form component that handles an event which is a Get request to the Reddit API.
- Additional functionality yet to be built is a search list which renders the results of the API call to the DOM.  
 

##Change Log
- 05-22-2018 12:30pm - 3:00pm - Began work on the project
- 05-22-2018 4:15pm - 6:30pm - Search form renders to the DOM
- 05-22-2018 6:30pm - 8:30pm - GET route is returning a response  
- 05-23-2018 7:30pm - 08:30am - added documentation

##Credits and Collaborations
- Thanks Judy Vue for demo code and Daniel Shelton who helped with the GET route.
