import React from 'react'
import { Routes, Route } from 'react-router-dom'

import AILogicPage from './AILogicPage'

function AIComponentListRoutes() {
  return (
    <Routes>
      <Route path="/ai-build" element={<AILogicPage />} />
    </Routes>
  )
}

export default AIComponentListRoutes
