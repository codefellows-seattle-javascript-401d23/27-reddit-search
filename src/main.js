'use strict';

import React from 'react';
import superagent from 'superagent';
import { render as reactDOMRender } from 'react-dom';
import './style/main.scss';

// const apiUrl = `http://reddit.com/r/${searchFormBoard}.json?limit=${searchFormLimit}`

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subreddit: '',
      numberOfResults: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubredditChange = this.handleSubredditChange.bind(this);
    this.handleResultsChange = this.handleResultsChange.bind(this);
  }

  handleSubredditChange(e) {
    this.setState({ subreddit: e.target.value });
  }

  handleResultsChange(e) {
    this.setState({ numberOfResults: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.subredditSearch(this.state.subreddit, this.state.numberOfResults);
  }

  render() {
    return (
      <form onSubmit={ this.handleSubmit }>
        <input
          type='text'
          name='subreddit'
          placeholder='Search a subreddit'
          value={ this.state.subreddit }
          onChange={ this.handleSubredditChange }
          required
        />
        <input
          type='number'
          name='numberOfResults'
          value={ this.state.numberOfResults }
          placeholder='Desired number of results'
          onChange={ this.handleResultsChange }
          min='0'
          max='100'
          required
        />
        <button type="submit">Search</button>
      </form>
    );
  }
}

// {/*<div>*/}
// {/*<h2 className='error'>*/}
// {/*{ `"${this.state.pokemonNameError}"` } does not exist. Please make another request.*/}
// {/*</h2>*/}
// {/*</div> :*/}

class SearchResultList extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.searchResults ?
            <div>
              <h2>Results:</h2>

            </div> :
            <div>
              <h2 className='error'>
                { `"${this.props.error}"` } does not exist
              </h2>
            </div>
        }
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      searchError: null,
    };
    this.subredditSearch = this.subredditSearch.bind(this);
  }

  componentDidUpdate() {
    console.log('UPDATED STATE', this.state); // eslint-disable-line
  }

  componentDidMount() {
    if (localStorage.searchResults) {
      try {
        const searchResults = JSON.parse(localStorage.searchResults);
        return this.setState({ topics: searchResults });
      } catch (err) {
        return console.error(err);
      }
    } else {
      return null;
    }
  }

  subredditSearch(subreddit, num) {
    return superagent.get(`https://www.reddit.com/r/${subreddit}/.json?limit=${num - 1}`)
      .then((response) => {
        console.log(response.body.data.children); // eslint-disable-line
        const searchResults = [];
        response.body.data.children.map((result) => {
          return searchResults.push({
            author: result.data.author,
            title: result.data.title,
            url: result.data.url,
            thumbnail: result.data.preview.images[0].source.url,
          });
        });
        try {
          localStorage.searchResults = JSON.stringify(searchResults);
          this.setState({ topics: searchResults, searchError: null });
        } catch (err) {
          console.error(err); // eslint-disable-line
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ topics: null, searchError: subreddit });
      }); // eslint-disable-line
  }

  render() {
    return (
      <div>
        <h1>reddit search</h1>
        <p>In the form below, please enter the subreddit name and number of search
          results you would like to receive</p>
        <SearchForm subredditSearch={this.subredditSearch}/>
        <SearchResultList searchResults={this.state.topics} error={this.state.searchError}/>
      </div>
    );
  }
}

const body = document.createElement('div');
document.body.appendChild(body);
reactDOMRender(<App/>, body);
