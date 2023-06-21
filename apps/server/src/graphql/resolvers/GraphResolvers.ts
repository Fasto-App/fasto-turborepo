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
  TableResolver,
  TableResolverQuery
} from './TableResolver';
import { TabResolver, TabResolverMutation, TabResolverQuery } from './TabResolver';
import { CheckoutResolverMutation, CheckoutResolverQuery, CheckoutResolver } from './CheckoutResolver';
import { RequestResolver, RequestResolverMutation, RequestResolverQuery, RequestSubscription } from './RequestResolver';
import { CartItemResolver, CartItemResolverMutation, CartItemResolverQuery } from './CartItemResolver';

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
    ...TableResolverQuery,
    ...CartItemResolverQuery
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
    ...CartItemResolverMutation
  },
  Subscription: {
    ...RequestSubscription,
  },
  Business: {
    address: AddressResolver.getAddressFromBusiness,
    categories: BusinessResolver.getCategoriesByBusiness,
    products: BusinessResolver.getProductsByBusiness,
  },
  Checkout: {
    payments: CheckoutResolver.payments,
    orders: CheckoutResolver.orders,
  },
  Product: {
    category: ProductResolver.getCategoryByProduct,
  },
  Category: {
    products: ProductResolver.getProductsByCategory,
  },
  Space: {
    tables: TableResolver.resolveTablesFromSpace,
  },
  // TODO
  // this is bad, a resolver for a resolver?
  Table: {
    tab: TableResolver.getTabByTable,
  },
  // TODO
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
  CartItem: {
    product: CartItemResolver.getProductByCartItem,
    user: CartItemResolver.getUserByCartItem,
  },
  Request: {
    admin: RequestResolver.getAdminFromRequest,
    requestor: RequestResolver.getRequestorFromRequest,
  },
};
