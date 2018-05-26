## Lab27 Reddit-Search

## Install the following npm packages before using this application:

```npm i -D sass-loader node-sass css-loader style-loader html-webpack-plugin webpack webpack-cli webpack-dev-server webpack-merge babel-eslint babel-core babel-loader babel-preset-env babel-preset-react babel-preset-stage-0 react react-dom dotenv eslint eslint-config-airbnb-base eslint-plugin-import eslint-plugin-jest eslint-plugin-react babel-plugin-transform-react-jsx-source file-loader superagent mini-css-extract-plugin react-router-dom prop-types react-test-renderer```

## Functions
**searchFormBoard()** is where the user can input the keyword they are searching Reddit pages for.
**searchFormLimit()** is called when the user wants to adjust the number or results while searching.
**handleSubmit()** is what submits the get request to the reddit api.
**redditSelect(thingSearchedFor, searchLimit)** is the actual get request that hits the reddit API.
**renderSearchResults()** will prepare the results so they can be displayed to the DOM.
**componentDidUpdate()** is just a notification to the developer to let them know the component's state has updated successfully.
**componentDidMount()** is just a notification to the developer to let them know the component's state has successfully mounted.
**reactDomRender()** will render/display the results to the DOM.
## Styling
I am using scss to style this application.  
