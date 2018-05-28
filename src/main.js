import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from 'superagent';


import '../style/main.scss';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: 'cats',
      limit: 5,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBoardChange = this.handleBoardChange.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.getTopics(this.state.board, this.state.limit);
  }
  handleBoardChange(event) {
    this.setState({ board: event.target.value });
  }

  render() {
    return (
      <div>
        <h3>Search Form</h3>
        <form onSubmit={this.handleSubmit}>
          <input
            type='text'
            name='redditBoard'
            placeholder='Search for a Reddit board'
            value={this.state.board}
            onChange={this.handleBoardChange}
          />
          <input
            type='number'
            name='limit'
          />
          <button type='submit'>Submit</button>
        </form>
      </div>
    );
  }
}

class SearchResultList extends React.Component {
  render() {
    console.log(this.props);
    return (
    <div>
      <h3>Search Results</h3>
      <ul>
        {this.props.topicsList.map((article, index) => {
          return (
            <li key={index}>
              <p><a href={article.data.url} target='_blank'>{article.data.title}</a></p>
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
      topics: [],
    };

    this.getTopics = this.getTopics.bind(this);
    // this.boardSelect = this.boardSelect.bind(this);
  }

  getTopics(board, limit) {
    const apiUrl = `https://www.reddit.com/r/${board}.json?limit=${limit}`;
    return superagent.get(apiUrl)
      .then((response) => {
        this.setState({
          topics: response.body.data.children,
        });
        console.log(this.state);
      })
      .catch(console.error);
  }

  // boardSelect(board, limit) {
  //   const apiUrl = `http://reddit.com/r/${searchFormBoard}.json?limit=${searchFormLimit}`;
  //   return superagent.get(apiUrl)
  //     .then()
  // }

  render() {
    return (
      <section>
        <h1>Reddit Topics Search</h1>
         <SearchForm getTopics = {this.getTopics} />
         <SearchResultList topicsList={ this.state.topics }/>
      </section>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);

reactDomRender(<App/>, container);
