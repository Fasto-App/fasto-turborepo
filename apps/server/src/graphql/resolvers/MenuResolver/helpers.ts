
import { Types, Document } from "mongoose";
import { Menu, MenuModel, ProductModel } from "../../../models";
import { BeAnObject, IObjectWithTypegooseFunction } from "@typegoose/typegoose/lib/types";
import { db } from "../../../dbConnection";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";

export function populateProducts(menu:
  (Document<any, BeAnObject, Menu> & Menu & IObjectWithTypegooseFunction & {
    _id: Types.ObjectId;
  }) | null) {
  if (!menu) return []
  return ProductModel(db).find({ _id: { $in: menu?.items } })
}

type GetMenuArgs = {
  _id?: string,
  business: string
}

export async function getBusinessMenu({ _id, business }: GetMenuArgs) {
  let menu;

  if (_id) {
    menu = await MenuModel(db).findOne({ _id });
    if (!menu) throw ApolloError(new Error('Menu not found'), 'NotFound')

    return menu;
  }

  menu = await MenuModel(db).findOne({ business, isFavorite: true });

  if (!menu) {
    menu = await MenuModel(db).findOne({ business });
    if (!menu) throw ApolloError(new Error('Menu not found'), 'NotFound',);
  };

  return menu;
}