# Reddit Search

**Author** Kris Sakarias

**Version** 1.0.0 

## Overview
This is a React app that renders a form and uses the information submitted to query the reddit API. The app then displays the requested number of top threads from the requested subreddit. An error renders if the subreddit is not found.

### Documentation
Starting the Webpack Dev Server:

```
git clone https://github.com/kris71990/27-reddit-search

npm i

npm run watch
```

- Component 1 - Form
  - Field 1
    - Enter a subreddit to search
  - Field 2
    - Enter the number of results (0-100) that you want returned, which is the top number of posts in the specified subreddit

- Component 2 - Results
  - Results
    - If subreddit is successfully queried, the top posts with clickable link will render
  - Error
    - If subreddit is not found or there is some other error, an error will render

