import React, { Component, createContext } from 'react';
import ReactDOM from 'react-dom';

import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import difference from 'lodash/difference';

import Modal from './components/Modal';

const DEFAULT_STATE = {
  qualifiers: {
    Claim: '?',
    Data: '?',
    Warrant: '?',
  },
  currentArg: {},
  currentArgId: '',
  //solvedArgIds: [],
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
    unsolvedArgIds: this.props.unsolvedArgIds,
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

  resetStateForNextArg = (unsolvedArgIds) => {
    const currentArg = this.getRandomArg();
    const surveyCount = this.trackSurveyCount();

    return this.setState({
      ...this.state,
      ...currentArg,
      surveyCount,
      unsolvedArgIds,
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

  getRandomArg = () => {
    const { unsolvedArgIds, args } = this.state;
    const randomIdx = Math.floor(Math.random() * unsolvedArgIds.length);
    const currentArgIndex = unsolvedArgIds[randomIdx];
    const currentArg = args[currentArgIndex]
    const currentArgId = currentArg.Id;
    delete currentArg.Id;

    return {
      currentArg,
      currentArgId,
    };
  }

  //THIS IS FOR MOVING ON AUTOMATICALLY AFTER COMPLETING AN ARGUMENT
  // completeArgument = (argId) => {
  //   this.showAlert();
  //   // const { args, solvedArgIds } = this.state;
  //   // let updatedArgs = solvedArgIds.concat([argId]);
  //   // pullAt(args, updatedArgs)
  //
  //   //BETTER: remove argId from args..?:
  //   //delete args[argId]
  //   // setTimeout(() => {
  //   //   return this.moveToNextArg(args, updatedArgs);
  //   // }, 1200)
  // }

  moveToNextArg = (argId) => {
    const {
      args,
      unsolvedArgIds,
      round
    } = this.state;

    //Remove the solved arg from the unsolved args...
    let updatedUnsolvedArgs = difference(unsolvedArgIds, argId);
    //...and if there are unsolved args left
    if(updatedUnsolvedArgs.length) {
      //add the solved arg to localStorage...
      const solvedArgs = this.getSolvedIds().concat(argId);
      localStorage.setItem(
        `CognitZen-${ round }`,
        JSON.stringify(solvedArgs)
      );

      if(round === "2") {
        //make it visible in the contention review
      }
    } else {
      if(round === "1") {
        localStorage.setItem(`CognitZen-${ round }: []`);
        updatedUnsolvedArgs = Object.keys(args);

      }
      if(round === "2") {
        //add contention to localStorage
        //make it visible in the round2 container
      }
    }
    return this.resetStateForNextArg(updatedUnsolvedArgs);
  }

// TODO: SHOULD 2nd round ARGS SHUFFLE OR NOT?
  openSurvey = () => {
    this.setState({
      ...this.state,
      showModal: true
    })
  };

  handleModalClose = () => {
    const surveyCount = this.trackSurveyCount();
    this.setState({
      ...this.state,
      showModal: false,
      surveyCount,
    })
  }

  getSolvedIds = () => {
    const {round} = this.state;
    if( localStorage.getItem(`CognitZen-${ round }`) ) {
      return JSON.parse(localStorage.getItem(`CognitZen-${ round }`));
    }
    return [];
  }

  componentWillMount = () => {
    //MAKE A WIX DB CALL TO GET THE surveyUser
    //IF USER, surveyUser = USER
    const { unsolvedArgIds } = this.state;
    const solvedArgIds = this.getSolvedIds();
    const unsolvedArgs = difference(unsolvedArgIds, solvedArgIds);

    return this.setState({
      ...this.state,
      ...this.getRandomArg(),
      unsolvedArgIds: unsolvedArgs,
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
