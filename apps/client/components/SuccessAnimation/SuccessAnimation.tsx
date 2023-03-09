import React from "react";
import Lottie from "lottie-react";
import success from "./success_animation.json";

export const SuccessAnimation = () => {
  return (
    <Lottie
      animationData={success}
      loop={false}
    />
  )
}