import React, { Component, createContext } from 'react';

import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import pullAt from 'lodash/pullAt';

const DEFAULT_STATE = {
  qualifiers: {
    Claim: '?',
    Data: '?',
    Warrant: '?',
  },
  currentArg: {},
  currentArgId: '',
  solvedArgs: [],
  alertState: 'is-hidden',
  // TODO: CREATE A CONTEXT FOR ROUND2 OR ADD IT HERE?! :
  // contentionTitle: Data.content,
  // contentions: Data.contentions,
  // currentCase: Data.contentions[1],
  // solvedCases: []
}

export const GameContext = createContext(DEFAULT_STATE);

class Provider extends Component {
  state = {
    ...DEFAULT_STATE,
    round: this.props.round,
    args: this.props.args,
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

  resetStateForNextArg = (unsolvedArgs, solvedArgs) => {
    const currentArg = this.getRandomArg(unsolvedArgs);
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
    pullAt(args, updatedArgs)

    //BETTER: remove argId from args..?:
    //delete args[argId]
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

// TODO: SHOULD 2nd round ARGS SHUFFLE OR NOT?

  componentWillMount = () => {
    let { round, solvedArgs, args } = this.state;
    console.log(this.state.args);
    if( localStorage.getItem(`CognitZen-${ round }`) ) {
      solvedArgs = JSON.parse(localStorage.getItem(`CognitZen-${ round }`));
    }
    pullAt(args, solvedArgs);

    return this.setState({
      ...this.state,
      ...this.getRandomArg(args),
      solvedArgs,
    })
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { currentArg, currentArgId } = this.state;
    if(prevState.currentArg !== currentArg) {
      if(isEmpty(currentArg)) {
        setTimeout(() => {
          return this.completeArgument(currentArgId);
        }, 500)
      }
    }
  };

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
