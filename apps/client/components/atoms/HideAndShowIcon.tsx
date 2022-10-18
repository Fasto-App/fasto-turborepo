import React from 'react'
import { BiHide, BiShow } from 'react-icons/bi';


const HideAndShowIcon = ({ isHidden, color, size }:
  {
    isHidden: boolean,
    color: string,
    size: string | number
  }) => {
  return isHidden ? <BiShow color={color} size={size} /> : <BiHide color={color} size={size} />
}


export { HideAndShowIcon }