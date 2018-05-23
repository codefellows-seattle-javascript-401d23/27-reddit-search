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

    // this.handlePokemonNameChange = this.handlePokemonNameChange.bind(this);
    this.searchFormBoard = this.searchFormBoard.bind(this);
    // this.searchFormLimit = this.searchFormLimit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  searchFormBoard(event) {
    this.setState({ thingSearchedFor: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.redditSelect(this.state.thingSearchedFor); // eslint-disable-line
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="thing searched for"
          placeholder="Search for a Reddit page"
          value={this.state.thingSearchedFor}
          onChange={this.searchFormBoard}
        />
      </form>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redditLookUp: {},
      thingSearchedFor: null,
      redditNameError: null,
      searchLimit: null,
    };

    this.redditSelect = this.redditSelect.bind(this);
    this.renderSearchResults = this.renderSearchResults.bind(this);
  }

  redditSelect(thingSearchedFor) {
    return superagent.get(`${apiUrl}/${thingSearchedFor}.json?`)
      .then((response) => {
        this.setState({
          thingSearchedFor: response.body,
          redditResponseError: null,
        });
      }) 
      .catch(() => {
        this.setState({
          redditResponseError: thingSearchedFor,
        });
      });
  }
  
  renderSearchResults(response) {
    if (response !== null) {
      return (
      <ul>
        {response.data.children.map((item, index) => {
          return (
            <li key={index}>
            <a href={item.data.url}>{item.data.title}</a>
              <p>{item.data.ups}</p>

            </li>
          );
        })}
      </ul>
      );
    }
    return undefined;
  }

  render() {
    return (
      <section>
        <h1>Search Topic</h1>
        <RedditSearchForm redditSelect={this.redditSelect} />
        {
          this.state.redditResponseError ?
            <div>
              <h2 className="error">
                {`"${this.state.redditResponseError}"`} does not exist
            </h2>
            </div> :
            <div>
              <h2>Search result:</h2>
              {this.renderSearchResults(this.state.thingSearchedFor)}
            </div>
        }
      </section>
    );
  }
}


const container = document.createElement('div');
document.body.appendChild(container);

reactDomRender(<App />, container);
