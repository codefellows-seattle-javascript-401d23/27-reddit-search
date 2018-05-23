'use strict';

import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from 'superagent';
import './style/main.scss';

const apiUrl = 'http://www.reddit.com/r';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFormBoard: 'travel',
      searchFormLimit: '10',
    };
    this.handleSearchFormSubmit = this.handleSearchFormSubmit.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handleSearchFormChange = this.handleSearchFormChange.bind(this);
  }

  handleSearchFormChange(event) {
    this.setState({ searchFormBoard: event.target.value });
  }

  handleLimitChange(event) {
    this.setState({ searchFormLimit: event.target.value });
  }

  handleSearchFormSubmit(event) {
    event.preventDefault();
    this.props.updateState(this.state.searchFormBoard, this.state.searchFormLimit);
  }

  render() {
    return (
      <section>
        <form 
        className= { this.props.errorCaught ? 'error' : 'search-form' }
        onSubmit={this.handleSearchFormSubmit
        }>
          <div>
            <input
              type="text"
              name="boardSearch"
              placeholder="Reddit Board Search"
              value={this.state.searchFormBoard}
              onChange={this.handleSearchFormChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="searchLimit"
              placeholder="Number of Results"
              value={this.state.searchFormLimit}
              onChange={this.handleLimitChange}
              min='1'
              max='100'
            />
          </div>
            <button type="submit">Search</button>
        </form>
      </section>
    );
  }
}

class SearchResults extends React.Component {
  render() {
    return (
      <div>
        {this.props.results ?
          <div>
            <h2>Search Results</h2>
            <ul>
              { this.props.results.data.children.map((item, index) => {
              return <li key={index}>
                <a href={item.data.url}>{item.data.title}</a>
                <p>{item.data.ups}</p>
                </li>;
              })}
            </ul>
          </div>
        :
        undefined
        }
        {this.props.error ? 
        <div>
          <h2>No results, try again.</h2>
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
      results: '',
      resultsError: '',
    };
    this.updateState = this.updateState.bind(this);
  }

  componentDidUpdate() {
    console.log('__UPDATE STATE__', this.state);
  }

  // componentDidMount() {
  //   return superagent.get(`${apiUrl}/travel.json?limit=20`)
  //     .then((response) => {
  //       this.setState({
  //         results: response.body,
  //         resultsError: null,
  //       });
  //       this.componentDidUpdate();
  //     })
  //     .catch((err) => {
  //       this.setState({
  //         results: null,
  //         resultsError: err,
  //       });
  //     });
  // }

  updateState(board, number) {
    return superagent.get(`${apiUrl}/${board}.json?limit=${number}`)
      .then((response) => {
        this.setState({
          results: response.body,
          resultsError: null,
        });
        this.componentDidUpdate();
      })
      .catch((err) => {
        this.setState({
          results: null,
          resultsError: err,
        });
      });
  }

  render() {
    return (
      <section>
        <h2>Reddit Search - Lab 27</h2>
        <SearchForm updateState={this.updateState} errorCaught={this.state.resultsError}/>
        <div>
          <SearchResults results={this.state.results} error={this.state.resultsError}/>
        </div>
      </section>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
reactDomRender(<App />, container);
