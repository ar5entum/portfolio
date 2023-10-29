import React, { PureComponent } from 'react'
import './App.css'
import Stars from './components/Stars/Stars'
import Works from './pages/Works'
import Resume from './pages/Resume'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar/NavBar'
import Home from './pages/Home'

export default class App extends PureComponent {
  
  render() {
    
    return (
      <BrowserRouter>
      <div className='main'>
        <NavBar/>
        <Stars/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="works" element={<Works/>}/>
        <Route path="resume" element={<Resume/>}/>
      </Routes>
      </div>
      </BrowserRouter>
    )
  }
}

