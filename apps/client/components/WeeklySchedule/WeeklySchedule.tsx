import { DaysOfWeekType, typedKeys } from 'app-helpers'
import { HStack, FormControl, Select, CheckIcon, Switch, Text, VStack, Heading, Box } from 'native-base'
import React from 'react'
import { shallow } from 'zustand/shallow'
import { Transition } from '../Transition'
import { useScheduleStore } from './scheduleStore'

const texts = {
  open: "Open",
  close: "Close",
  setStandardHours: "Set Standard string",
  configureStandardHours: "Configure the standard hours of operation for this location.",
  to: "To"
}

// Copy code
const start = new Date();
start.setHours(0, 0, 0, 0);
const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

const hourArray: string[] = [];
let current = start;
while (current < end) {
  hourArray.push(current.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
  current = new Date(current.getTime() + 60 * 60 * 1000);
}

const getHour = (time?: string) => time?.split(":")?.[0] ?? "09"
const getMinute = (time?: string) => time?.split(":")?.[1] ?? "00"

const WeeklySchedule = () => {
  const { daysOfTheWeek, setOpenHour, setCloseHour, togggleDay } = useScheduleStore(state => ({
    daysOfTheWeek: state.daysOfTheWeek,
    setOpenHour: state.setOpenHour,
    setCloseHour: state.setCloseHour,
    togggleDay: state.toggleDay,
  }),
    shallow
  )

  console.log("daysOfTheWeek", daysOfTheWeek)

  const updateOpenHour = (day: DaysOfWeekType, hour: string) => {
    console.log("updateOpenHour", day, hour)
    const currentCloseHour = daysOfTheWeek[day].openHour
    const currentCloseHourMinutes = getMinute(currentCloseHour) as string
    setOpenHour(day, `${hour}:${currentCloseHourMinutes}`)
  }

  const updateCloseHour = (day: DaysOfWeekType, hour: string) => {
    const currentCloseHour = daysOfTheWeek[day].closeHour
    const currentCloseHourMinutes = getMinute(currentCloseHour)
    setCloseHour(day, `${hour}:${currentCloseHourMinutes}`)
  }

  console.log(getHour(daysOfTheWeek["Monday"].openHour))

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
                onValueChange={() => togggleDay(day)}
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
                  onChangeHours={(value) => updateOpenHour(day, value)}
                />
                <Text alignSelf={"center"}>
                  {texts.to}
                </Text>
                <HoursInput
                  valueHours={getHour(daysOfTheWeek[day].closeHour)}
                  onChangeHours={(value) => updateCloseHour(day, value)}
                />
              </HStack>
            </Transition>
          </HStack>
        ))}
      </VStack>
    </Box>
  )
}

type HoursInputProps = {
  onChangeHours: (value: string) => void
  valueHours: string
}

const HoursInput = ({
  onChangeHours,
  valueHours,
}: HoursInputProps) => {

  return (
    <HStack space={2}>
      <Select
        w={150}
        onValueChange={onChangeHours}
        selectedValue={valueHours}
        accessibilityLabel="time"
        placeholder="09:00 AM"
        _selectedItem={{
          endIcon: <CheckIcon />
        }}
      >
        {hourArray.map((hour, index) => (
          <Select.Item key={index} label={hour} value={hour} />))
        }
      </Select>
    </HStack>
  )
}

export { WeeklySchedule }