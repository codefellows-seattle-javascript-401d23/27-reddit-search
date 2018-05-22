import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from superagent;
import './style/main.scss';

// const apiURL = `https://reddit.com/r/${searchFormBoard}.json?limit=${searchFormLimit}`;
// TODO refactor the above line

class redditSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redditBoardName: '',
    };

    this.handleBoardNameChange = this.handleBoardNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleBoardNameChange(event) {
    this.setState({redditBoardName: event.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.redditBoardSelect(this.state.redditBoardName); ---------------------comback here!!
  }

  render() {
    return (
        <form onSubmit={this.handleSubmit}>
          <input
            type='type'
            name='redditBoardName'
            placeholder='Search for a reddit Board'
            value={this.state.redditBoardName}
            onChange={this.handleBoardNameChange}
            />
        </form>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardLookup: {},
      redditBoardSelected: null,
      redditBoardName: null,
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
        return this.setState({pokemonLookup});
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
      return superagent.get(this.state.pokemonLookup[name])
        .then((response) => {
          this.setState({
            pokemonSelected: response.body,
            pokemonNameError: null,
          });
        })
        .catch(console.error);
    }
    return undefined;
  }

  renderAbilitiesList(pokemon) {
    return (
        <ul>
          { pokemon.abilities.map((item, index) => {
            return (
                <li key={index}>
                  <p>{item.ability.name}</p>
                </li>
            );
          })}
        </ul>
    );
  }

  render() {
    return (
        <section>
          <h1>Pokemon Form Demo</h1>
          <PokemonSearchForm
              pokemonSelect={this.pokemonSelect}
          />
          {
            this.state.pokemonNameError ?
                <div>
                  <h2 className="error">
                    { `"${this.state.pokemonNameError}"`} does not exist.
                    Please make another request.
                  </h2>
                </div> :
                <div>
                  {
                    this.state.pokemonSelected ?
                        <div>
                          <div>
                            <img src={this.state.pokemonSelected.sprites.front_default} />
                          </div>
                          <h2>Selected: {this.state.pokemonSelected.name}</h2>
                          <h3>Abilities:</h3>
                          { this.renderAbilitiesList(this.state.pokemonSelected)}
                        </div> :
                        <div>
                          Please make a request to see pokemon data.
                        </div>
                  }
                </div>
          }

        </section>
    );
  }
}


const container = document.createElement('div);
document.body.appendChild(container);

reactDomRender(<App />, container);