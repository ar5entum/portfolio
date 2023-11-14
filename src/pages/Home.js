import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import linkedin from "../components/NavBar/images/linkedin.svg";
import github from "../components/NavBar/images/github.svg";
import kaggle from "../components/NavBar/images/kaggle.svg";

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
            <Link to="simulator" className="button-27">
              Enter simulation
            </Link>
            <div className="mobileSocials">
              <a href="https://www.linkedin.com/in/astitva-jaiswal/">
                <img src={linkedin} id="linkedin" alt="linkedin" />
              </a>
              <a href="https://www.kaggle.com/ar5entum">
                <img src={kaggle} id="kaggle" alt="kaggle" />
              </a>
              <a href="https://github.com/ar5entum">
                <img src={github} id="github" alt="github" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
