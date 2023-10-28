import React, { PureComponent } from 'react'
import './App.css'
import Stars from './components/Stars/Stars'
import Works from './pages/Works'
import Resume from './pages/Resume'

export default class App extends PureComponent {
  
  render() {
    
    return (
      <div className='main'>
        <Stars/>
        <Resume/>
      </div>
    )
  }
}

