import { Suspense } from 'react'
import { Provider } from 'react-redux'
import ReactGA from 'react-ga4'
import { BrowserRouter } from 'react-router-dom'

import AppRoutes from './Route'

import {
  fetchCPUData,
  fetchGPUData,
  fetchMotherboardData,
  fetchRAMData,
  fetchPSUData,
  fetchCaseData,
  fetchCoolerData,
  fetchSSDData,
} from './store/rawDataReducer'
import store from './store/store'
import config from './config/config'
import AppLayout from './module/common/appLayout/AppLayout'

ReactGA.initialize(config.GA_TRACKING_ID)

function App() {
  store.dispatch(fetchCPUData())
  store.dispatch(fetchGPUData())
  store.dispatch(fetchMotherboardData())
  store.dispatch(fetchRAMData())
  store.dispatch(fetchPSUData())
  store.dispatch(fetchCaseData())
  store.dispatch(fetchCoolerData())
  store.dispatch(fetchSSDData())

  return (
    <Suspense fallback="loading">
      <Provider store={store}>
        <BrowserRouter>
          <AppLayout>
            <>
              <AppRoutes />
            </>
          </AppLayout>
        </BrowserRouter>
      </Provider>
    </Suspense>
  )
}

export default App
