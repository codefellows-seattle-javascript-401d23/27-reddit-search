'use strict';

import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from 'superagent';
import './style/main.scss';

const apiUrl = 'http://www.reddit.com/r';

class RedditSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subReddit: '',
    };

    this.handleSubRedditNameChange = this.handleSubRedditNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubRedditNameChange(event) {
    this.setState({ subReddit: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.redditSelect(this.state.subReddit);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          name='searchFormBoard'
          placeholder='search for reddit here'
          value={this.state.subReddit}
          onChange={this.handleSubRedditNameChange}
          />
      </form>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redditLookup: {},
      redditSelect: null,
      redditNameError: null,
      topics: [],
    };

    this.redditSelect = this.redditSelect.bind(this);
    this.renderSubRedditList = this.renderSubRedditList.bind(this);
  }

  componentDidUpdate() {
    console.log('__UPDATED STATE__line 59', this.state);
  }

  componentDidMount() {
    if (localStorage.redditLookup) {
      try {
        const redditLookup = JSON.parse(localStorage.redditLookup);
        return this.setState({ redditLookup: redditLookup });
        // return undefined????
      } catch (err) {
        return console.error(err, 'line 69');
      }
    } else {
      return superagent.get(`${apiUrl}/seattle.json?limit=5`)
        .then((response) => {
          console.log(response, 'line 74');
          const redditLookup = response.body.results.reduce((dict, result) => {
            dict[result.name] = result.url;
            return dict;
          }, {});

          try {
            // localStorage.redditLookup = JSON.stringify(redditLookup);
            this.setState({ redditLookup: redditLookup });
          } catch (err) {
            console.log(err, 'line 84');
          }
        })
        .catch(console.error, 'line 87');
    }
  }

  redditSelect(name) {
    if (!this.state.redditLookup[name]) {
      this.setState({
        redditSelected: null,
        redditNameError: name,
      });
    } else {
      return superagent.get(this.state.redditLookup[name])
        .then((response) => {
          this.setState({
            redditSelected: response.body,
            redditNameError: null,
          });
        })
        .catch(console.error, 'line 105');
    }
    return undefined;
  }

  renderSubRedditList(subReddit) {
    return (
      <ul>
        { subReddit.map((item, index) => {
          return (
            <li key={index}>
              <p>{item.sub.name}</p>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <section>
        <h1>Reddit Search Form</h1>
        <RedditSearchForm
          redditSelect={this.redditSelect}
          />
        {
          this.state.redditNameError ?
            <div>
              <h2 className="error">
                { `'${this.state.redditNameError}'`}does not exist.
                Please make another request.
              </h2>
            </div> :
            <div>
            {
              this.state.redditSelected ?
              <div>
                <div>
                  <img src={this.state.redditSelected} />
                </div>
                <h2>Selected: {this.state.redditSelected}</h2>
                <h3>SubReddits:</h3>
                { this.renderSubRedditList(this.state.redditSelected)}
              </div> :
                <div>
                  Please make a request to see subReddits.
                </div>
            }
            </div>
        }
      </section>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);

reactDomRender(<App />, container);
