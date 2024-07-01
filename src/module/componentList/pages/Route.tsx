import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Benchmarks from './Benchmarks'
import MainPage from './MainPage'

function ComponentListRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/benchmarks" element={<Benchmarks />} />
    </Routes>
  )
}

export default ComponentListRoutes
