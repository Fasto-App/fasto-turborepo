//@ts-nocheck
import React from "react"
import { ProductCard } from "../../components/Product/Product";
import { StoryProvider } from "../StoryProvider"

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Components/ProductCard",
  component: ProductCard,
  decorators: [StoryProvider],
  argTypes: {
    primary: { control: "color" },
  }
}

const Template = (args) => <ProductCard {...args} />

export const InitialState = Template.bind({});
InitialState.args = {
  product: {
    name: "Chocolate Muffin",
    price: 19999,
    imageUrl: "https://theviewfromgreatisland.com/wp-content/uploads/2021/01/chocolate-muffins-17.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
  }
}