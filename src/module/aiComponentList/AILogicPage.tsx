import { useSelector } from 'react-redux'
import { Grid2 as Grid } from '@mui/material'

import BudgetComponent from './components/BudgetComponent'
import UsageComponent from './components/UsageComponent'
import SpecificComponent from './components/SpecificComponent'
import ResultComponent from './components/ResultComponent'
import { aiLogicSlice } from './store/aiLogicReducer'
import { useAppDispatch } from './../../store/store'

function AILogicPage() {
  const dispatch = useAppDispatch()

  const { aiLogic, rawData } = useSelector((state: any) => {
    return state
  })

  const updateStep = (newStep: number) => {
    dispatch(aiLogicSlice.actions.updateStep(newStep))
  }

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <BudgetComponent currectStep={aiLogic.step} updateStep={updateStep} />
      </Grid>
      {aiLogic.step > 0 && (
        <Grid size={12}>
          <UsageComponent currectStep={aiLogic.step} updateStep={updateStep} />
        </Grid>
      )}
      {aiLogic.step > 1 && (
        <Grid size={12}>
          <SpecificComponent
            rawData={rawData}
            currectStep={aiLogic.step}
            updateStep={updateStep}
          />
        </Grid>
      )}
      {aiLogic.step > 2 && (
        <Grid size={12}>
          <ResultComponent logicState={aiLogic} rawData={rawData} />
        </Grid>
      )}
    </Grid>
  )
}

export default AILogicPage
