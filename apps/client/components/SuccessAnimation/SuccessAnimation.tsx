import React from "react";
import Lottie from "lottie-react";
import success from "./success_animation.json";
import hourglass from "./hourglass_animation.json";

export const SuccessAnimation = () => {
  return (
    <Lottie
      animationData={success}
      loop={false}
    />
  )
}

export const HourGlassAnimation = () => {
  return (
    <Lottie
      animationData={hourglass}
      loop={true}
    />
  )
}