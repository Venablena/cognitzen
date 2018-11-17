import React , { Component } from 'react';
import { Helmet } from 'react-helmet';

class PopUp extends Component {
  state = { show: true };

  // showModal = () => {
  //   this.setState({ show: true });
  // };

  handleClose = () => {
    this.setState({ show: false });
  };

  render() {
    const showHideClassName = this.state.show ? "modal display-block" : "modal display-none";

    return (
      <main className={`modal-main ${showHideClassName}`}>
        <Helmet>
          <script
            type="text/javascript"
            src="https://widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgdwFCTVJK95HlyfyCK_2B0RscRML0iiQfYvofOrCoYG1Zj8.js"
          />
        </Helmet>
        <button onClick={this.handleClose}>close</button>
      </main>
    );
  }
}

export default PopUp;
