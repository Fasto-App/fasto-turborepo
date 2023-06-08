import { DaysOfWeekType, typedKeys } from 'app-helpers'
import { HStack, FormControl, Select, CheckIcon, Switch, Text, VStack, Heading, Box } from 'native-base'
import React from 'react'
import { shallow } from 'zustand/shallow'
import { Transition } from '../Transition'
import { useScheduleStore } from './scheduleStore'
import { useTranslation } from 'react-i18next'

const start = new Date();
start.setHours(0, 0, 0, 0);
const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

const hourArray: string[] = [];
let current = start;
while (current < end) {
  hourArray.push(current.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
  current = new Date(current.getTime() + 60 * 60 * 1000);
}

const WeeklySchedule = () => {
  const { daysOfTheWeek, setOpenHour, setCloseHour, togggleDay } = useScheduleStore(state => ({
    daysOfTheWeek: state.daysOfTheWeek,
    setOpenHour: state.setOpenHour,
    setCloseHour: state.setCloseHour,
    togggleDay: state.toggleDay,
  }),
    shallow
  )

  const { t } = useTranslation("businessSettings")

  return (
    <Box py={"4"} px={"2"}>
      <Heading size={"md"}>
        {t("setStandardHours")}
      </Heading>
      <Text paddingY={"4"} color={"gray.500"}>
        {t("configureStandardHours")}
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
              <FormControl.Label isRequired={daysOfTheWeek[day]?.isOpen} flex={1}>
                {day}
              </FormControl.Label>
            </HStack>
            <HStack flex={1} space={"4"} alignItems={"center"}>
              <Switch
                size="lg"
                colorScheme={"green"}
                isChecked={daysOfTheWeek[day]?.isOpen}
                onValueChange={() => togggleDay(day)}
              />
              <Text>
                {daysOfTheWeek[day]?.isOpen ? t("open") : t("close")}
              </Text>
            </HStack>
            <Transition isVisible={!!daysOfTheWeek[day]?.isOpen}>
              <HStack
                alignItems={"center"}
                space={"2"}
                flex={1}
                justifyContent={"flex-end"}>
                <HoursInput
                  valueHours={daysOfTheWeek[day]?.hours?.open}
                  onChangeHours={(value) => setOpenHour(day, value)}
                  placeholder={"Open"}
                />
                <Text alignSelf={"center"}>
                  {t("to")}
                </Text>
                <HoursInput
                  valueHours={daysOfTheWeek[day]?.hours?.close}
                  onChangeHours={(value) => setCloseHour(day, value)}
                  placeholder={"Close"}
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
  valueHours?: string
  placeholder?: string
}

const HoursInput = ({
  onChangeHours,
  valueHours,
  placeholder
}: HoursInputProps) => {

  return (
    <HStack space={2}>
      <Select
        w={150}
        onValueChange={onChangeHours}
        selectedValue={valueHours}
        accessibilityLabel="time"
        placeholder={placeholder}
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