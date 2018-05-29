import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from 'superagent';
import './style/main.scss';

const apiURL = 'http://www.reddit.com/r';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFormBoard: '',
      searchFormLimit: 0,
      searchFormClass: 'searchForm',
      prePostSearchClass: 'preSearch',
      inputClass: '',
    };

    this.handleBoardChange = this.handleBoardChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleBoardChange(e) {
    this.setState({ searchFormBoard: e.target.value });
  }

  handleLimitChange(e) {
    this.setState({ searchFormLimit: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.searchFormBoard === '') {
      this.setState({
        searchFormClass: 'error',
        inputClass: 'error',
      });
    } else {
      this.setState({
        searchFormClass: 'searchForm',
        prePostSearchClass: 'postSearch',
        inputClass: '',
      });
    }
    this.props.subRedditSelect(this.state.searchFormBoard, this.state.searchFormLimit); // eslint-disable-line
  }

  render() {
    return (
      <section className={this.state.searchFormClass}>
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          name='searchBoardForm'
          placeholder='Search for a sub reddit.'
          value={this.state.searchFormBoard}
          onChange={this.handleBoardChange}
          className={this.state.inputClass}
        />
        <input
          type='number'
          min='0'
          max='100'
          name='searchLimit'
          placeholder='Set limit for search results.'
          value={this.state.searchFormLimit}
          onChange={this.handleLimitChange}
          className={this.state.inputClass}
        />
        <button type='submit'>Search</button>
      </form>
      {
        (this.state.searchFormClass === 'error') ? <h1>INVALID INPUT!</h1> : <h1 className={this.state.prePostSearchClass}>Search Results: </h1>
      }
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
              <li key={index} className='listItem'>
              <a href={item.data.url}>
              <p className='listTitle'>{item.data.title}</p>
              <p className='listUps'>{item.data.ups}</p>
              </a>
              </li>
            );
          })}
      </ul>
    );
  }

  render() {
    return (
      <section className='searchFormResults'>
        { 
          this.renderTopics(this.props.topics)//eslint-disable-line 
        }
      </section>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
    };

    this.subRedditSelect = this.subRedditSelect.bind(this);
  }

  componentDidUpdate() {
    console.log('__UPDATE STATE__', this.state);
  }

  subRedditSelect(board, limit) {
    return superagent.get(`${apiURL}/${board}.json?limit=${limit}`) 
      .then((response) => {
        this.setState({
          topics: response.body.data.children,
        });
      })
      .catch(console.error);
  }

  render() {
    return (
      <section className='app'>
        <h1 className='headerTitle'>SubReddit Search Demo</h1>
        <SearchForm
          subRedditSelect={this.subRedditSelect}
        />
        <div>
          <SearchFormResults topics={this.state.topics}/>
        </div>
      </section>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);

reactDomRender(<App />, container);
