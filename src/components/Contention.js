import React, { Component, Fragment } from 'react';

class Contention extends Component {
  // state = {
  //   isComplete: false,
  // }
  //
  render(){
    const {
      title,
      solvedArgs,
    } = this.props;

    return (
      <Fragment>
        <h3>{ title }</h3>
        <div>
          {  solvedArgs.length &&
              solvedArgs.map((el, i) => {
                return <p>{el}</p>
              })
          }
        </div>
      </Fragment>
    );
  }
}
export default Contention;
