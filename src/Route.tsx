import { Routes, Route } from 'react-router-dom'

import Benchmarks from './module/benchmark/Benchmarks'
import MainPage from './module/componentList/MainPage'
import AILogicPage from './module/aiComponentList/AILogicPage'
import Database from './module/database/page/Database'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/benchmarks" element={<Benchmarks />} />
      <Route path="/list-generator" element={<AILogicPage />} />
      <Route path="/database" element={<Database />} />
    </Routes>
  )
}

export default AppRoutes
