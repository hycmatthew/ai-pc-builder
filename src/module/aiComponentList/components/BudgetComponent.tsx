import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material'
import { useAppDispatch } from '../../../store/store'
import { aiLogicSlice } from '../store/aiLogicReducer'
import { addCurrencySign } from '../../../utils/NumberHelper'
import buildConfig from '../data/buildConfig'
import { convertCurrency } from '../logic/pricingLogic'

type BudgetComponentProps = {
  currectStep: number
  updateStep: (newStep: number) => void
}

function BudgetComponent({ currectStep, updateStep }: BudgetComponentProps) {
  const dispatch = useAppDispatch()
  const [budget, setBudget] = useState(0)

  const submitButtonOnClick = () => {
    if (convertCurrency(budget) > buildConfig.minPrice) {
      dispatch(aiLogicSlice.actions.updateBudget(budget))
      if (currectStep === 0) {
        updateStep(1)
      }
    }
  }

  const clearButtonOnClick = () => {
    dispatch(aiLogicSlice.actions.clearAllLogic({}))
  }

  const budgetTextfieldChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBudget(Number(event.target.value))
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <TextField
          label="Budget"
          variant="outlined"
          type="number"
          onChange={budgetTextfieldChanged}
          InputProps={{
            startAdornment: <InputAdornment position="start">{addCurrencySign('')}</InputAdornment>,
          }}
        />
      </CardContent>
      <CardActions>
        <Button size="small" onClick={submitButtonOnClick}>
          Confirm
        </Button>
        <Button size="small" onClick={clearButtonOnClick}>
          Clear
        </Button>
      </CardActions>
    </Card>
  )
}

export default BudgetComponent
