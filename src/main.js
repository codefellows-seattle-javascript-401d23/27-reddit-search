import React from 'react';
import { render as reactDomRender } from 'react-dom';
// import superagent from 'superagent';
import '../style/main.scss';

// const apiURL = `https://reddit.com/r/${searchFormBoard}.json?limit=${searchFormLimit}`;
// TODO use the above line for final lab

class RedditSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redditBoardName: '',
    };

    this.handleBoardChange = this.handleBoardChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleBoardChange(event) {
    this.setState({ redditBoardName: event.target.value });
    // this.setState({ returnResults: event.target.value }); ------- TODO setup returnResults
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.redditBoardSelect(this.state.redditBoardName);
  }

  render() {
    return (
        <form onSubmit={this.handleSubmit}>
          <input
            type='text'
            name='redditBoardName'
            placeholder='Search for a reddit Board'
            value={this.state.redditBoardName}
            onChange={this.handleBoardChange}
            />
        </form>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardLookup: [],
      redditBoardSelected: null,
      redditBoardError: null,
    }

    render()
    {
    return (
        <RedditSearchForm />
    );
    }
  }
}


const container = document.createElement('div');
document.body.appendChild(container);

reactDomRender(<App />, container);