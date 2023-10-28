import React, { Component } from 'react';

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDiv: 1, // Initially, the first div is active
    };
  }

  showDiv = (divNumber) => {
    this.setState({ activeDiv: divNumber });
  };

  render() {
    return (
      <div>
        <div style={{ display: this.state.activeDiv === 1 ? 'block' : 'none' }}>
          Content 1
        </div>
        <div style={{ display: this.state.activeDiv === 2 ? 'block' : 'none' }}>
          Content 2
        </div>
        <div style={{ display: this.state.activeDiv === 3 ? 'block' : 'none' }}>
          Content 3
        </div>

        <button onClick={() => this.showDiv(1)}>Show Div 1</button>
        <button onClick={() => this.showDiv(2)}>Show Div 2</button>
        <button onClick={() => this.showDiv(3)}>Show Div 3</button>
      </div>
    );
  }
}

export default Carousel;
