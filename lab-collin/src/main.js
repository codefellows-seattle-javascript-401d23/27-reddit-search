import React from 'react';
import { render as reactDomRender } from 'react-dom'; 
import superagent from 'superagent';
import './style/main.scss';


class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFormBoard: '',
      searchFormLimit: 0,
    };

    this.handleBoardChange = this.handleBoardChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleBoardChange(event) {
    this.setState({ searchFormBoard: event.target.value });
  }

  handleLimitChange(event) {
    this.setState({ searchFormLimit: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.boardSelect(this.state.searchFormBoard, this.state.searchFormLimit);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text"
          name="searchFormBoard"
          placeholder="look up a reddit board"
          value={this.state.searchFormBoard}
          onChange={this.handleBoardChange}
        />
        <input 
          type="number"
          name="searchFormLimit"
          placeholder="set result limit"
          value={this.state.searchFormLimit}
          onChange={this.handleLimitChange}
        />
         <input type="submit" value="Submit" />
      </form>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
    };

    this.boardSelect = this.boardSelect.bind(this);
  }

  boardSelect(board, limit) {
    return superagent.get(`http://reddit.com/r/${board}.json?limit=${limit}`)
          .then((response) => {
            console.log(response.body.data.children);
            this.setState({
              topics: response.body.data.children,
            });
          })
          .catch(console.error

          );
  }

  render() {
    return (
      <section>
        <h1>Search REDDIT</h1>
        <SearchForm boardSelect={this.boardSelect}
        />
        <SearchFormResults topics={this.state.topics} />
      </section>
    );
  }
}

class SearchFormResults extends React.Component {
  constructor(props) {
    super(props);
    this.renderTopics = this.renderTopics.bind(this);
  }

  renderTopics(topics) {
    return (
      <ul>
        { topics.map((item, index) => {
          return (
            <li key={index}>
            <h2>{item.data.title}</h2>
              <a href= {item.data.url} >{item.data.url}</a>
              <p>{item.data.ups}</p>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <section>
      { this.renderTopics(this.props.topics) }
      </section>
    )}
}

const container = document.createElement('div');
document.body.appendChild(container);

reactDomRender(<App />, container);
