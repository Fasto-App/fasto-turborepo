import { GraphQLUpload } from 'graphql-upload';
import {
  BusinessResolverMutation,
  BusinessResolverQuery,
  BusinessResolver
} from './BusinessResolver';
import {
  UserResolver,
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
import { CheckoutResolverMutation, CheckoutResolverQuery, CheckoutResolver } from './CheckoutResolver';
import { RequestResolverMutation, RequestResolverQuery } from './RequestResolver';

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
    ...CheckoutResolverQuery,
    ...RequestResolverQuery,
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
    ...CheckoutResolverMutation,
    ...RequestResolverMutation,
  },
  Business: {
    address: AddressResolver.getAddressFromBusiness,
    categories: BusinessResolver.getCategoriesByBusiness,
    products: BusinessResolver.getProductsByBusiness,
  },
  Checkout: {
    payments: CheckoutResolver.payments,
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
  // todo
  // this is bad, a resolver for a resolver?
  Table: {
    tab: TableResolver.getOpenTabByTable,
  },
  // todo
  // This can be a problem, if we have a lot of tabs, we will have to make a lot of queries
  Tab: {
    orders: OrderDetailsResolver.getOrdersByTabID,
    table: TabResolver.getTableByTabID,
    users: TabResolver.getUsersByTabID,
  },
  User: {
    businesses: UserResolver.getBusinessByUser,
    // orders: getAllOpenOrdersByTabID,
  },
  Menu: {
    // sections: MenuResolver.getSectionsByMenu,
  },
  Section: {
    products: MenuResolver.getProductsBySection,
    category: MenuResolver.getCategoryBySection,
  },
  OrderDetail: {
    // order: OrderDetailsResolver.getOrderDetailsByOrderID,
    // tab: OrderDetailsResolver.getTabByOrderDetails,
    product: ProductResolver.getProductByOrderDetails,
  },
};
