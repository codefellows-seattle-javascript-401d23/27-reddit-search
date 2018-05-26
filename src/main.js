import React from 'react';
import { render as reactDomRender } from 'react-dom'; 
import superagent from 'superagent';

import './style/main.scss';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subreddit: '',
      threads: '',
    };
    this.handleChangeSubreddit = this.handleChangeSubreddit.bind(this);
    this.handleChangeNumber = this.handleChangeNumber.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeSubreddit(e) {
    this.setState({
      subreddit: e.target.value,
    });
  }

  handleChangeNumber(e) {
    this.setState({
      threads: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    return superagent.get(`https://www.reddit.com/r/${this.state.subreddit}.json?limit=${this.state.threads}`)
      .then((response) => {
        this.props.subredditSelect(response, this.state.subreddit, this.state.threads);
      })
      .catch((error) => {
        this.props.subredditSelect(error, this.state.subreddit, this.state.threads);
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text" 
          name="subreddit"
          placeholder="Search a subreddit"
          value={this.state.subreddit}
          onChange={this.handleChangeSubreddit}
        />
        <input
          type="number"
          name="search-items"
          placeholder="Number of threads (0-100)"
          value={this.state.threads}
          onChange={this.handleChangeNumber}
        />
        <button>Search</button>
      </form>
    );
  }
}

class SearchResultList extends React.Component {
  render() {
    return (
      <div>
      {
        this.props.results ?
        <div>
          <h3>Results</h3>
          <ul>
            { this.props.results.map((item, index) => {
              return (
                <li key={index}>
                  <p>{item.data.title}</p>
                  <a href={item.data.url}>{item.data.url}</a>
                </li>
              );
            })}
          </ul>
        </div>
      : undefined
      }
      {
      this.props.subredditError ?
        <div>
          <h2>Error - r/{this.props.subredditSelected} not found, try another subreddit.</h2>
        </div>
        :
        undefined
      }
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subredditSelected: null,
      results: null,
      threadCount: null,
      subredditError: null,
    };
    this.subredditSelect = this.subredditSelect.bind(this);
  }

  subredditSelect(response, subreddit, thread) {
    if (!response.body) {
      this.setState({
        subredditError: true,
        subredditSelected: subreddit,
        results: null,
        threadCount: thread,
      });
    } else {
      this.setState({
        subredditSelected: subreddit,
        threadCount: thread,
        results: response.body.data.children,
        subredditError: null,
      });
    }
  }

  render() {
    return (
      <section>
        <h1>Search Reddit</h1>
        <SearchForm
          subredditSelect={this.subredditSelect}
          />
        <SearchResultList 
          results={this.state.results} subredditError={this.state.subredditError}
          subredditSelected={this.state.subredditSelected}
        />
      </section>
    );
  }
}

const element = document.createElement('div');
document.body.appendChild(element);
reactDomRender(<App/>, element);
