import React from 'react';
import { render as reactDomRender } from 'react-dom'; 
import superagent from 'superagent';
import './style/main.scss';

const apiURL = 'http://www.reddit.com/r';
// /${searchFormBoard}.json?limit=${searchFormLimit}';
// response.children.reduce((a,b) )

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subName: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ subName: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.subRedditSelect(this.state.subName); // eslint-disable-line
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          name='subRedditName'
          placeholder='Search for a sub reddit.'
          value={this.state.subName}
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

// class SearchResultList extends React.Component {
//   render() {
//     return (
//   <ul>
//   {this.props.subRedditLookup.map((item, index) => {
//     return (
//       <li key={index}>
//         <h2>{item.title}</h2>
//         <p>{item.url}</p>
//         <p>{item.ups}</p>
//       </li>
//     );
//   })}
// </ul>
//     );
//   }
// }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subRedditLookup: {},
      subRedditSelected: null,
      subRedditNameError: null,
    };

    this.subRedditSelect = this.subRedditSelect.bind(this);
    this.renderSubRedditList = this.renderSubRedditList.bind(this);
  }

  componentDidUpdate() {
    console.log('__UPDATE STATE__', this.state);
  }

  componentDidMount() {
    if (localStorage.subRedditLookup) {
      try {
        const subRedditLookup = JSON.parse(localStorage.subRedditLookup);
        return this.setState({ subRedditLookup });
      } catch (error) {
        return console.error(error);
      }
    } else {
      return superagent.get(`${apiURL}/dogs.json?limit=5`) 
        .then((response) => {
          console.log(response);
          const subRedditLookup = response.body.data.children.reduce((dict, result) => {
            dict[result.data.name] = [result.data.title, result.data.url.replace(/https/, 'http').replace(/\/$/, '.json'), result.data.ups];
            return dict;
          }, {});
          console.log('dict', subRedditLookup);
          try {
            // localStorage.subRedditLookup = JSON.stringify(subRedditLookup);
            this.setState({ subRedditLookup });
          } catch (error) {
            console.error(error);
          }
        })
        .catch(console.error);
    }
  }

  subRedditSelect(name) {
    if (!this.state.subRedditLookup[name]) {
      this.setState({
        subRedditSelected: null,
        subRedditNameError: name,
      });
    } else {
      return superagent.get(`${apiURL}/dogs.json?limit=5`) 
        .then((response) => {
          console.log(response);
          const subRedditLookup = response.body.data.children.reduce((dict, result) => {
            dict[result.data.name] = [result.data.title, result.data.url.replace(/https/, 'http').replace(/\/$/, '.json'), result.data.ups];
            return dict;
          }, {});
          console.log('dict', subRedditLookup);
          try {
            localStorage.subRedditLookup = JSON.stringify(subRedditLookup);
            this.setState({ subRedditLookup });
            console.log('SELECTED', subRedditLookup);
          } catch (error) {
            console.error(error);
          }
        })
        .catch(console.error);
    }
    return null;
  }

  renderSubRedditList(name) {
    console.log(':::::NAME:::::', name);
    const nameArray = name.toArray();
    console.log('namearray', nameArray);
    return (
      <ul>
        {name.map((item, index) => {
          return (
            <li key={index}>
              <h2>{item.title}</h2>
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
        <h1>SubReddit Search Demo</h1>
        <SearchForm
          subRedditSelect={this.subRedditSelect}
        />
        { 
          this.state.subRedditNameError ? 
            <div>
              <h2 className="error">
                { `"${this.state.subRedditNameError}"`} does not exist.
                Please make another request.
              </h2>
            </div> : 
            <div>
               {
                 this.state.subRedditSelected ? 
                 <div>
                   <h3>Articles:</h3>
                   { this.renderSubRedditList(this.state.subRedditLookup)}
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
