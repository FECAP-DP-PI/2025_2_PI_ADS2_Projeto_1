import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './componentes/Home'
import Admin from './componentes/Admin'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <div style={{padding:20}}>
      <nav style={{display:'flex', gap:10, marginBottom:20}}>
        <Link to='/'>Home</Link>
        <Link to='/admin'>Admin</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/admin' element={<Admin/>} />
      </Routes>
    </div>
  </BrowserRouter>
)
