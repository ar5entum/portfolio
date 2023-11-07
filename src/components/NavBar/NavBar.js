import React, { PureComponent } from 'react'
import './NavBar.css'
import linkedin from './images/linkedin.svg'
import github from './images/github.svg'
import kaggle from './images/kaggle.svg'
import { Link } from "react-router-dom";

export default class NavBar extends PureComponent {
  render() {
    return (
        <div className='navbar'>
        <nav>
        <ul><div className='navTitle'>ar5entum</div></ul>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="archive">Archive</Link></li>
        {/* </ul> */}
        <span/>
        {/* <ul> */}
              <li><a href="https://www.linkedin.com/in/astitva-jaiswal/"><img src={linkedin} id="linkedin" alt='linkedin'/></a></li>
              <li><a href="https://www.kaggle.com/ar5entum"><img src={kaggle} id="kaggle" alt='kaggle'/></a></li>
              <li><a href="https://github.com/ar5entum"><img src={github} id="github" alt='github'/></a></li>
        </ul>
        </nav>
        </div>
    )
  }
}
