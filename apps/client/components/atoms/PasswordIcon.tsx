import { Pressable } from 'native-base';
import React from 'react'
import { BiHide, BiShow } from 'react-icons/bi';

type HideAndShowIconProps = {
  isHidden: boolean,
  color: string,
  size: string | number
}

const HideAndShowIcon = ({ isHidden, color, size }: HideAndShowIconProps) => {
  return (isHidden ?
    <BiShow color={color} size={size} /> :
    <BiHide color={color} size={size} />)
}

type PasswordIconProps = {
  setShowPass: (showPass: boolean) => void,
  showPassword: boolean
}

export const PasswordIcon = ({ setShowPass, showPassword }: PasswordIconProps) => {
  return (<Pressable onPress={() => setShowPass(!showPassword)}
    style={{ right: 8, top: 2 }}
  >
    <HideAndShowIcon isHidden={showPassword} color={"gray"} size={"1.5em"} />
  </Pressable>)
}
