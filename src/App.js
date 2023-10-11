import React, { PureComponent } from 'react'
import Stars from './components/Stars'
import './App.css'

export default class App extends PureComponent {
  render() {
    return (
      <div className='container'>
        <Stars/>
        <div className='title'>div here</div>
      </div>
    )
  }
}
