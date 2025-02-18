import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2 as Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'

import SpecificComponent from './components/SpecificComponent'
import { useAppDispatch } from './../../store/store'
import { buildType } from './constant/buildType'
import { preFilterDataLogic } from './logic/selectPartsLogic'

function AILogicPage() {
  const dataState = useSelector((state: any) => {
    return state
  })

  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({
    type: '',
    budget: '',
    size: 'ATX',
  })

  const updateType = (event: any) => {
    setFormData((prevData) => ({
      ...prevData,
      type: event.target.value,
    }))
  }

  const budgetTextfieldChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const maxLength = 7
    const budget = event.target.value.replace(/^0+/, '')
    if (budget.length < maxLength) {
      setFormData((prevData) => ({
        ...prevData,
        budget: budget,
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        budget: budget.slice(0, maxLength),
      }))
    }
  }

  const disableButtonLogic = () => {
    if (formData.type == '') {
      return true
    }
    if (Number(formData.budget) <= 0) {
      return true
    }
    return false
  }

  const generateListLogic = () => {
    preFilterDataLogic(
      dataState.rawData.cpuList,
      dataState.rawData.motherboardList,
      dataState.rawData.gpuList,
      dataState.rawData.ramList,
      dataState.rawData.ssdList,
      dataState.rawData.caseList,
      dataState.rawData.psuList,
      dataState.rawData.coolerList,
      Number(formData.budget),
      formData.type
    )
  }

  return (
    <div className="main-container">
      <div className="main-overlay-card">
        <Grid size={12} container spacing={0} columns={{ xs: 6, md: 12 }}>
          <Grid size={12}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={formData.type}
                onChange={updateType}
              >
                {buildType.map((item) => (
                  <FormControlLabel
                    value={item.value}
                    control={<Radio />}
                    label={item.key}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <Box
              component="form"
              sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Budget"
                variant="filled"
                type="number"
                size="small"
                value={formData.budget}
                onChange={budgetTextfieldChanged}
              />
              <Button
                variant="contained"
                disabled={disableButtonLogic()}
                onClick={generateListLogic}
              >
                Contained
              </Button>
            </Box>
          </Grid>
          <Grid size={6}>
            <SpecificComponent rawData={dataState.rawData} />
          </Grid>
          <Grid size={6}></Grid>
        </Grid>
      </div>
    </div>
  )
}

export default AILogicPage
