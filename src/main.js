'use strict';

import React from 'react';
import { render as reactDomRender } from 'react-dom'; 
import superagent from 'superagent';
import '../style/main.scss';

const apiUrl = 'http://www.reddit.com/r';
// aww.json?limit=15
// class SearchResult extends React.Component{
//   constructor(props) {
//     super(props);

//   };
// }

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subReddit: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ subReddit: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.subRedditSelect(this.state.subReddit);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text"
          name="subReddit"
          placeholder="Search for a subReddit"
          value={this.state.subReddit}
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subRedditLookup: {},
      subRedditSelected: null,
      subRedditError: null,
    };

    // this.subRedditSelect = this.subRedditSelect.bind(this);
    // this.searchResultList = this.searchResultList.bind(this);
  }

  // built-in lifecycle hook from React, is invoked immediately after updating occurs
  componentDidUpdate() {
    console.log('__UPDATE STATE__', this.state);
  }

  // built-in lifecycle hook from React, invoked after component is rendered on the page 
  componentDidMount() {
    if (localStorage.subRedditLookup) {
      try {
        const subRedditLookup = JSON.parse(localStorage.subRedditLookup);
        return this.setState({ subRedditLookup });
        // return undefined;
      } catch (error) {
        return console.error(error);
      }
    } else {
      return superagent.get(`${apiUrl}/aww.json?limit=5`)
        .then((response) => {
          console.log(response);
          const subRedditLookup = response.body.data.children.reduce((dict, result) => {
            dict[result.data.name] = [result.data.title, result.data.url, result.data.ups];
            return dict;
          }, {});

          try {
            localStorage.subRedditLookup = JSON.stringify(subRedditLookup);
            this.setState({ subRedditLookup });
          } catch (err) {
            console.error(err);
          }
        })
        .catch(console.error);
    }
  }

  subRedditSelect(name) {
    if (!this.state.subRedditLookup[name]) {
      this.setState({
        subRedditSelected: null,
        subRedditError: name,
      });
    } else {
      return superagent.get(this.state.subRedditLookup[name])
        .then((response) => {
          this.setState({
            subRedditSelected: response.body,
            subRedditError: null,
          });
        })
        .catch(console.error);
    }
    return undefined;
  }

  renderResultList(name) {
    return (
      <ul>
        { name.map((item, index) => {
          return (
            <li key={index}>
              <h3>{item.title}</h3>
              <p>{item.url}</p>
              <p>{item.ups}</p>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <section>
        <h1>SubReddit Search Form:</h1>
        <SearchForm 
          subRedditSelect={this.subRedditSelect}
        />
        { 
          this.state.subRedditError ? 
            <div>
              <h2 className="error">
                { `"${this.state.subRedditError}"`} does not exist.
                Please make another request.
              </h2>
            </div> : 
            <div>
               {
                 this.state.subRedditSelected ? 
                 <div>
                   <div>
                     <img src={this.state.subRedditSelected} />
                   </div>
                   <h2>Selected: {this.state.subRedditSelected.subReddit}</h2>
                   <h3>Articles:</h3>
                   { this.renderResultList(this.state.subRedditSelected)}
                 </div> :
                 <div>
                   Please make a request to see subReddit data.
                 </div>
               }
            </div>
        }
      </section>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);

reactDomRender(<App />, container);


/*
response.data.children [] 
children array has data component contains URL, TITLE, UPs fields to be accessed. 
*/
