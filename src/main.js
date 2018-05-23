import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from 'superagent';
import '../style/main.scss';

// const apiURL = `https://reddit.com/r/${searchFormBoard}.json?limit=${searchFormLimit}`;
// TODO use the above line for final lab

class RedditSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redditBoardName: '',
      returnResults: 0,
    };

    this.handleBoardChange = this.handleBoardChange.bind(this);
    this.handleBoardNumberChange = this.handleBoardNumberChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitNumber = this.handleSubmitNumber.bind(this);
  }


  handleBoardChange(event) {
    this.setState({ redditBoardName: event.target.value });
  }

  handleBoardNumberChange(event) {
    this.setState({ returnResults: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.redditBoardSelect(this.state.redditBoardName);
  }

  handleSubmitNumber(event) {
    event.preventDefault();
    this.props.redditBoardSelect(this.state.returnResults);
  }

  render() {
    return (
        <form onSubmit={this.handleSubmit}>
            <input
              type='text'
              name='redditBoardName'
              placeholder='Search Reddit'
              value={this.state.redditBoardName}
              onChange={this.handleBoardChange}
              />
        </form>
    );
  }
}
// this is code for the number of results page ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//<br />
//         <form onSubmit={this.handleSubmitNumber}>
//           <label>
//             <input
//               type='number'
//               name='returnResults'
//               min='0'
//               max='100'
//               value={this.state.returnResults}
//               onChange={this.handleBoardNumberChange}
//               />
//           </label>
//         </form>

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardLookup: {},
      redditBoardSelected: null,
      redditBoardError: null,
    };

    this.redditBoardSelect = this.redditBoardSelect.bind(this);
  }

  componentDidUpdate() {
    console.log('__UPDATE STATE__', this.state);
  }

  componentDidMount() {
    if (localStorage.boardLookup) {
      try {
        const boardLookup = JSON.parse(localStorage.boardLookup);
        return this.setState({boardLookup});
      } catch (err) {
        return console.error(err);
      }
    } else {
    return superagent.get(`https://reddit.com/r/rabbits.json?limit=1`)
        .then((response) => {
          console.log('API res: ', response);
        });
    }
  }

  redditBoardSelect(searchInfo) {
    if (!this.state.boardLookup[searchInfo]) {
      this.setState({
        redditBoardSelected: null,
        redditBoardError: searchInfo,
      });
    } else {
      return superagent.get(this.state.boardLookup[searchInfo])
        .then((response) => {
          this.setState({
            redditBoardSelected: response.body,
            redditBoardError: null,
          });
        })
        .catch(console.error);
    }
    return undefined;
  }





  render() {
  return (
      <RedditSearchForm />
    );
  }
}


const container = document.createElement('div');
document.body.appendChild(container);

reactDomRender(<App />, container);