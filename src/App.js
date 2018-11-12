import React, { Component } from 'react';
import shuffle from 'lodash/shuffle';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import pullAt from 'lodash/pullAt';
import './App.css';
import Qualifier from './components/Qualifier';
import Argument from './components/Argument';
import Data from './data.json';

// TODO:
// Add warnings when argument is completed and when ALL arguments have been complete

class App extends Component {
  state = {
    qualifiers: {
      Claim: '?',
      Data: '?',
      Warrant: '?',
    },
    args: Data,
    currentArg: {},
    currentArgId: '',
    wrongQualifier: '',
    solvedArgs: [],
  };

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
    return shuffle(Object.keys(arg).map((key, idx) => {
      const value = arg[key]
        return (
          <Argument
            key={idx}
            content={value}
            handleDragStart={(e) => this.handleDragStart(e, value, key)}
          />
        )
      })
    )
  }

  randomizeArgument = (args) => {
    const randomIdx = Math.floor(Math.random() * args.length);
    return {
      'currentArg': args[randomIdx],
      'currentArgId': randomIdx,
    };
  }

  completeArgument = (argId) => {
    const { args, solvedArgs } = this.state;
    let updatedArgs = solvedArgs.concat([argId]);
    pullAt(args, updatedArgs)
    //If all the arguments have been solved, empty them from localStorage and state
    if(args.length) {
      localStorage.setItem(
        'CognitZen',
        JSON.stringify(updatedArgs)
      );
    } else {
      localStorage.removeItem('CognitZen');
      updatedArgs = [];
    }

    this.setState({
      ...this.state,
      solvedArgs: updatedArgs,
      ...this.randomizeArgument(args),
      qualifiers: {
        Claim: '?',
        Data: '?',
        Warrant: '?',
      }
    });
  }

  componentWillMount = () => {
    let { solvedArgs, args } = this.state;
    if( localStorage.getItem('CognitZen') ) {
      solvedArgs = JSON.parse(localStorage.getItem('CognitZen'));
    }
    pullAt(args, solvedArgs)

    this.setState({
      ...this.state,
      ...this.randomizeArgument(args),
      solvedArgs,
    })
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { currentArg, currentArgId } = this.state;
    if(prevState.currentArg !== currentArg) {
      if(isEmpty(currentArg)) return this.completeArgument(currentArgId);
    }
  };

  render() {
    const {
      qualifiers,
      currentArg
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
      </div>
    );
  }
}

export default App;
