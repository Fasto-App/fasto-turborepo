import { GraphQLUpload } from 'graphql-upload';
import {
  BusinessResolverMutation,
  BusinessResolverQuery,
  BusinessResolver
} from './BusinessResolver';
import {
  UserResolverMutation,
  UserResolverQuery
} from './UserResolver';
import {
  ProductResolverMutation,
  ProductResolverQuery,
  ProductResolver
} from './ProductResolver';
import {
  CategoryResolverMutation,
  CategoryResolverQuery,
} from './CategoryResolver';
import {
  MenuResolver,
  MenuResolverMutation,
  MenuResolverQuery
} from './MenuResolver';
import {
  OrderDetailsResolverMutation,
  OrderDetailsResolverQuery,
  OrderDetailsResolver
} from './OrderDetailsResolver';
import {
  AddressResolverMutation,
  AddressResolverQuery,
  AddressResolver
} from './AddressResolver';
import {
  SpaceResolverMutation,
  SpaceResolverQuery
} from './SpaceResolver';
import {
  TableResolverMutation,
  TableResolver
} from './TableResolver';
import { TabResolver, TabResolverMutation, TabResolverQuery } from './TabResolver';

export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    ...AddressResolverQuery,
    ...BusinessResolverQuery,
    ...CategoryResolverQuery,
    ...MenuResolverQuery,
    ...OrderDetailsResolverQuery,
    ...ProductResolverQuery,
    ...SpaceResolverQuery,
    ...TabResolverQuery,
    ...UserResolverQuery,
  },
  Mutation: {
    ...AddressResolverMutation,
    ...BusinessResolverMutation,
    ...CategoryResolverMutation,
    ...MenuResolverMutation,
    ...OrderDetailsResolverMutation,
    ...ProductResolverMutation,
    ...SpaceResolverMutation,
    ...TableResolverMutation,
    ...TabResolverMutation,
    ...UserResolverMutation,
  },
  Business: {
    address: AddressResolver.getAddressFromBusiness,
    categories: BusinessResolver.getCategoriesByBusiness,
    products: BusinessResolver.getProductsByBusiness,
  },
  Product: {
    category: ProductResolver.getCategoryByProduct,
  },
  Category: {
    products: ProductResolver.getProductsByCategory,
  },
  Space: {
    tables: TableResolver.getTablesFromSpace,
  },
  Table: {
    tab: TableResolver.getOpenTabByTable,
  },
  Tab: {
    orders: OrderDetailsResolver.getOrdersByTabID,
    table: TabResolver.getTableByTabID,
    // users: TabResolver.getUsersByTabID,
  },
  // Users: {
  //   orders: getAllOpenOrdersByTabID,
  // }
  Menu: {
    // sections: MenuResolver.getSectionsByMenu,
  },
  Section: {
    products: MenuResolver.getProductsBySection,
    category: MenuResolver.getCategoryBySection,
  }
};
