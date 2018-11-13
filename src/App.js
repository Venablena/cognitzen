import React, { Component, Fragment } from 'react';
import Game from './components/Game';
import Round2 from './components/Round2';
import './App.css';

class App extends Component {
  render() {
    return (
      <Fragment>
        {/*<Game />*/}
        <Round2 />
      </Fragment>
    );
  }
}

export default App;
