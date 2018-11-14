import React, { Component } from 'react';
import shuffle from 'lodash/shuffle';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import pullAt from 'lodash/pullAt';
import Data from '../data-1.json';

import Qualifier from './Qualifier';
import Argument from './Argument';

// TODO: refactor the Game component so that it can be used without randomizing the args
class Game extends Component {
  state = {
    qualifiers: {
      Claim: '?',
      Data: '?',
      Warrant: '?',
    },
    round: this.props.round,
    args: Data,
    currentArg: this.props.currentArg,
    currentArgId: '',
    wrongQualifier: '',
    solvedArgs: [],
    alertState: 'is-hidden',
  };

///GAME LOGIC, DON'T TOUCH////
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

  renderQualifiers = (qualifiers) => {
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

  renderArg = (arg) => {
    let argArray = Object.keys(arg);
    //Shuffle the parts of the argument when it's first displayed
    if ( argArray.length === 3 ) argArray = shuffle(argArray)
    return argArray.map((key, idx) => {
      const value = arg[key]
        return (
          <Argument
            key={idx}
            content={value}
            handleDragStart={(e) => this.handleDragStart(e, value, key)}
          />
        )
    })
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

  ////GAME LOGIC OVER /////

  //When argument is completed, add it to solved args, remove it from
  //(unsolved) args and move to next arg with the new unsolved & solved args
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

  // getNextArg = (args) => {
  //
  // }

  getRandomArg = (args) => {
    const randomIdx = Math.floor(Math.random() * args.length);
    return {
      'currentArg': args[randomIdx],
      'currentArgId': randomIdx,
    };
  }

  // checkLocalStorage = () => {
  //   let { solvedArgs, args, round } = this.state;
  //   if( localStorage.getItem(`CognitZen-${ round }`) ) {
  //     solvedArgs = JSON.parse(localStorage.getItem(`CognitZen-${ round }`));
  //   }
  //   pullAt(args, solvedArgs);
  //   return args;
  // }

  componentWillMount = () => {
    let { round, solvedArgs, args } = this.state;
    if(round === "1") {
      //this.checkLocalStorage()
      if( localStorage.getItem(`CognitZen-${ round }`) ) {
        solvedArgs = JSON.parse(localStorage.getItem(`CognitZen-${ round }`));
      }
      pullAt(args, solvedArgs);
      return this.setState({
        ...this.state,
        ...this.getRandomArg(args),
        solvedArgs,
      })
    }
    if(round === "2") {
      if( localStorage.getItem('CognitZen-round2') ) {
        solvedArgs = JSON.parse(localStorage.getItem('CognitZen-round2'));
      }
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { currentArg, currentArgId } = this.state;
    if(prevState.currentArg !== currentArg) {
      if(isEmpty(currentArg)) {
        setTimeout(() => {
          return this.completeArgument(currentArgId);
        }, 200)
      }
    }
  };

  render() {
    const {
      qualifiers,
      currentArg,
      alertState,
    } = this.state;

    return (
      <div className="App-wrapper">
        <h2>Identify elements of an argument</h2>
        <div className='qualifiers-container'>
          { this.renderQualifiers(qualifiers) }
        </div>
        <h2>Argument</h2>
        <div className="qualifiers-container">
          { this.renderArg(currentArg) }
        </div>
        <div className={ `alert ${ alertState }` }>
          <h2>Correct!</h2>
        </div>
      </div>
    );
  }
}

export default Game;
