const recommendPowerLogic = (currentPower: number) => {
  const powerSupplyList = [450, 550, 650, 750, 850, 1000, 1200, 1600]
  const powerNum = currentPower * 1.2
  let powerNeeded = 1200

  for (const item of powerSupplyList) {
    if (item > powerNum) {
      powerNeeded = item
      break
    }
  }
  return powerNeeded
}

export default recommendPowerLogic
