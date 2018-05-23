'use strict';

import React from 'react';
import superagent from 'superagent';
import { render as reactDOMRender } from 'react-dom';
import './style/main.scss';

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
    this.props.searchHandle(this.state.subreddit, this.state.numberOfResults);
    this.setState({ subreddit: '', numberOfResults: '', formClass: '' });
  }

  render() {
    return (
      <form onSubmit={ this.handleSubmit } className={this.state.formClass}>
        <input
          type='text'
          name='subreddit'
          className={this.state.formClass}
          placeholder='Search a subreddit'
          value={ this.state.subreddit }
          onChange={ this.handleSubredditChange }
          required
        />
        <input
          type='number'
          name='numberOfResults'
          value={ this.state.numberOfResults }
          className={this.state.formClass}
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

class SearchResultList extends React.Component {
  constructor(props) {
    super(props);
    this.renderSearchResults = this.renderSearchResults.bind(this);
  }

  renderSearchResults(results) {
    return (
      <ul>
        { results.map((result, index) => {
          return (
            <a href={result.url} key={index}><li>
              <h4>{result.title}</h4>
              <p>OP: {result.author}</p>
              <p>UPS: {result.ups}</p>
            </li></a>
        );
        })}
      </ul>
    );
  }

  render() {
    return (
      <div>
        {
          this.props.searchResults && this.props.searchResults.length > 1 ?
            <div>
              <h2>Results:</h2>
              { this.renderSearchResults(this.props.searchResults) }
            </div> :
            <div>
              <h2>
                No results to display.
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
      successfulSearch: true,
      formClass: '',
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
        return this.setState({ topics: searchResults, successfulSearch: true, formClass: '' });
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
            ups: result.data.ups,
          });
        });
        try {
          localStorage.searchResults = JSON.stringify(searchResults);
          this.setState({ topics: searchResults, successfulSearch: true, formClass: '' });
        } catch (err) {
          console.error(err); // eslint-disable-line
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ topics: null, successfulSearch: false, formClass: 'form-error' });
      }); // eslint-disable-line
  }

  render() {
    return (
      <div className={this.state.formClass}>
        <header>
          <h1>reddit search</h1>
        </header>
        <p>In the form below, please enter the subreddit name and number of search
          results you would like to receive.</p>
        <SearchForm searchHandle={this.subredditSearch} searchStatus={this.state.successfulSearch}/>
        {
          this.state.formClass ?
            <p className='error'>Subreddit not found</p> :
            <p> </p>
        }
        <SearchResultList searchResults={this.state.topics}/>
      </div>
    );
  }
}

const body = document.createElement('div');
document.body.appendChild(body);
reactDOMRender(<App/>, body);
