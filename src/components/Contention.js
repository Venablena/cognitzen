import React, { Component, Fragment } from 'react';

class Contention extends Component {
  render(){
    const {
      title,
      solvedArgIds,
    } = this.props;

    return (
      <Fragment>
        <h3>{ title }</h3>
        <div>
          {  solvedArgIds.length &&
              solvedArgIds.map((el, i) => {
                return <p>{el}</p>
              })
          }
        </div>
      </Fragment>
    );
  }
}
export default Contention;
