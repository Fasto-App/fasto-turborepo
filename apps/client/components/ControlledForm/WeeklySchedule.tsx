import { Hours, Minutes, hours, minutes, Time, DaysOfWeekType } from 'app-helpers'
import { HStack, FormControl, Select, CheckIcon, Switch, Text, VStack, Heading, Box } from 'native-base'
import React, { useState } from 'react'
import { shallow } from 'zustand/shallow'
import { typedKeys } from '../../authUtilities/utils'
import { Transition } from '../Transition'
import { useScheduleStore } from './scheduleStore'

const texts = {
  open: "Open",
  close: "Close",
  setStandardHours: "Set Standard Hours",
  configureStandardHours: "Configure the standard hours of operation for this location.",
  to: "To"
}

const getHour = (time?: Time) => time?.split(":")?.[0] ?? "09"
const getMinute = (time?: Time) => time?.split(":")?.[1] ?? "00"

const WeeklySchedule = () => {
  const { daysOfTheWeek, setOpenHour, setCloseHour, togggleDay } = useScheduleStore(state => ({
    daysOfTheWeek: state.daysOfTheWeek,
    setOpenHour: state.setOpenHour,
    setCloseHour: state.setCloseHour,
    togggleDay: state.toggleDay,
  }),
    shallow
  )

  const updateOpenHour = (day: DaysOfWeekType, hour: Hours) => {
    const currentCloseHour = daysOfTheWeek[day].openHour
    const currentCloseHourMinutes = getMinute(currentCloseHour) as Minutes
    setOpenHour(day, `${hour}:${currentCloseHourMinutes}`)
  }

  const updateOpenMinute = (day: DaysOfWeekType, minute: Minutes) => {
    const currentCloseHour = daysOfTheWeek[day].openHour
    const currentCloseHourHours = getHour(currentCloseHour) as Hours
    setOpenHour(day, `${currentCloseHourHours}:${minute}`)
  }

  const updateCloseHour = (day: DaysOfWeekType, hour: Hours) => {
    const currentCloseHour = daysOfTheWeek[day].closeHour
    const currentCloseHourMinutes = getMinute(currentCloseHour) as Minutes
    setCloseHour(day, `${hour}:${currentCloseHourMinutes}`)
  }

  const updateCloseMinute = (day: DaysOfWeekType, minute: Minutes) => {
    const currentCloseHour = daysOfTheWeek[day].closeHour
    const currentCloseHourHours = getHour(currentCloseHour) as Hours
    setCloseHour(day, `${currentCloseHourHours}:${minute}`)
  }

  return (
    <Box py={"4"} px={"2"}>
      <Heading size={"md"}>
        {texts.setStandardHours}
      </Heading>
      <Text paddingY={"4"} color={"gray.500"}>
        {texts.configureStandardHours}
      </Text>
      <VStack space={2} p={"2"}>
        {typedKeys(daysOfTheWeek).map((day, index) => (
          <HStack
            key={index}
            alignItems={"center"}
            justifyContent={"flex-end"}
            space={"2"}
            flex={1}>
            <HStack
              space={"4"}
              flex={1}
            >
              <FormControl.Label isRequired={daysOfTheWeek[day].isOpen} flex={1}>
                {day}
              </FormControl.Label>
            </HStack>
            <HStack flex={1} space={"4"} alignItems={"center"}>
              <Switch
                size="lg"
                isChecked={daysOfTheWeek[day].isOpen}
                onValueChange={(value) => togggleDay(day)}
              />
              <Text>
                {daysOfTheWeek[day].isOpen ? texts.open : texts.close}
              </Text>
            </HStack>
            <Transition isVisible={daysOfTheWeek[day].isOpen}>
              <HStack
                alignItems={"center"}
                space={"2"}
                flex={1}
                justifyContent={"flex-end"}>
                <HoursInput
                  valueHours={getHour(daysOfTheWeek[day].openHour)}
                  valueMinutes={getMinute(daysOfTheWeek[day].openHour)}
                  onChangeHours={(value) => updateOpenHour(day, value)}
                  onChangeMinutes={(value) => updateOpenMinute(day, value)}
                />
                <Text alignSelf={"center"}>
                  {texts.to}
                </Text>
                <HoursInput
                  valueHours={getHour(daysOfTheWeek[day].closeHour)}
                  valueMinutes={getMinute(daysOfTheWeek[day].closeHour)}
                  onChangeHours={(value) => updateCloseHour(day, value)}
                  onChangeMinutes={(value) => updateCloseMinute(day, value)}
                />
              </HStack>
            </Transition>
          </HStack>
        ))}
      </VStack>
    </Box>
  )
}

const HoursInput = ({
  onChangeHours,
  valueHours,
  onChangeMinutes,
  valueMinutes,
}) => {
  return (
    <HStack space={"2"}>
      <Select
        w={100}
        onValueChange={onChangeHours}
        selectedValue={valueHours}
        accessibilityLabel="hour"
        placeholder="Hour"
        _selectedItem={{
          endIcon: <CheckIcon />
        }}
      >
        {hours.map((hour, index) => (
          <Select.Item key={index} label={hour + `h`} value={hour} />))
        }
      </Select>
      <Select
        w={100}
        onValueChange={onChangeMinutes}
        selectedValue={valueMinutes}
        accessibilityLabel="minutes"
        placeholder="Min"
        _selectedItem={{
          endIcon: <CheckIcon size="5" />
        }}
      >
        {minutes.map((minute, index) => (
          <Select.Item key={index} label={minute} value={minute} />))
        }
      </Select>
    </HStack>
  )
}

export { WeeklySchedule }