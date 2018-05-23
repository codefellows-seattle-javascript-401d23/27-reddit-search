import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from 'superagent';


import '../style/main.scss';

const searchFormBoard = 'cats';
const searchFormLimit = 5;

const apiUrl = `http://reddit.com/r/${searchFormBoard}.json?limit=${searchFormLimit}`;


class SearchForm extends React.Component {
  handleSubmit() {

  }
  render() {
    return (
      <div>
        <h3>Search Form Goes Here.</h3>
        <form>
          <input
          type='text'
          name='redditBoard'
          placeholder='Search for a Reddit board'
          />
        </form>
      </div>
    );
  }
}

class SearchResultList extends React.Component {
  render() {
    return (
      <div>
        <h3>Search Results Go Here.</h3>
        <ul>
          {this.props.topicslist.map((article, index) => {
            return (
              <li key={index}>
                <p>{article}</p>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: ['topic'],
    };
    this.getTopics = this.getTopics.bind(this);
  }

  getTopics() {
    return superagent.get(apiUrl)
      .then((response) => {
        this.setState({
          topics: response.body.data.children,
        });
      })
      .catch(console.error);
  }

  render() {
    return (
    <section>
      <h1>Reddit Topics Search</h1>
      <SearchForm/>
      <SearchResultList topicslist={ this.state.topics }/>
    </section>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);

reactDomRender(<App/>, container);
