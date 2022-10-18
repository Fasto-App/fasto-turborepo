import React from "react"
import { Menu } from "../../business-templates/Menu";
import { StoryProvider } from "../StoryProvider"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Business/Menu",
  component: Menu,
  decorators: [StoryProvider],
  argTypes: {
    primary: { control: "color" },
  }
}

const Template = (args) => <Menu {...args} />

export const InitialState = Template.bind({});
InitialState.args = {
  // primary: "red",
}

InitialState.story = {
  parameters: {
    nextRouter: {
      path: "/profile/[id]",
      asPath: "/profile/lifeiscontent",
      query: {
        token: "lifeiscontent",
        email: "test@gmail.com"
      },
    },
  },
};