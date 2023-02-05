//@ts-nocheck
import { Text } from "native-base";
import React from "react"
import { BusinessLayout } from "../../business-templates/Layout/BusinessLayout";
import { StoryProvider } from "../StoryProvider"

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Business/Layout",
  component: BusinessLayout,
  decorators: [StoryProvider],
  argTypes: {
    primary: { control: "color" },
  }
}

const Template = (args) => <BusinessLayout {...args} ><Text>Test</Text></BusinessLayout>

export const InitialState = Template.bind({});
InitialState.args = {
  product: {
    name: "Chocolate Muffin",
    price: 19999,
    imageUrl: "string",
    description: "Bengaluru (also called Bangalore) is the center of India's high-tech industry. The city is also known for its. lorem ipsum simate",
  }
}