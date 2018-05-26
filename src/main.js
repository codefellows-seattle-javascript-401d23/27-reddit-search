import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from 'superagent';
import './style/main.scss';

const apiUrl = 'https://www.reddit.com/r';

class RedditSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thingSearchedFor: '',
      searchLimit: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.searchFormBoard = this.searchFormBoard.bind(this);
    this.searchFormLimit = this.searchFormLimit.bind(this);
  }

  searchFormBoard(event) {
    this.setState({ thingSearchedFor: event.target.value });
  }

  searchFormLimit(event) {
    this.setState({ searchLimit: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.redditSelect(this.state.thingSearchedFor, this.state.searchLimit); // eslint-disable-line
    this.setState({ thingSearchedFor: '', searchLimit: '', formClass: '' });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className={this.state.formClass}>
        <input
          type="text"
          name="thing searched for"
          className={this.state.formClass}
          placeholder="Search for a Reddit page"
          value={this.state.thingSearchedFor}
          onChange={this.searchFormBoard}
          required
        />
        <input
          type="number"
          name="result limit"
          className = {this.state.formClass}
          placeholder="# of Results"
          value={this.state.searchLimit}
          onChange={this.searchFormLimit}
          min='0'
          max='100'
          required
        />
        <button type="submit">Search</button>
      </form>
    );
  }
}

class ListOfResults extends React.Component {
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
              <p>User: {result.author}</p>
              <p>Up Votes: {result.ups}</p>
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
        this.props.searchResults && this.props.searchResults.length > 1 ? // eslint-disable-line
          <div>
            {this.renderSearchResults(this.props.searchResults)}
          </div> :
          <div>
            <h2>
              There is nothing to display.
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
      redditLookUp: [],
      searchCompleted: true,
      formClass: '',
    };

    this.redditSelect = this.redditSelect.bind(this);
  }


  componentDidUpdate() {
    console.log('UPDATE STATE', this.state); // eslint-disable-line
  }

  componentDidMount() {
    if (localStorage.searchResults) {
      try {
        const searchResults = JSON.parse(localStorage.searchResults);
        return this.setState({ thingSearchedFor: searchResults, searchCompleted: true, formClass: '' });
      } catch (err) {
        return console.error(err);
      }
    } else {
      return null;
    }
  }

  redditSelect(thingSearchedFor, searchLimit) {
    return superagent.get(`${apiUrl}/${thingSearchedFor}/.json?limit=${searchLimit - 1}`)
      .then((response) => {
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
          this.setState({ thingSearchedFor: searchResults, searchFormBoard: true, formClass: '' });
        } catch (err) {
          console.error(err);
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ thingsSearchedFor: null, searchCompleted: false, formClass: 'error-on-form' });
      });
  }

  render() {
    return (
      <section className={this.state.formClass}>
        <header>
          <h1>Search Topic</h1>
        </header>
        <RedditSearchForm redditSelect={this.redditSelect} 
        searchStatus={this.state.searchFormBoard}/>
        {
          this.state.formClass ?
            <div>
              <h2 className="error">
                {`"${this.state.redditResponseError}"`} does not exist
            </h2>
            </div> :
            <div>
              <h2>Search results:</h2>
              <ListOfResults searchResults={this.state.thingSearchedFor}/>
            </div>
        }
      </section>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
reactDomRender(<App />, container);
