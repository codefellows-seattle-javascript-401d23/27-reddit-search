'use strict';

import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from 'superagent';
import './style/main.scss';

const apiUrl = 'http://www.reddit.com/r';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFormBoard: 'travel',
      searchFormLimit: '10',
    };
    this.handleSearchFormSubmit = this.handleSearchFormSubmit.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handleSearchFormChange = this.handleSearchFormChange.bind(this);
  }

  handleSearchFormChange(event) {
    this.setState({ searchFormBoard: event.target.value });
  }

  handleLimitChange(event) {
    this.setState({ searchFormLimit: event.target.value });
  }

  handleSearchFormSubmit(event) {
    event.preventDefault();
    this.props.updateState(this.state.searchFormBoard, this.state.searchFormLimit);
  }


  render() {
    return (
      <section>
        <div>
          <form 
          className= { this.props.errorCaught ? 'error' : 'search-form' }
          onSubmit={this.handleSearchFormSubmit
          }>
            <input
              type="text"
              name="boardSearch"
              placeholder="Reddit Board Search"
              value={this.state.searchFormBoard}
              onChange={this.handleSearchFormChange}
            />
          </form>
        </div>
        <div>
          <form onSubmit={this.handleSearchFormSubmit}>
            <input
              type="text"
              name="searchLimit"
              placeholder="Number of Results"
              value={this.state.searchFormLimit}
              onChange={this.handleLimitChange}
            />
          </form>
        </div>
      </section>
    );
  }
}

// class SearchResults extends React.Component {
//   // constructor(props) {
//   //   super(props);
//   // }
  
//   render() {
//     if (list !== null)
//       console.log(this.props.results);
//     return (
//       <ul>
//         { this.props.results.data.children.map((item, index) => {
//           return (
//             <li key={index}>
//               <p>{item.data.permalink}</p>
//             </li>
//           );
//         })}
//       </ul>
//     );
//   }
// }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: '',
      resultsError: '',
    };
    // this.updateState = this.updateState.bind(this);
    this.renderSearchResults = this.renderSearchResults.bind(this);
  }

  componentDidUpdate() {
    console.log('__UPDATE STATE__', this.state);
  }

  componentDidMount() {
    return superagent.get(`${apiUrl}/travel.json?limit=20`)
      .then((response) => {
        this.setState({
          results: response.body,
          resultsError: null,
        });
        this.componentDidUpdate();
      })
      .catch((err) => {
        this.setState({
          results: null,
          resultsError: err,
        });
      });
  }

  // updateState(board, number) {
  //   return superagent.get(`${apiUrl}/${board}.json?limit=${number}`)
  //     .then((response) => {
  //       // console.log(response.body.data.children, 'this is the response');
  //       this.setState({
  //         results: response.body,
  //         resultsError: null,
  //       });
  //       this.componentDidUpdate();
  //     })
  //     .catch((err) => {
  //       this.setState({
  //         results: null,
  //         resultsError: err,
  //       });
  //     });
  // }

  renderSearchResults() {
    console.log(this.state.results, 'this is results');
    if (this.state.results !== null) {
      return (
      <ul>
        { this.state.results.data.children.map((item, index) => {
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
    console.log(this.state, 'this is the state');
    return (
      <section>
        <h2>Reddit Search - Lab 27</h2>
        <SearchForm errorCaught={this.state.resultsError}/>
        <div>
          {/* <SearchResults results={this.state.results}/> */}
          {this.state.results && this.renderSearchResults()}
        </div>
      </section>
    );
  }
}
// updateState={this.updateState} 


const container = document.createElement('div');
document.body.appendChild(container);
reactDomRender(<App />, container);
