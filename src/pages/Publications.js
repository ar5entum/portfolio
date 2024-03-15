import React, { PureComponent } from "react";

export default class Resume extends PureComponent {
  render() {
    return (
      <div className="flexContainer">
        <div className="contentContainer">
          <h3>Publications</h3>
        </div>
        <object
          width="80%"
          height="80%"
          data="/paper.pdf#page=1&zoom=150"
          type="application/pdf"
        >
          {" "}
        </object>
      </div>
    );
  }
}
