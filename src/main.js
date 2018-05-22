'use strict';

import React from 'react';
import { render as reactDOMRender } from 'react-dom';
import './style/main.scss';

// const apiUrl = `http://reddit.com/r/${searchFormBoard}.json?limit=${searchFormLimit}`

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: '',
    };
  }

  render() {
    return (
      <div>
        Hello from Search Form!
      </div>
    );
  }
}

class SearchResultList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otherPlaceholder: '',
    };
  }

  render() {
    return (
      <div>
        Hello from Search Result List!
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thirdPlaceholder: '',
    };
  }
  render() {
    return (
      <div>
        <SearchForm/>
        <SearchResultList/>
        <p>Hello from the App Class!</p>
      </div>
    );
  }
}

const body = document.createElement('div');
document.body.appendChild(body);
reactDOMRender(<App/>, body);
