import React, { Component } from 'react';

class Site extends Component {
 render () {
   return (
     <main className='Site-wrapper'>
      // <div className='Site-header'>
        <a
          href='https://www.cognitzen.com/game'
          className='back-link'
        >
          &#12296;
          back
        </a>
       <img
        alt='cognitzen logo'
        src='cognitzenlogo.png'
        className='logo'
      />
      // </div>
       { this.props.children }
     </main>
   );
 }
}

export default Site;
