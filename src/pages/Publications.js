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
        data="https://www.researchgate.net/profile/Shawn-Thomas-12/publication/376054169_A_Critical_Analysis_of_Approaches_to_Glaucoma_Detection/links/656ac3603fa26f66f445cd67/A-Critical-Analysis-of-Approaches-to-Glaucoma-Detection.pdf"
        type="application/pdf">
        </object>
      </div>
    );
  }
}
