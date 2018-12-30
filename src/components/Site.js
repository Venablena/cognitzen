import React, { Component } from 'react';

class Site extends Component {
 render () {
   return (
     <main className='Site-wrapper'>
      <div className='Site-header'>
       <img
          alt='cognitzen logo'
          src='cognitzenlogo.png'
          className='logo'
        />
        <a
          href='https://www.cognitzen.com/game'
          className='back-link'
        >&#8617;
        <div>
          Back
        </div>
        </a>
      </div>
       { this.props.children }
     </main>
   );
 }
}

export default Site;
