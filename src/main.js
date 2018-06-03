import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from 'superagent';


import '../style/main.scss';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: '',
      limit: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBoardChange = this.handleBoardChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.getTopics(this.state.board, this.state.limit);
  }

  handleBoardChange(event) {
    this.setState({ board: event.target.value });
  }

  handleLimitChange(event) {
    this.setState({ limit: event.target.value });
  }

  render() {
    return (
      <div>
        <h3>Search Form</h3>
        <form
          className={this.props.errorStatus}
          onSubmit={this.handleSubmit}>
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
            placeholder='Enter a results limit'
            value={this.state.limit}
            onChange={this.handleLimitChange}
          />
          <button type='submit'>Submit</button>
        </form>
      </div>
    );
  }
}

class SearchResultList extends React.Component {
  render() {
    return (
    <div className={this.props.errorStatus}>
      <h3>Search Results</h3>
      <ul>
        {this.props.topicsList.map((article, index) => {
          return (
            <li key={index}>
              <a href={article.data.url} target='_blank'>
                <h3>{article.data.title}</h3>
                <p>Number of Ups: {article.data.ups}</p>
              </a>
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
      errorStatus: '',
    };

    this.getTopics = this.getTopics.bind(this);
  }

  getTopics(board, limit) {
    const apiUrl = `https://www.reddit.com/r/${board}.json?limit=${limit}`;
    if (limit < 0 || limit > 100) {
      this.setState({
        topics: [{ data: { title: 'Limit must be between 0 and 100.' } }],
        errorStatus: 'error',
      });
      return undefined;
    }
    return superagent.get(apiUrl)
      .then((response) => {
        this.setState({
          topics: response.body.data.children,
          errorStatus: 'board-found',
        });
      })
      .catch((err) => {
        this.setState({
          topics: [{ data: { title: 'Board Not Found' } }],
          errorStatus: 'error',
        });
        console.error(err); // eslint-disable-line
      });
  }

  render() {
    return (
      <section>
        <h1>Reddit Topics Search</h1>
         <SearchForm
           errorStatus={this.state.errorStatus}
           getTopics = {this.getTopics}
         />
         <SearchResultList
           errorStatus={this.state.errorStatus}
           topicsList={ this.state.topics }/>
      </section>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);

reactDomRender(<App/>, container);
