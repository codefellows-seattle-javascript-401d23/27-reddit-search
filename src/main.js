import React from 'react';
import { render as reactDomRender } from 'react-dom'; 
import superagent from 'superagent';
import './style/main.scss';

const apiUrl = 'http://www.reddit.com/r';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redditBoard: '',
      limit: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ redditBoard: event.target.value });
  }

  handleLimitChange(event) {
    this.setState({ limit: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.redditBoardSelect(this.state.redditBoard, this.state.limit);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text"
          name="boardName"
          placeholder="Search for a board"
          value={this.state.redditBoard}
          onChange={this.handleChange}
        />
        <input
          type="number"
          name="limit"
          placeholder="limit"
          value={this.state.limit}
          onChange={this.handleLimitChange}
        />
        <button type='submit'>Submit</button>
      </form>
    );
  }
}

class SearchResultList extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.topics ?
          <div>
            <h3>Boards:</h3>
            <ul>
              { this.props.topics.map((topic, index) => {
                return (
                  <li key={index}>
                    <a href={topic.data.url}>
                    <h2>{topic.data.title}</h2>
                    <p>{topic.data.ups}</p>
                    </a>
                  </li>
                );
              }) }
            </ul>
          </div> :
          <div>
            Please enter a reddit board.
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
      error: null,
    };

    this.redditBoardSelect = this.redditBoardSelect.bind(this);
  }

  redditBoardSelect(board, limit) { 
    if (!`${apiUrl}/${board}.json?limit=${limit}`) {
      return this.setState({ error: true });
    }

    return superagent.get(`${apiUrl}/${board}.json?limit=${limit}`)
      .then((response) => {
        return this.setState(() => {
          return {
            topics: response.body.data.children,
            error: null,
          };
        });
      });
  }

  render() {
    return (
      <section>
        <h1>Reddit Form</h1>
        <SearchForm redditBoardSelect={this.redditBoardSelect}/>
        {
          this.state.error ?
          <div>
            <h2 className='error'>
            {`${this.state.error}`}
            </h2>
          </div> :
          <div>
            <SearchResultList topics={this.state.topics}/>
          </div>
        }
      </section>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);

reactDomRender(<App />, container);
