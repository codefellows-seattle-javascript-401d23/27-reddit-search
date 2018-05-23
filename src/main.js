import React from 'react';
import { render as reactDomRender } from 'react-dom'; 
import superagent from 'superagent';
import './style/main.scss';

const apiUrl = 'http://www.reddit.com/r';
// /${searchFormBoard}.json?limit=${searchFormLimit}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redditBoard: '',
      limit: '',
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
    this.props.redditBoardSelect(this.state.redditBoard);
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
      </form>
    );
  }
}

// class SearchResultList extends React.Component {
//   constructor(props) {
//     super(props);

//     this.renderRedditBoardList = this.renderRedditBoardList.bind(this);
//   }

//   renderRedditBoardList(board) {
//     this.setState({ renderRedditBoardList: board.map(item, index) });
//   }

//   render() {
//     return (
//       <ul>
//         <li key={index}>
//           <a href={item.url}>{item.title}<p>{item.ups}</p></a>
//         </li>
//       </ul>
//     );
//   }
// }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redditBoardSelected: null,
      redditBoardError: null,
    };

    this.redditBoardSelect = this.redditBoardSelect.bind(this);
  }

  redditBoardSelect(board) {
    if (!`${apiUrl}/penguins.json?limit=5`) {
      this.setState({
        redditBoardSelected: null,
        redditBoardError: name,
      });
    } else {
      return superagent.get(`${apiUrl}/penguins.json?limit=5`) 
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
          } catch (error) {
            console.error(error);
          }
        })
        .catch(console.error);
    }
  }

  renderRedditBoardList(board) {
    return (
      <ul>
        { board.map((item, index) => {
          return (
            <li key={index}>
              <a href={item.url}>{item.title}<p>{item.ups}</p></a>
            </li>
          );
        })}
      </ul>
    );
  }
 
  render() {
    return (
      <section>
        <h1>Reddit Form</h1>
        <SearchForm 
          redditBoardSelect={this.redditBoardSelect}
        />
        { 
          this.state.redditBoardError ? 
            <div>
              <h2 className="error">
                { `"${this.state.redditBoardError}"`} does not exist.
                Please make another request.
              </h2>
            </div> : 
            <div>
              {
                this.state.redditBoardSelected ?
                <div>
                  <h3>Boards:</h3>
                  { this.renderRedditBoardList(this.state.redditBoardSelected) }
                </div> :
                <div>
                  Please make a request to see reddit board data.
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
