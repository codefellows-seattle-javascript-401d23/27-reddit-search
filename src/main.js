import React from 'react';
import { render as reactDomRender } from 'react-dom';
import superagent from superagent;
import './style/main.scss';

const apiURL = 'http://pokeapi.co/api/v2/pokemon';

class PokemonSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pokeName: '',
    };

    this.handlePokemonNameChange = this.handlePokemonNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handlePokemonNameChange(event) {
    this.setState({pokeName: event.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.pokemonSelect(this.state.pokeName);
  }

  render() {
    return (
        <form onSubmit={this.handleSubmit}>
          <input
            type='type'
            name='pokemonName'
            placeholder='Search for a Pokemon!'
            value={this.state.pokeName}
            onChange={this.handlePokemonNameChange}
            />

        </form>
    );
  }
}


class App extends React.Component {
        constructor
  }

