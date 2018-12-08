import React, { Component, createContext } from 'react';

import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import difference from 'lodash/difference';

const DEFAULT_STATE = {
  qualifiers: {
    Claim: '?',
    Data: '?',
    Warrant: '?',
  },
  currentArg: {},
  currentArgId: '',
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
    const { args } = this.state;
    const currentArg = this.getRandomArg(unsolvedArgIds, args);
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
  };

  getRandomArg = (unsolvedArgs, allArgs) => {
    //WHY DO I NEED TO PASS THE PARAMETERS HERE?
    //IF I GET THESE FROM THE STATE INSIDE GETRANDOMARG,
    //THEY ARE STALE
    //const { unsolvedArgIds, args } = this.state;
    const randomIdx = Math.floor(Math.random() * unsolvedArgs.length);
    const id = unsolvedArgs[randomIdx];
    const currentArg = allArgs[id]

    return {
      currentArg,
      currentArgId: id,
    };
  };

  moveToNextArg = () => {
    const {
      unsolvedArgIds,
      round,
      currentArgId
    } = this.state;

    let updatedUnsolvedArgs = difference(unsolvedArgIds, [currentArgId]);
    if(updatedUnsolvedArgs.length) {
      const solvedArgs = this.getSolvedIds().concat([currentArgId]);
      localStorage.setItem(
        `CognitZen-${ round }`,
        JSON.stringify(solvedArgs)
      );
      if(round === "2") {
        //make it visible in the contention review
      }
    } else {
      if(round === "1") {
        localStorage.setItem(`CognitZen-${ round }`, "[]");
        updatedUnsolvedArgs = this.props.unsolvedArgIds;
      }
      if(round === "2") {
      //   //add contention to localStorage
      //   //make it visible in the round2 container
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
    let { unsolvedArgIds, args } = this.state;
    const solvedArgIds = this.getSolvedIds();
    if(solvedArgIds.length) unsolvedArgIds = difference(unsolvedArgIds, solvedArgIds);

    return this.setState({
      ...this.state,
      ...this.getRandomArg(unsolvedArgIds, args),
      unsolvedArgIds,
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
      if(
        (surveyCount === 10 ) || 
        (surveyCount === 25 ) ||
        (surveyCount === 50) ) {
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
