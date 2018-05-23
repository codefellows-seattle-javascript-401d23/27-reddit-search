import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from superagent;
import './style/main.scss';

// const apiURL = `https://reddit.com/r/${searchFormBoard}.json?limit=${searchFormLimit}`;
// TODO use the above line for final lab

class redditSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redditBoardName: '',
      returnResults: '',
    };

    this.handleBoardNameChange = this.handleBoardNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleBoardNameChange(event) {
    this.setState({ redditBoardName: event.target.value });
    // this.setState({ returnResults: event.target.value }); ------- TODO setup returnResults
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.redditBoardSelect(this.state.redditBoardName); // this takes in a function to
    // change state.  redditBoardSelect is taking in the logic
  }

  render() {
    return (
        <form onSubmit={this.handleSubmit}>
          <input
            type='text'
            name='redditBoardName'
            placeholder='Search for a reddit Board'
            value={this.state.redditBoardName}
            onChange={this.handleBoardNameChange}
            />
          {/*<input*/}
            {/*type='number'*/}
            {/*name='returnResults'*/}
            {/*placeholder='1 - 100'*/}
            {/*min='1'*/}
            {/*max='100'*/}
            {/*value={this.state.returnResults}*/}
            {/*onChange={this.handleBoardNameChange}*/}
            {/*/>       ------------------------------- TODO setup returnResults*/}
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
      redditBoardNameError: null,
    };

    //  binding happens here!!! ----------------------------------------
  }

  componentDidUpdate() {
    console.log('__UPDATE STATE__', this.state);
  }

  componentDidMount() {
    if (localStorage.redditBoardLookup) {
      try {
        const redditBoardLookup = JSON.parse(localStorage.redditBoardLookup);
        return this.setState({redditBoardLookup});
      } catch (err) {
        return console.error(err);
      }
    } else {
      return superagent.get(apiURL)
          .then((response) => {
            console.log(response);
            const redditBoardLookup = response.body.results.reduce((dict, result) => {
              dict[result.name] = result.url;
              return dict;
            }, {});

            try {
              localStorage.redditBoardLookup = JSON.stringify(redditBoardLookup);
              this.setState({redditBoardLookup});
            } catch (err) {
              console.error(err);
            }
          })
          .catch(console.error);
    }
  }

  redditBoardSelect(name) {
    if (!this.state.redditBoardLookup[name]) {
      this.setState({
        pokemonSelected: null,
      pokemonNameError: name,
      });
    } else {
      return superagent.get(this.state.redditBoardLookup[name])
        .then((response) => {
          this.setState({
            redditBoardSelected: response.body,
            redditBoardNameError: null,
          });
        })
        .catch(console.error);
    }
    return undefined;
  }

  // renderAbilitiesList(redditBoard) {
  //   return (
  //       <ul>
  //         { redditBoard.abilities.map((item, index) => {
  //           return (
  //               <li key={index}>
  //                 <p>{item.ability.name}</p>
  //               </li>
  //           );
  //         })}
  //       </ul>
  //   );
  // }

  render() {
    return (
        <section>
          <h1>Reddit Board Form</h1>
          <RedditSearchForm />
          {/*<RedditSearchForm*/}
              {/*redditSelect={this.redditSelect}*/}
          {/*/>*/}
          {/*{*/}
            {/*this.state.redditNameError ?*/}
                {/*<div>*/}
                  {/*<h2 className="error">*/}
                    {/*{ `"${this.state.redditNameError}"`} does not exist.*/}
                    {/*Please make another request.*/}
                  {/*</h2>*/}
                {/*</div> :*/}
                {/*<div>*/}
                  {/*{*/}
                    {/*this.state.redditSelected ?*/}
                        {/*<div>*/}
                          {/*<h2>Selected: {this.state.redditSelected.name}</h2>*/}
                          {/*<h3>Abilities:</h3>*/}
                          {/*{ this.renderAbilitiesList(this.state.redditSelected)}*/}
                        {/*</div> :*/}
                        {/*<div>*/}
                          {/*Please make a request to see reddit data.*/}
                        {/*</div>*/}
                  {/*}*/}
                {/*</div>*/}
          {/*}*/}

        </section>
    );
  }
}


const container = document.createElement('div);
document.body.appendChild(container);

reactDomRender(<App />, container);