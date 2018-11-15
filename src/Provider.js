import React, { Component, createContext } from 'react';

import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import pullAt from 'lodash/pullAt';
import Data from './data-1.json';

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

  solvedArgs: [],
  alertState: 'is-hidden',
}

export const GameContext = createContext(DEFAULT_STATE);

class Provider extends Component {
  state = DEFAULT_STATE;

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
          logCorrectAnswer: this.logCorrectAnswer,
          renderQualifiers: this.renderQualifiers,
          resetStateForNextArg : this.resetStateForNextArg,
          showAlert: this.showAlert,
        }} >
        { this.props.children }
      </GameContext.Provider>
    );
  }

};

export default Provider;
