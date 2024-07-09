import { Suspense } from 'react'
import { Provider } from 'react-redux'
import ReactGA from 'react-ga4'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import AIComponentListRoutes from './module/aiComponentList/pages/Route'

import ComponentListRoutes from './module/componentList/pages/Route'
import DatabaseListRoutes from './module/database/page/Route'

import {
  getAIODataList,
  getAirCoolerDataList,
  getCaseDataList,
  getCPUDataList,
  getGPUDataList,
  getMotherboardDataList,
  getPSUDataList,
  getRAMDataList,
  getSSDDataList,
} from './store/rawDataReducer'
import store from './store/store'
import config from './config/config'
import AppLayout from './module/common/appLayout/AppLayout'

ReactGA.initialize(config.GA_TRACKING_ID)

function App() {
  store.dispatch(getCPUDataList())
  store.dispatch(getGPUDataList())
  store.dispatch(getMotherboardDataList())
  store.dispatch(getRAMDataList())
  store.dispatch(getPSUDataList())
  store.dispatch(getCaseDataList())
  store.dispatch(getAIODataList())
  store.dispatch(getSSDDataList())
  store.dispatch(getAirCoolerDataList())

  return (
    <Suspense fallback="loading">
      <Provider store={store}>
        <HashRouter>
          <AppLayout>
            <>
              <ComponentListRoutes />
              <DatabaseListRoutes />
              <AIComponentListRoutes />
            </>
          </AppLayout>
        </HashRouter>
      </Provider>
    </Suspense>
  )
}

export default App
