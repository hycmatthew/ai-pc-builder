import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Database from './Database'

function DatabaseListRoutes() {
  return (
    <Routes>
      <Route path="/database" element={<Database />} />
    </Routes>
  )
}

export default DatabaseListRoutes
