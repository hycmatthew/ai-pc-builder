import { useState } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material'
import { useAppDispatch } from '../../../store/store'
import { aiLogicSlice } from '../store/aiLogicReducer'

type UsageComponentProps = {
  currectStep: number
  updateStep: (newStep: number) => void
}

function UsageComponent({ currectStep, updateStep }: UsageComponentProps) {
  const dispatch = useAppDispatch()
  const [buildUsage] = useState(100)

  const submitButtonOnClick = () => {
    dispatch(aiLogicSlice.actions.updateBuildUsage(buildUsage))

    if (currectStep === 1) {
      updateStep(2)
    }
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Button size="small">Gaming</Button>
        <Button size="small">Normal</Button>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={submitButtonOnClick}>Submit</Button>
      </CardActions>
    </Card>
  )
}

export default UsageComponent
