import React, { Component, createContext } from 'react';
import ReactDOM from 'react-dom';

import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import pullAt from 'lodash/pullAt';

import Modal from './components/Modal';

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
  surveyUser: undefined,
  surveyCount: 0,
  showModal: false,
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
    const surveyCount = this.trackSurveyCount();

    return this.setState({
      ...this.state,
      ...currentArg,
      solvedArgs,
      surveyCount,
      alertState: 'is-hidden',
      qualifiers: {
        Claim: '?',
        Data: '?',
        Warrant: '?',
      }
    });
  }

  trackSurveyCount = () => {
    let { surveyUser, surveyCount } = this.state;
    return ( surveyUser ? 0 : surveyCount +=1)
  }

  showAlert = () => {
    this.setState({
      ...this.state,
      alertState: '',
    })
    //THIS IS FOR MOVING ON AUTOMATICALLY AFTER COMPLETING AN ARGUMENT
    // setTimeout(() => {
    //   this.setState({
    //     ...this.state,
    //     alertState: 'is-hidden',
    //   })
    // }, 1200)
  };

  getRandomArg = (args) => {
    const randomIdx = Math.floor(Math.random() * args.length);
    return {
      'currentArg': args[randomIdx],
      'currentArgId': randomIdx,
    };
  }

  //THIS IS FOR MOVING ON AUTOMATICALLY AFTER COMPLETING AN ARGUMENT
  // completeArgument = (argId) => {
  //   this.showAlert();
  //   // const { args, solvedArgs } = this.state;
  //   // let updatedArgs = solvedArgs.concat([argId]);
  //   // pullAt(args, updatedArgs)
  //
  //   //BETTER: remove argId from args..?:
  //   //delete args[argId]
  //   // setTimeout(() => {
  //   //   return this.moveToNextArg(args, updatedArgs);
  //   // }, 1200)
  // }

  moveToNextArg = (argId) => {
    let { args, solvedArgs, round } = this.state;
    let updatedArgs = solvedArgs.concat([argId]);
    pullAt(args, updatedArgs)
    //If there are unsolved args left
    if(args.length) {
      //add the solved arg to localStorage...
      localStorage.setItem(
        `CognitZen-${ round }`,
        JSON.stringify(solvedArgs)
      );

      if(round === "2") {
        //make it visible in the contention review
      }
      //...and refresh the state
      return this.resetStateForNextArg(args, solvedArgs);
    } else {
      if(round === "1") {
        localStorage.removeItem(`CognitZen-${ round }`);
        solvedArgs = [];
        return this.resetStateForNextArg(args, solvedArgs)
      }
      if(round === "2") {
        //add contention to localStorage
        //make it visible in the round2 container
        //move on to the next contention (reset args & currentArg)
      }
    }
  }

// TODO: SHOULD 2nd round ARGS SHUFFLE OR NOT?
  openSurvey = () => {
    this.setState({
      ...this.state,
      showModal: true
    })
  };

  handleModalClose = () => {
    this.setState({
      ...this.state,
      showModal: false
    })
  }

  componentWillMount = () => {
    //MAKE A WIX DB CALL TO GET THE surveyUser
    //IF USER, surveyUser = USER
    let { round, solvedArgs, args } = this.state;
    if( localStorage.getItem(`CognitZen-${ round }`) ) {
      solvedArgs = JSON.parse(localStorage.getItem(`CognitZen-${ round }`));
    }
    pullAt(args, solvedArgs);

    return this.setState({
      ...this.state,
      ...this.getRandomArg(args),
      solvedArgs,
      //surveyUser
    })
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { currentArg, surveyCount } = this.state;
    if( prevState.currentArg !== currentArg ) {
      if( isEmpty(currentArg) ) {
        setTimeout(() => {
          return this.showAlert();
        }, 300)
      }
      if( (surveyCount >= 5 ) && (surveyCount % 5 === 0 )) {
        // This is a quick fix for not opening the survey 3 times in a row
        this.trackSurveyCount()
        this.openSurvey()
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
          moveToNextArg : this.moveToNextArg,
          handleModalClose: this.handleModalClose,
        }} >
        { this.props.children }
      </GameContext.Provider>
    );
  }

};

export default Provider;
