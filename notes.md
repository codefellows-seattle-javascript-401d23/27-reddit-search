 ```"watch": "webpack-dev-server --config webpack.dev.js"```
 this actually creates a build file that transpiles all the code, when its run--- its temporary tho and you cant see it

 ``` loader: 'babel-loader', // this is transpiling```
 is doing a sweep of our files to search for files to transpile

 loaders are basically turning things into something else-- in this case taking many different kinds of files and turning them intojavascript
