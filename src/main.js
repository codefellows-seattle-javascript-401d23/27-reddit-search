import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from 'superagent';
import './style/main.scss';

const apiUrl = 'http://www.reddit.com/r/';

class RedditSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFormBoard: '',
      searchFormLimit: '',
    };

    this.handleRedditBoardChange = this.handleRedditBoardChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleRedditLimitChange = this.handleRedditLimitChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleRedditBoardChange(event) {
    this.setState({
      searchFormBoard: event.target.value,
    });
  }

  // handleRedditLimitChange(event) {
  //   console.log(event.target.value);
  //   this.setState({
  //     renderTopicsList: event.target.value,
  //   });
  // }

  handleSubmit(event) {
    event.preventDefault();
    this.props.redditSelect(this.state.searchFormBoard);
    // this.props.renderTopicsList(this.state.renderTopicsList);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="searchRedditTopicName"
          placeholder="Search for a Reddit board"
          value={this.state.searchFormBoard}
          onChange={this.handleRedditBoardChange}
          />
        {/*<input type="text"*/}
               {/*name="searchLimit"*/}
               {/*placeholder="limit"*/}
               {/*value={this.state.renderTopicsList}*/}
               {/*onChange={this.handleRedditLimitChange}/>*/}
      </form>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redditLookup: {},
      redditSelected: null,
      redditNameError: null,
    };

    this.redditSelect = this.redditSelect.bind(this);
    // this.renderTopicsList = this.renderTopicsList.bind(this);
  }

  redditSelect(searchFormBoard) {
    return superagent.get(`http://www.reddit.com/r/${searchFormBoard}.json?limit=20`)
      .then((response) => {
        this.setState({
          redditSelected: response.body,
        });
      })
      .catch(console.error);
  }

  // renderTopicsList(reddit) {
  //   return (
  //     <ul>
  //       { reddit.topics.map((item, index) => {
  //         return (
  //           <li key={index}>
  //             <p>{item.topic.name}</p>
  //           </li>
  //         );
  //       })}
  //     </ul>
  //   );
  // }

  render() {
    return (
      <section>
        <h1>Reddit Form Demo</h1>
        <RedditSearchForm
          redditSelect={this.redditSelect}
          />
        {
          this.state.redditNameError ?
            <div>
              <h2 className="error">
                { `"${this.state.redditNameError}"`} does not exist.
                Please make another request.
              </h2>
            </div> :
            <div>
              {
                this.state.redditSelected ?
                  <div>
                    <ul>
                      {this.state.redditSelected.data.children.map((item, index) => {
                        return <li key={index}><a href={item.data.url}>{item.data.author}</a></li>;
                      })}
                    </ul>
                  </div> :
                  <div>
                    Please make a request to see Reddit data.
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
reactDomRender(<App/>, container);
