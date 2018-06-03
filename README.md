Lab 27: Reddit Search Engine
===

**Author:** Jennifer Piper

This is a very simple web app to search the Reddit API with user-input search terms.

## Getting Started
In a node.js environment, from the root of this repo, install dependencies:
* `npm i`

Create a `.env` file and define `CDN_URL` in that file:
* `CDN_URL=/`

To start the app at http://localhost:8080/:
* ` npm run watch`


- Type the name of a Reddit board and a results limit into the displayed form. 
- The results limit must be between 0 and 100. If it is outside that range, an error message will display and the form field's borders will turn red. 
- If there is a Reddit board with that name, the App will display links to the specified number of results along with a count of the number of Ups for each topic.
- If there is no Reddit board with that name, an error message will display and the form field's borders will turn red.
