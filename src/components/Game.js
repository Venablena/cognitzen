import React, { Component } from 'react';
import { GameContext } from '../Provider';
import shuffle from 'lodash/shuffle';

import Argument from './Argument';
import Qualifier from './Qualifier';

class Game extends Component {
  state = {
    wrongQualifier: '',
  };

  renderArg = (currentArg) => {
    let argArray = Object.keys(currentArg);
    //Shuffle the parts of the argument when it's first displayed
    if ( argArray.length === 3 ) argArray = shuffle(argArray)
    return argArray.map((key, idx) => {
      const value = currentArg[key]
        return (
          <Argument
            key={idx}
            content={value}
            handleDragStart={(e) => this.handleDragStart(e, value, key)}
          />
        )
    })
  };

  renderQualifiers = (qualifiers, logCorrectAnswer) => {
    const { wrongQualifier } = this.state;
    return Object.keys(qualifiers).map((key, idx) => {
      const type = key;
      const content = qualifiers[key];
        return (
          <Qualifier
            key={idx}
            type={type}
            content={content}
            className={
              (key===wrongQualifier )? 'qualifier transition-wrong' : 'qualifier'
            }
            handleDrop={(e) => this.handleDrop(e, content, type, logCorrectAnswer)}
          />
        )
    })
  };

  handleDragStart = (e, content, type) => {
    e.dataTransfer.setData("content", content);
    e.dataTransfer.setData("type", type);
    //IE:
    //ev.dataTransfer.setData(“text/plain”,id);
  };

  handleDrop = (e, content, type, logCorrectAnswer) => {
    const qualifierContent = e.dataTransfer.getData("content");
    const suggestionType = e.dataTransfer.getData("type");
    if(suggestionType === type) return logCorrectAnswer(qualifierContent, suggestionType);
    else return this.logWrongAnswer(type);
  };

  logWrongAnswer = (type) => {
    this.setState({
      ...this.state,
      wrongQualifier: type,
    })

    setTimeout(()=> {
      this.setState({
        ...this.state,
        wrongQualifier: "",
      })
    }, 1200)
  };

  render() {
    return (
      <GameContext.Consumer>
        {({
          qualifiers,
          currentArg,
          logCorrectAnswer,
          alertState,
          moveToNextArg
        }) => {
          return (
            <div className="App-wrapper">
              <h2>Identify elements of an argument</h2>
              <div className='qualifiers-container'>
                { this.renderQualifiers(qualifiers,logCorrectAnswer) }
              </div>
              <h2>Argument</h2>
              <div className="arguments-container">
                { this.renderArg(currentArg) }
              </div>
              <div className={ `alert ${ alertState }` }>
                <button
                  className='button-next'
                  onClick={ moveToNextArg }>
                  <h2>Correct! ></h2>
                </button>
              </div>
            </div>
          );
        }}
      </GameContext.Consumer>
    );
  }
}

export default Game;
