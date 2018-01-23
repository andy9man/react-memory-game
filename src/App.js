import React, { Component } from 'react';
import './App.css';

const styles = {
  tile: {
    height: '100px',
    width: '100px',
    border: '1px solid rgb(80, 80, 80)',
    outline: '0px'
  },

  disableCursor: {
    cursor: 'wait'
  },

  hidden: {
    visibility: 'hidden'
  },

  tileDefault: {
    backgroundColor: '#cfc9c9'
  },

  tileMemorize: {
    backgroundColor: 'blue'
  },

  tileCorrect: {
    backgroundColor: 'lightgreen'
  },

  tileIncorrect: {
    backgroundColor: 'lightpink'
  },

  tileUnselected: {
    backgroundColor: 'yellow'
  }
};

const generateBoard = () => {
  const array = [];
  for(let x = 0; x < 12; x++) {
    array.push({id: x, clicked: false, inGame: false});
  }
  return {tiles: array, boardState: 'uninitalized', clickCount: 0};
};

class App extends Component {
  render() {
    return (
      <div className="container">
        <header className="header">
          <h1 className="header-title">Memory Game</h1>
        </header>
        <MemoryGame state={generateBoard()} />
      </div>
    );
  }
}

class MemoryGame extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.state;
    // this.state = {
    //   tiles: [
    //     // {id: 0, clicked: false, inGame: false},
    //     // {id: 1, clicked: false, inGame: false},
    //     // {id: 2, clicked: false, inGame: false},
    //     // {id: 3, clicked: false, inGame: false},
    //     // {id: 4, clicked: false, inGame: false},
    //     // {id: 5, clicked: false, inGame: false},
    //     // {id: 6, clicked: false, inGame: false},
    //     // {id: 7, clicked: false, inGame: false},
    //     // {id: 8, clicked: false, inGame: false},
    //     // {id: 9, clicked: false, inGame: false},
    //     // {id: 10, clicked: false, inGame: false},
    //     // {id: 11, clicked: false, inGame: false},
    //   ],

    //   boardState: 'uninitialized',

    //   clickCount: 0

    // };

    this.tileClick = this.tileClick.bind(this);
    this.startGame = this.startGame.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.randomizeBoard = this.randomizeBoard.bind(this);
    this.getTileComponent = this.getTileComponent.bind(this);

  }

  randomizeBoard() {
    const numberArray = (() => {
      let array = [];
      for(let x = 0; x < 4; x++) {
        let randomNumber = '';
        while(array.includes(randomNumber = Math.floor(Math.random() * (this.state.tiles.length - 1)))) {

        }
        array.push(randomNumber);
      }
      return array;
    })();
    const newTiles = this.state.tiles;
    numberArray.forEach( item => {
      newTiles[item].inGame = true;
    });
    return newTiles;
  }

  tileClick( tileId ) {
    if( this.state.clickCount < 4) {
    this.setState({tiles: this.state.tiles.map( item => {
        return tileId === item.id ? {id: item.id, clicked: true, inGame: item.inGame} : item;
      }), boardState: 'guess', clickCount: parseInt(this.state.clickCount, 10)+1});
    }
    else { alert("You've Reaced your max amount of clicks"); }
  }

  resetGame() {
    this.setState(generateBoard());

  }

  getTileComponent(item, key) {
    switch(this.state.boardState) {
      case 'memorize':
        return (
          <MemoryTile
            key={key}
            id={item.id}
            tileClick={() => {return;}}
            style={
              Object.assign({}, styles.tile, styles.disableCursor, ( () => {
                return item.inGame ? styles.tileMemorize : styles.tileDefault
              })())
            }
          />
        );
      case 'guess':
        return (
          <MemoryTile
            key={key}
            id={item.id}
            tileClick={this.tileClick}
            style={
              Object.assign({}, styles.tile, styles.tileDefault)
            }
          />
        );
      case 'check':
        return (
          <MemoryTile
            key={key}
            id={item.id}
            tileClick={this.tileClick}
            style={
              Object.assign({}, styles.tile, ( () => {
                return item.inGame && item.clicked ? styles.tileCorrect : item.clicked ? styles.tileIncorrect : item.inGame ? styles.tileUnselected : styles.tileDefault
              })())
            }
          />
        );
      default:
        return (
          <MemoryTile
            key={key}
            id={item.id}
            tileClick={this.tileClick}
            style={
              Object.assign({}, styles.tile, styles.tileDefault)
            }
          />
        );
    }
  }

  startGame() {

    //Randomize the current board with things that should be clicked
    this.setState({tiles:this.randomizeBoard(), boardState: 'memorize'});

    //Show the board for the user to memorize for 3 seconds
    window.setTimeout( () => {
      this.setState({boardState: 'guess'});
      //Allow the user to make their guesses for 5 seconds
      window.setTimeout( () => {
        this.setState({boardState: 'check'});
      }, 5000);

    }, 3000);
  }

  render() {
    return (
      <div id="memory-game">

        {this.state.tiles.map( (item, index) => {
          return this.getTileComponent(item, index);
        })}

        <MemoryGameController
          status= {this.state.boardState === 'guess' ? 'Guess the correct cells!!' : ''}
          style= {this.state.boardState === 'guess' ? styles.hidden : styles.show }
          buttonText= {this.state.boardState === 'check' ? 'Reset Game' : 'Start Game'}
          clickEvent={this.state.boardState === 'check' ? this.resetGame : this.startGame}
        />
      </div>
    );
  }
}

class MemoryTile extends Component {

  render() {
    return (
      <button style={this.props.style} onClick={ () => {this.props.tileClick(this.props.id);}}/>
    );
  }
}

class MemoryGameController extends Component {

  render() {
    return (
      <div id="memory-game-controller">
        <p className="status">{this.props.status}</p>
        <button onClick={this.props.clickEvent} style={this.props.style}>{this.props.buttonText}</button>
      </div>
    );
  }
}

export default App;
