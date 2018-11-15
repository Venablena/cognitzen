import React, { Component, createContext } from 'react';
import shuffle from 'lodash/shuffle';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import pullAt from 'lodash/pullAt';
import Data from './data-1.json';

import Qualifier from './components/Qualifier';
import Argument from './components/Argument';

const DEFAULT_STATE = {
  qualifiers: {
    Claim: '?',
    Data: '?',
    Warrant: '?',
  },
  round: "1",
  args: Data,
  currentArg: Data[1],
  currentArgId: '',
  wrongQualifier: '',
  solvedArgs: [],
  alertState: 'is-hidden',
}

export const GameContext = createContext(DEFAULT_STATE);

class Provider extends Component {
  state = DEFAULT_STATE;

  handleDragStart = (e, content, type) => {
    e.dataTransfer.setData("content", content);
    e.dataTransfer.setData("type", type);
    //IE:
    //ev.dataTransfer.setData(“text/plain”,id);
  };

  handleDrop = (e, content, type) => {
    const qualifierContent = e.dataTransfer.getData("content");
    const suggestionType = e.dataTransfer.getData("type");
    if(suggestionType === type) return this.logCorrectAnswer(qualifierContent, suggestionType);
    else return this.logWrongAnswer(type);
  };

  logCorrectAnswer = (content, type) => {
    const { currentArg } = this.state;
    const updatedArg = omit(currentArg, type)

    this.setState({
      ...this.state,
      qualifiers : {
        ...this.state.qualifiers,
        [type]: content,
      },
      currentArg: updatedArg,
    })
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

  renderQualifiers = () => {
    const { qualifiers } = this.state;

    return Object.keys(qualifiers).map((key, idx) => {
      const type = key;
      const content = qualifiers[key];
      const { wrongQualifier } = this.state;

        return (
          <Qualifier
            key={idx}
            type={type}
            content={content}
            className={
              (key===wrongQualifier )? 'qualifier transition-wrong' : 'qualifier'
            }
            handleDrop={(e) => this.handleDrop(e, content, type)}
          />
        )
    })
  };

  renderArg = () => {
    const { currentArg } = this.state;
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
  }

  resetStateForNextArg = (unsolvedArgs, solvedArgs) => {
    const { round } = this.state;
    let currentArg;
    if( round === "1") currentArg = this.getRandomArg(unsolvedArgs);
    if( round === "2") currentArg = unsolvedArgs[0];
    return this.setState({
      ...this.state,
      ...currentArg,
      solvedArgs,
      qualifiers: {
        Claim: '?',
        Data: '?',
        Warrant: '?',
      }
    });
  }

  showAlert = () => {
    this.setState({
      ...this.state,
      alertState: '',
    })

    setTimeout(() => {
      this.setState({
        ...this.state,
        alertState: 'is-hidden',
      })
    }, 800)
  };

  getRandomArg = (args) => {
    const randomIdx = Math.floor(Math.random() * args.length);
    return {
      'currentArg': args[randomIdx],
      'currentArgId': randomIdx,
    };
  }

  completeArgument = (argId) => {
    this.showAlert();
    const { args, solvedArgs } = this.state;
    let updatedArgs = solvedArgs.concat([argId]);
    //BETTER: remove argId from args..?:
    //delete args[argId]
    pullAt(args, updatedArgs)
    return this.moveToNextArg(args, updatedArgs);
  }

  moveToNextArg = (allArgs, solvedArgs) => {
    const { round } = this.state;
    //If there are unsolved args left
    if(allArgs.length) {
      //add the solved arg to localStorage...
      localStorage.setItem(
        `CognitZen-${ round }`,
        JSON.stringify(solvedArgs)
      );

      if(round === "2") {
        //make it visible in the contention review
      }
      //...and refresh the state
      return this.resetStateForNextArg(allArgs, solvedArgs);
    } else {
      if(round === "1") {
        localStorage.removeItem(`CognitZen-${ round }`);
        solvedArgs = [];
        return this.resetStateForNextArg(allArgs, solvedArgs)
      }
      if(round === "2") {
        //add contention to localStorage
        //make it visible in the round2 container
        //move on to the next contention (reset args & currentArg)
      }
    }
  }

  render() {
    return (
      <GameContext.Provider
        value = {{
          ...this.state,
          //handleDragStart: this.handleDragStart,
          //handleDrop: this.handleDrop,
          logCorrectAnswer: this.logCorrectAnswer,
          logWrongAnswer: this.logWrongAnswer,
          renderQualifiers: this.renderQualifiers,
          renderArg: this.renderArg,
          resetStateForNextArg : this.resetStateForNextArg,
          showAlert: this.showAlert,
        }} >
        {this.props.children}
      </GameContext.Provider>
    );
  }

};

export default Provider;
