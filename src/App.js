import React, { PureComponent } from 'react'
import './App.css'
import Mesh from './components/Mesh/Mesh'
// import Archive from './pages/Archive'
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import NavBar from './components/NavBar/NavBar'
// import Home from './pages/Home'

export default class App extends PureComponent {
  
  render() {
    
    return (
      // <BrowserRouter>
      <div className='main'>
        {/* <NavBar/> */}
        <Mesh/>
      {/* <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="archive" element={<Archive/>}/>
      </Routes> */}
      </div>
      // </BrowserRouter>
    )
  }
}

