import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

export default class Home extends PureComponent {
  render() {
    return (
      <div className="flexContainer">
        <div className="homeContainer">
          <div>
            <div className="subtitle">Machine Learning | Solutionist</div>
            <div className="title">Astitva Jaiswal</div>
          </div>
          <div>
            <div className="subtitle">
              This background serves as a real-time simulation tool designed for
              understanding machine learning optimizers.
            </div>
            <div>
              {/* <button className="button-27"> */}
              <Link to="simulator" className="button-27">
                Enter simulation
              </Link>
              {/* </button> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
