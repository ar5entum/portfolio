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
            <p>
              Machine learning optimizers adjust model parameters (weights and
              biases) to minimize a mathematical function by iteratively
              updating weights using gradients, aiming to find the optimal
              configuration for accurate predictions. These algorithms
              iteratively attempt to find the global minimas of differentiable
              functions.
            </p>
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
