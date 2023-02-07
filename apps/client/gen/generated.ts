import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export type AccountCreationResponse = {
  __typename?: 'AccountCreationResponse';
  ok: Scalars['Boolean'];
  url?: Maybe<Scalars['String']>;
};

export type AddEmployeeInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  privileges: UserPrivileges;
};

export type Address = {
  __typename?: 'Address';
  _id: Scalars['ID'];
  city: Scalars['String'];
  complement?: Maybe<Scalars['String']>;
  country: Scalars['String'];
  postalCode: Scalars['String'];
  stateOrProvince: Scalars['String'];
  streetAddress: Scalars['String'];
};

export type AddressInput = {
  city: Scalars['String'];
  complement?: InputMaybe<Scalars['String']>;
  country: Scalars['String'];
  postalCode: Scalars['String'];
  stateOrProvince: Scalars['String'];
  streetAddress: Scalars['String'];
};

export type Business = {
  __typename?: 'Business';
  _id: Scalars['ID'];
  address?: Maybe<Address>;
  categories: Array<Category>;
  cuisine?: Maybe<Array<Scalars['String']>>;
  email: Scalars['String'];
  employees: Array<Maybe<Scalars['String']>>;
  hoursOfOperation?: Maybe<HoursOfOperation>;
  menus?: Maybe<Array<Menu>>;
  name: Scalars['String'];
  price_range?: Maybe<Scalars['String']>;
  products: Array<Product>;
  user?: Maybe<Scalars['ID']>;
  website: Scalars['String'];
};

export type BusinessInput = {
  address?: InputMaybe<AddressInput>;
  name: Scalars['String'];
  phone: Scalars['String'];
  website?: InputMaybe<Scalars['String']>;
};

export type BusinessPrivileges = {
  __typename?: 'BusinessPrivileges';
  business: Scalars['String'];
  privileges: Array<Maybe<UserPrivileges>>;
};

export type Category = {
  __typename?: 'Category';
  _id: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  parentCategory?: Maybe<Category>;
  products?: Maybe<Array<Maybe<Product>>>;
  subCategories?: Maybe<Array<Maybe<Category>>>;
};

export type CategoryInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  parentCategory?: InputMaybe<Scalars['ID']>;
  subCategories?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type CreateBusinessPayload = {
  __typename?: 'CreateBusinessPayload';
  business: Business;
  token?: Maybe<Scalars['String']>;
};

export type CreateMenuInput = {
  name: Scalars['String'];
};

export type CreateOrderInput = {
  message?: InputMaybe<Scalars['String']>;
  product: Scalars['ID'];
  quantity: Scalars['Int'];
  tab: Scalars['ID'];
  user?: InputMaybe<Scalars['ID']>;
};

export type CreateProductInput = {
  addons?: InputMaybe<Array<InputMaybe<CreateProductInput>>>;
  category: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  file?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  price: Scalars['Int'];
};

export type CreateSpaceInput = {
  name: Scalars['String'];
};

export type CreateTabInput = {
  admin?: InputMaybe<Scalars['ID']>;
  table: Scalars['ID'];
  totalUsers: Scalars['Int'];
};

export type CreateTableInput = {
  space: Scalars['ID'];
};

export enum DaysOfWeek {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}

export type DeleteBusinessPayload = {
  __typename?: 'DeleteBusinessPayload';
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type DeleteSpaceInput = {
  space: Scalars['ID'];
};

export type DeleteTableInput = {
  table: Scalars['ID'];
};

export type Geo = {
  __typename?: 'Geo';
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};

export type GetById = {
  _id: Scalars['ID'];
};

export type GetMenuById = {
  id: Scalars['ID'];
};

export type HoursOfOperation = {
  __typename?: 'HoursOfOperation';
  Friday?: Maybe<WorkingHours>;
  Monday?: Maybe<WorkingHours>;
  Saturday?: Maybe<WorkingHours>;
  Sunday?: Maybe<WorkingHours>;
  Thursday?: Maybe<WorkingHours>;
  Tuesday?: Maybe<WorkingHours>;
  Wednesday?: Maybe<WorkingHours>;
};

export type HoursOfOperationInput = {
  Friday?: InputMaybe<WorkingHoursInput>;
  Monday?: InputMaybe<WorkingHoursInput>;
  Saturday?: InputMaybe<WorkingHoursInput>;
  Sunday?: InputMaybe<WorkingHoursInput>;
  Thursday?: InputMaybe<WorkingHoursInput>;
  Tuesday?: InputMaybe<WorkingHoursInput>;
  Wednesday?: InputMaybe<WorkingHoursInput>;
};

export type LinkCategoryToProductInput = {
  category: Scalars['ID'];
  products: Array<InputMaybe<Scalars['String']>>;
};

export type Menu = {
  __typename?: 'Menu';
  _id: Scalars['ID'];
  name: Scalars['String'];
  sections?: Maybe<Array<Section>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  addEmployeeToBusiness: User;
  createAddress?: Maybe<Address>;
  createBusiness?: Maybe<CreateBusinessPayload>;
  createCategory?: Maybe<Category>;
  createMenu: Menu;
  createMultipleOrderDetails?: Maybe<Array<OrderDetail>>;
  createOrderDetail?: Maybe<OrderDetail>;
  createProduct: Product;
  createSpace: Space;
  createTab: Tab;
  createTable: Table;
  createUser: User;
  deleteBusiness?: Maybe<DeleteBusinessPayload>;
  deleteCategory?: Maybe<RequestResponseOk>;
  deleteMenu: Menu;
  deleteOrderDetail?: Maybe<OrderDetail>;
  deleteProduct?: Maybe<RequestResponseOk>;
  deleteSpace: Space;
  deleteTab?: Maybe<Tab>;
  deleteTable: RequestResponseOk;
  deleteUser: RequestResponseOk;
  linkCategoryToProducts?: Maybe<Category>;
  postUserLogin: User;
  recoverPassword?: Maybe<RequestResponseOk>;
  requestUserAccountCreation: AccountCreationResponse;
  updateAddress?: Maybe<Address>;
  updateBusiness?: Maybe<Business>;
  updateBusinessLocation?: Maybe<Business>;
  updateBusinessToken?: Maybe<Scalars['String']>;
  updateCategory?: Maybe<Category>;
  updateMenu?: Maybe<Menu>;
  updateMenuInfo: Menu;
  updateOrderDetail?: Maybe<OrderDetail>;
  updateProductByID: Product;
  updateSpace: Space;
  updateTab: Tab;
  updateUserInformation: User;
  uploadFile: Scalars['String'];
};


export type MutationAddEmployeeToBusinessArgs = {
  input: AddEmployeeInput;
};


export type MutationCreateAddressArgs = {
  input: AddressInput;
};


export type MutationCreateBusinessArgs = {
  input?: InputMaybe<BusinessInput>;
};


export type MutationCreateCategoryArgs = {
  input?: InputMaybe<CategoryInput>;
};


export type MutationCreateMenuArgs = {
  input: CreateMenuInput;
};


export type MutationCreateMultipleOrderDetailsArgs = {
  input: Array<CreateOrderInput>;
};


export type MutationCreateOrderDetailArgs = {
  input: CreateOrderInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateSpaceArgs = {
  input?: InputMaybe<CreateSpaceInput>;
};


export type MutationCreateTabArgs = {
  input: CreateTabInput;
};


export type MutationCreateTableArgs = {
  input?: InputMaybe<CreateTableInput>;
};


export type MutationCreateUserArgs = {
  input?: InputMaybe<UserInput>;
};


export type MutationDeleteBusinessArgs = {
  businessID: Scalars['ID'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteMenuArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteOrderDetailArgs = {
  input: GetById;
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSpaceArgs = {
  input: DeleteSpaceInput;
};


export type MutationDeleteTabArgs = {
  input: GetById;
};


export type MutationDeleteTableArgs = {
  input?: InputMaybe<DeleteTableInput>;
};


export type MutationLinkCategoryToProductsArgs = {
  input: LinkCategoryToProductInput;
};


export type MutationPostUserLoginArgs = {
  input: LoginInput;
};


export type MutationRecoverPasswordArgs = {
  input: Scalars['String'];
};


export type MutationRequestUserAccountCreationArgs = {
  input?: InputMaybe<RequestUserAccountInput>;
};


export type MutationUpdateAddressArgs = {
  input?: InputMaybe<UpdateAddressInput>;
};


export type MutationUpdateBusinessArgs = {
  input?: InputMaybe<UpdateBusinessInput>;
};


export type MutationUpdateBusinessLocationArgs = {
  input?: InputMaybe<AddressInput>;
};


export type MutationUpdateBusinessTokenArgs = {
  input?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateCategoryArgs = {
  input?: InputMaybe<UpdateCategoryInput>;
};


export type MutationUpdateMenuArgs = {
  input?: InputMaybe<UpdateMenuInput>;
};


export type MutationUpdateMenuInfoArgs = {
  input?: InputMaybe<UpdateMenuInfoInput>;
};


export type MutationUpdateOrderDetailArgs = {
  input: UpdateOrderDetailInput;
};


export type MutationUpdateProductByIdArgs = {
  input: UpdateProductInput;
};


export type MutationUpdateSpaceArgs = {
  input: UpdateSpaceInput;
};


export type MutationUpdateTabArgs = {
  input: UpdateTabInput;
};


export type MutationUpdateUserInformationArgs = {
  input: UpdateUserInput;
};


export type MutationUploadFileArgs = {
  file: Scalars['Upload'];
};

export type OrderDetail = {
  __typename?: 'OrderDetail';
  _id: Scalars['ID'];
  created_date: Scalars['String'];
  message?: Maybe<Scalars['String']>;
  product: Product;
  quantity: Scalars['Int'];
  status: OrderStatus;
  subTotal: Scalars['Int'];
  user?: Maybe<Scalars['ID']>;
};

export type OrderDetailInput = {
  message?: InputMaybe<Scalars['String']>;
  product: Scalars['ID'];
  quantity?: InputMaybe<Scalars['Int']>;
};

export enum OrderStatus {
  Closed = 'CLOSED',
  Delivered = 'DELIVERED',
  Open = 'OPEN',
  Pendent = 'PENDENT'
}

export type Product = {
  __typename?: 'Product';
  _id: Scalars['ID'];
  addonsID?: Maybe<Array<Maybe<Scalars['ID']>>>;
  category?: Maybe<Category>;
  description?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  price: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  getAddress: Address;
  getAllBusiness?: Maybe<Array<Maybe<Business>>>;
  getAllBusinessByUser?: Maybe<Array<Maybe<Business>>>;
  getAllCategoriesByBusiness: Array<Category>;
  getAllMenus: Array<Menu>;
  getAllMenusByBusinessID: Array<Maybe<Menu>>;
  getAllOpenTabsByBusinessID?: Maybe<Array<Maybe<Tab>>>;
  getAllOrderDetailsByOrderID?: Maybe<Array<Maybe<OrderDetail>>>;
  getAllProductsByBusinessID: Array<Maybe<Product>>;
  getAllTabsByBusinessID?: Maybe<Array<Maybe<Tab>>>;
  getAllUsers: Array<User>;
  getBusiness: Business;
  getBusinessLocation?: Maybe<Address>;
  getCategoryByID?: Maybe<Category>;
  getMenuByID: Menu;
  getOrderDetailByID?: Maybe<OrderDetail>;
  getProductByID?: Maybe<Product>;
  getSpacesFromBusiness?: Maybe<Array<Space>>;
  getTabByID?: Maybe<Tab>;
  /** Returns a user based on the Bearer token */
  getToken?: Maybe<User>;
  getUserByID?: Maybe<User>;
};


export type QueryGetAddressArgs = {
  id: Scalars['ID'];
};


export type QueryGetAllOrderDetailsByOrderIdArgs = {
  orderID: Scalars['ID'];
};


export type QueryGetCategoryByIdArgs = {
  id: Scalars['ID'];
};


export type QueryGetMenuByIdArgs = {
  input?: InputMaybe<GetMenuById>;
};


export type QueryGetOrderDetailByIdArgs = {
  orderDetailID: Scalars['ID'];
};


export type QueryGetProductByIdArgs = {
  productID: Scalars['ID'];
};


export type QueryGetTabByIdArgs = {
  input: GetById;
};


export type QueryGetUserByIdArgs = {
  userID?: InputMaybe<Scalars['ID']>;
};

export type RequestResponseOk = {
  __typename?: 'RequestResponseOK';
  ok?: Maybe<Scalars['Boolean']>;
};

export type RequestUserAccountInput = {
  email: Scalars['String'];
};

export type Section = {
  __typename?: 'Section';
  category: Category;
  products?: Maybe<Array<Product>>;
};

export type SectionInput = {
  name: Scalars['String'];
  products: Array<Scalars['String']>;
};

export type Space = {
  __typename?: 'Space';
  _id: Scalars['ID'];
  business: Scalars['ID'];
  name: Scalars['String'];
  tables?: Maybe<Array<Table>>;
};

export type Tab = {
  __typename?: 'Tab';
  _id: Scalars['ID'];
  admin: Scalars['ID'];
  completed_at?: Maybe<Scalars['String']>;
  created_date: Scalars['String'];
  orders: Array<Maybe<OrderDetail>>;
  status: TabStatus;
  table: Table;
  users?: Maybe<Array<User>>;
};

export enum TabStatus {
  Closed = 'CLOSED',
  Open = 'OPEN'
}

export type Table = {
  __typename?: 'Table';
  _id: Scalars['ID'];
  space: Scalars['ID'];
  status: TableStatus;
  tab?: Maybe<Tab>;
  tableNumber: Scalars['String'];
};

export enum TableStatus {
  Available = 'AVAILABLE',
  Closed = 'CLOSED',
  Occupied = 'OCCUPIED',
  Reserved = 'RESERVED'
}

export type UpdateAddressInput = {
  _id: Scalars['ID'];
  city: Scalars['String'];
  complement?: InputMaybe<Scalars['String']>;
  country: Scalars['String'];
  postalCode: Scalars['String'];
  stateOrProvince: Scalars['String'];
  streetAddress: Scalars['String'];
};

export type UpdateBusinessInput = {
  _id: Scalars['ID'];
  business: BusinessInput;
};

export type UpdateCategoryInput = {
  _id: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  parentCategory?: InputMaybe<Scalars['ID']>;
  subCategories?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UpdateMenuInfoInput = {
  _id: Scalars['ID'];
  name: Scalars['String'];
};

export type UpdateMenuInput = {
  _id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  sections?: InputMaybe<Array<InputMaybe<UpdateSectionInput>>>;
};

export type UpdateOrderDetailInput = {
  _id: Scalars['ID'];
  message?: InputMaybe<Scalars['String']>;
  quantity?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<OrderStatus>;
};

export type UpdateProductInput = {
  _id: Scalars['ID'];
  category: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  file?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  price: Scalars['Int'];
};

export type UpdateSectionInput = {
  category: Scalars['ID'];
  products?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type UpdateSpaceInput = {
  capacity?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  isAvailable?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateTabInput = {
  _id: Scalars['ID'];
  status: TabStatus;
};

export type UpdateUserInput = {
  _id?: InputMaybe<Scalars['ID']>;
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  passwordConfirmation?: InputMaybe<Scalars['String']>;
  privileges?: InputMaybe<UserPrivileges>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  business: Array<Maybe<BusinessPrivileges>>;
  email: Scalars['String'];
  name: Scalars['String'];
  token: Scalars['String'];
};

export type UserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  privileges?: InputMaybe<UserPrivileges>;
};

export enum UserPrivileges {
  Admin = 'ADMIN',
  Bar = 'BAR',
  Bartender = 'BARTENDER',
  Cook = 'COOK',
  Manager = 'MANAGER',
  User = 'USER',
  Waiter = 'WAITER'
}

export type WorkingHours = {
  __typename?: 'WorkingHours';
  close: Scalars['String'];
  open: Scalars['String'];
};

export type WorkingHoursInput = {
  close: Scalars['String'];
  open: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type GetBusinessLocationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBusinessLocationQuery = { __typename?: 'Query', getBusinessLocation?: { __typename?: 'Address', streetAddress: string, stateOrProvince: string, postalCode: string, country: string, complement?: string | null, city: string, _id: string } | null };

export type UpdateBusinessLocationMutationVariables = Exact<{
  input?: InputMaybe<AddressInput>;
}>;


export type UpdateBusinessLocationMutation = { __typename?: 'Mutation', updateBusinessLocation?: { __typename?: 'Business', address?: { __typename?: 'Address', streetAddress: string, stateOrProvince: string, postalCode: string, country: string, complement?: string | null, city: string, _id: string } | null } | null };

export type CreateCategoryMutationVariables = Exact<{
  input: CategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory?: { __typename?: 'Category', _id: string, name: string, description?: string | null } | null };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory?: { __typename?: 'RequestResponseOK', ok?: boolean | null } | null };

export type GetAllCategoriesByBusinessQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCategoriesByBusinessQuery = { __typename?: 'Query', getAllCategoriesByBusiness: Array<{ __typename?: 'Category', _id: string, name: string, description?: string | null }> };

export type UpdateCategoryMutationVariables = Exact<{
  input?: InputMaybe<UpdateCategoryInput>;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory?: { __typename?: 'Category', _id: string, name: string, description?: string | null } | null };

export type CreateMenuMutationVariables = Exact<{
  input: CreateMenuInput;
}>;


export type CreateMenuMutation = { __typename?: 'Mutation', createMenu: { __typename?: 'Menu', _id: string, name: string, sections?: Array<{ __typename?: 'Section', category: { __typename?: 'Category', name: string }, products?: Array<{ __typename?: 'Product', _id: string }> | null }> | null } };

export type DeleteMenuMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteMenuMutation = { __typename?: 'Mutation', deleteMenu: { __typename?: 'Menu', _id: string, name: string } };

export type GetMenuByIdQueryVariables = Exact<{
  input?: InputMaybe<GetMenuById>;
}>;


export type GetMenuByIdQuery = { __typename?: 'Query', getMenuByID: { __typename?: 'Menu', _id: string, name: string, sections?: Array<{ __typename?: 'Section', category: { __typename?: 'Category', _id: string, name: string }, products?: Array<{ __typename?: 'Product', _id: string, name: string, imageUrl?: string | null, price: number }> | null }> | null } };

export type GetAllMenusByBusinessIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllMenusByBusinessIdQuery = { __typename?: 'Query', getAllMenusByBusinessID: Array<{ __typename?: 'Menu', _id: string, name: string, sections?: Array<{ __typename?: 'Section', category: { __typename?: 'Category', _id: string, name: string }, products?: Array<{ __typename?: 'Product', _id: string, name: string, description?: string | null, imageUrl?: string | null, price: number }> | null }> | null } | null> };

export type UpdateMenuInfoMutationVariables = Exact<{
  input?: InputMaybe<UpdateMenuInfoInput>;
}>;


export type UpdateMenuInfoMutation = { __typename?: 'Mutation', updateMenuInfo: { __typename?: 'Menu', _id: string, name: string } };

export type UpdateMenuMutationVariables = Exact<{
  input?: InputMaybe<UpdateMenuInput>;
}>;


export type UpdateMenuMutation = { __typename?: 'Mutation', updateMenu?: { __typename?: 'Menu', _id: string, name: string, sections?: Array<{ __typename?: 'Section', category: { __typename?: 'Category', _id: string, name: string }, products?: Array<{ __typename?: 'Product', _id: string, name: string }> | null }> | null } | null };

export type CreateMultipleOrderDetailsMutationVariables = Exact<{
  input: Array<CreateOrderInput> | CreateOrderInput;
}>;


export type CreateMultipleOrderDetailsMutation = { __typename?: 'Mutation', createMultipleOrderDetails?: Array<{ __typename?: 'OrderDetail', _id: string, status: OrderStatus, quantity: number, subTotal: number, user?: string | null, product: { __typename?: 'Product', imageUrl?: string | null } }> | null };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'Product', _id: string, name: string, description?: string | null, price: number, imageUrl?: string | null } };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct?: { __typename?: 'RequestResponseOK', ok?: boolean | null } | null };

export type GetAllProductsByBusinessIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProductsByBusinessIdQuery = { __typename?: 'Query', getAllProductsByBusinessID: Array<{ __typename?: 'Product', _id: string, name: string, price: number, description?: string | null, imageUrl?: string | null, category?: { __typename?: 'Category', name: string, _id: string } | null } | null> };

export type UpdateProductByIdMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductByIdMutation = { __typename?: 'Mutation', updateProductByID: { __typename?: 'Product', _id: string, name: string, description?: string | null } };

export type UploadFileMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadFileMutation = { __typename?: 'Mutation', uploadFile: string };

export type CreateSpaceMutationVariables = Exact<{
  input?: InputMaybe<CreateSpaceInput>;
}>;


export type CreateSpaceMutation = { __typename?: 'Mutation', createSpace: { __typename?: 'Space', _id: string, name: string, business: string } };

export type GetSpacesFromBusinessQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpacesFromBusinessQuery = { __typename?: 'Query', getSpacesFromBusiness?: Array<{ __typename?: 'Space', _id: string, name: string, business: string, tables?: Array<{ __typename?: 'Table', _id: string, status: TableStatus, tableNumber: string, tab?: { __typename?: 'Tab', _id: string, admin: string, users?: Array<{ __typename?: 'User', _id: string }> | null, table: { __typename?: 'Table', _id: string, tableNumber: string }, orders: Array<{ __typename?: 'OrderDetail', _id: string, status: OrderStatus, quantity: number, subTotal: number, product: { __typename?: 'Product', imageUrl?: string | null, price: number, name: string } } | null> } | null }> | null }> | null };

export type CreateTabMutationVariables = Exact<{
  input: CreateTabInput;
}>;


export type CreateTabMutation = { __typename?: 'Mutation', createTab: { __typename?: 'Tab', _id: string, status: TabStatus, table: { __typename?: 'Table', _id: string, tableNumber: string } } };

export type GetTabByIdQueryVariables = Exact<{
  input: GetById;
}>;


export type GetTabByIdQuery = { __typename?: 'Query', getTabByID?: { __typename?: 'Tab', _id: string, admin: string, users?: Array<{ __typename?: 'User', _id: string }> | null, table: { __typename?: 'Table', _id: string, tableNumber: string }, orders: Array<{ __typename?: 'OrderDetail', _id: string, status: OrderStatus, quantity: number, subTotal: number, product: { __typename?: 'Product', imageUrl?: string | null, price: number, name: string } } | null> } | null };

export type CreateTableMutationVariables = Exact<{
  input?: InputMaybe<CreateTableInput>;
}>;


export type CreateTableMutation = { __typename?: 'Mutation', createTable: { __typename?: 'Table', space: string, _id: string } };

export type CreateUserMutationVariables = Exact<{
  input?: InputMaybe<UserInput>;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', _id: string, name: string, email: string, token: string } };

export type PostUserLoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type PostUserLoginMutation = { __typename?: 'Mutation', postUserLogin: { __typename?: 'User', name: string, email: string, token: string } };

export type RecoverPasswordMutationVariables = Exact<{
  input: Scalars['String'];
}>;


export type RecoverPasswordMutation = { __typename?: 'Mutation', recoverPassword?: { __typename?: 'RequestResponseOK', ok?: boolean | null } | null };

export type RequestUserAccountCreationMutationVariables = Exact<{
  input?: InputMaybe<RequestUserAccountInput>;
}>;


export type RequestUserAccountCreationMutation = { __typename?: 'Mutation', requestUserAccountCreation: { __typename?: 'AccountCreationResponse', ok: boolean, url?: string | null } };

export type UpdateUserInformationMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserInformationMutation = { __typename?: 'Mutation', updateUserInformation: { __typename?: 'User', token: string, email: string, name: string, _id: string } };


export const GetBusinessLocationDocument = gql`
    query GetBusinessLocation {
  getBusinessLocation {
    streetAddress
    stateOrProvince
    postalCode
    country
    complement
    city
    _id
  }
}
    `;

/**
 * __useGetBusinessLocationQuery__
 *
 * To run a query within a React component, call `useGetBusinessLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBusinessLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBusinessLocationQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBusinessLocationQuery(baseOptions?: Apollo.QueryHookOptions<GetBusinessLocationQuery, GetBusinessLocationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBusinessLocationQuery, GetBusinessLocationQueryVariables>(GetBusinessLocationDocument, options);
      }
export function useGetBusinessLocationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBusinessLocationQuery, GetBusinessLocationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBusinessLocationQuery, GetBusinessLocationQueryVariables>(GetBusinessLocationDocument, options);
        }
export type GetBusinessLocationQueryHookResult = ReturnType<typeof useGetBusinessLocationQuery>;
export type GetBusinessLocationLazyQueryHookResult = ReturnType<typeof useGetBusinessLocationLazyQuery>;
export type GetBusinessLocationQueryResult = Apollo.QueryResult<GetBusinessLocationQuery, GetBusinessLocationQueryVariables>;
export const UpdateBusinessLocationDocument = gql`
    mutation UpdateBusinessLocation($input: AddressInput) {
  updateBusinessLocation(input: $input) {
    address {
      streetAddress
      stateOrProvince
      postalCode
      country
      complement
      city
      _id
    }
  }
}
    `;
export type UpdateBusinessLocationMutationFn = Apollo.MutationFunction<UpdateBusinessLocationMutation, UpdateBusinessLocationMutationVariables>;

/**
 * __useUpdateBusinessLocationMutation__
 *
 * To run a mutation, you first call `useUpdateBusinessLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBusinessLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBusinessLocationMutation, { data, loading, error }] = useUpdateBusinessLocationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateBusinessLocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBusinessLocationMutation, UpdateBusinessLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBusinessLocationMutation, UpdateBusinessLocationMutationVariables>(UpdateBusinessLocationDocument, options);
      }
export type UpdateBusinessLocationMutationHookResult = ReturnType<typeof useUpdateBusinessLocationMutation>;
export type UpdateBusinessLocationMutationResult = Apollo.MutationResult<UpdateBusinessLocationMutation>;
export type UpdateBusinessLocationMutationOptions = Apollo.BaseMutationOptions<UpdateBusinessLocationMutation, UpdateBusinessLocationMutationVariables>;
export const CreateCategoryDocument = gql`
    mutation CreateCategory($input: CategoryInput!) {
  createCategory(input: $input) {
    _id
    name
    description
  }
}
    `;
export type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($id: ID!) {
  deleteCategory(id: $id) {
    ok
  }
}
    `;
export type DeleteCategoryMutationFn = Apollo.MutationFunction<DeleteCategoryMutation, DeleteCategoryMutationVariables>;

/**
 * __useDeleteCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryMutation, { data, loading, error }] = useDeleteCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, options);
      }
export type DeleteCategoryMutationHookResult = ReturnType<typeof useDeleteCategoryMutation>;
export type DeleteCategoryMutationResult = Apollo.MutationResult<DeleteCategoryMutation>;
export type DeleteCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const GetAllCategoriesByBusinessDocument = gql`
    query getAllCategoriesByBusiness {
  getAllCategoriesByBusiness {
    _id
    name
    description
  }
}
    `;

/**
 * __useGetAllCategoriesByBusinessQuery__
 *
 * To run a query within a React component, call `useGetAllCategoriesByBusinessQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCategoriesByBusinessQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCategoriesByBusinessQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllCategoriesByBusinessQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCategoriesByBusinessQuery, GetAllCategoriesByBusinessQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCategoriesByBusinessQuery, GetAllCategoriesByBusinessQueryVariables>(GetAllCategoriesByBusinessDocument, options);
      }
export function useGetAllCategoriesByBusinessLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCategoriesByBusinessQuery, GetAllCategoriesByBusinessQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCategoriesByBusinessQuery, GetAllCategoriesByBusinessQueryVariables>(GetAllCategoriesByBusinessDocument, options);
        }
export type GetAllCategoriesByBusinessQueryHookResult = ReturnType<typeof useGetAllCategoriesByBusinessQuery>;
export type GetAllCategoriesByBusinessLazyQueryHookResult = ReturnType<typeof useGetAllCategoriesByBusinessLazyQuery>;
export type GetAllCategoriesByBusinessQueryResult = Apollo.QueryResult<GetAllCategoriesByBusinessQuery, GetAllCategoriesByBusinessQueryVariables>;
export const UpdateCategoryDocument = gql`
    mutation UpdateCategory($input: UpdateCategoryInput) {
  updateCategory(input: $input) {
    _id
    name
    description
  }
}
    `;
export type UpdateCategoryMutationFn = Apollo.MutationFunction<UpdateCategoryMutation, UpdateCategoryMutationVariables>;

/**
 * __useUpdateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryMutation, { data, loading, error }] = useUpdateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, options);
      }
export type UpdateCategoryMutationHookResult = ReturnType<typeof useUpdateCategoryMutation>;
export type UpdateCategoryMutationResult = Apollo.MutationResult<UpdateCategoryMutation>;
export type UpdateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const CreateMenuDocument = gql`
    mutation CreateMenu($input: CreateMenuInput!) {
  createMenu(input: $input) {
    _id
    name
    sections {
      category {
        name
      }
      products {
        _id
      }
    }
  }
}
    `;
export type CreateMenuMutationFn = Apollo.MutationFunction<CreateMenuMutation, CreateMenuMutationVariables>;

/**
 * __useCreateMenuMutation__
 *
 * To run a mutation, you first call `useCreateMenuMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMenuMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMenuMutation, { data, loading, error }] = useCreateMenuMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMenuMutation(baseOptions?: Apollo.MutationHookOptions<CreateMenuMutation, CreateMenuMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMenuMutation, CreateMenuMutationVariables>(CreateMenuDocument, options);
      }
export type CreateMenuMutationHookResult = ReturnType<typeof useCreateMenuMutation>;
export type CreateMenuMutationResult = Apollo.MutationResult<CreateMenuMutation>;
export type CreateMenuMutationOptions = Apollo.BaseMutationOptions<CreateMenuMutation, CreateMenuMutationVariables>;
export const DeleteMenuDocument = gql`
    mutation DeleteMenu($id: ID!) {
  deleteMenu(id: $id) {
    _id
    name
  }
}
    `;
export type DeleteMenuMutationFn = Apollo.MutationFunction<DeleteMenuMutation, DeleteMenuMutationVariables>;

/**
 * __useDeleteMenuMutation__
 *
 * To run a mutation, you first call `useDeleteMenuMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMenuMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMenuMutation, { data, loading, error }] = useDeleteMenuMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMenuMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMenuMutation, DeleteMenuMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMenuMutation, DeleteMenuMutationVariables>(DeleteMenuDocument, options);
      }
export type DeleteMenuMutationHookResult = ReturnType<typeof useDeleteMenuMutation>;
export type DeleteMenuMutationResult = Apollo.MutationResult<DeleteMenuMutation>;
export type DeleteMenuMutationOptions = Apollo.BaseMutationOptions<DeleteMenuMutation, DeleteMenuMutationVariables>;
export const GetMenuByIdDocument = gql`
    query GetMenuByID($input: GetMenuById) {
  getMenuByID(input: $input) {
    _id
    name
    sections {
      category {
        _id
        name
      }
      products {
        _id
        name
        imageUrl
        price
      }
    }
  }
}
    `;

/**
 * __useGetMenuByIdQuery__
 *
 * To run a query within a React component, call `useGetMenuByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMenuByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMenuByIdQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetMenuByIdQuery(baseOptions?: Apollo.QueryHookOptions<GetMenuByIdQuery, GetMenuByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMenuByIdQuery, GetMenuByIdQueryVariables>(GetMenuByIdDocument, options);
      }
export function useGetMenuByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMenuByIdQuery, GetMenuByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMenuByIdQuery, GetMenuByIdQueryVariables>(GetMenuByIdDocument, options);
        }
export type GetMenuByIdQueryHookResult = ReturnType<typeof useGetMenuByIdQuery>;
export type GetMenuByIdLazyQueryHookResult = ReturnType<typeof useGetMenuByIdLazyQuery>;
export type GetMenuByIdQueryResult = Apollo.QueryResult<GetMenuByIdQuery, GetMenuByIdQueryVariables>;
export const GetAllMenusByBusinessIdDocument = gql`
    query GetAllMenusByBusinessID {
  getAllMenusByBusinessID {
    _id
    name
    sections {
      category {
        _id
        name
      }
      products {
        _id
        name
        description
        imageUrl
        price
      }
    }
  }
}
    `;

/**
 * __useGetAllMenusByBusinessIdQuery__
 *
 * To run a query within a React component, call `useGetAllMenusByBusinessIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllMenusByBusinessIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllMenusByBusinessIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllMenusByBusinessIdQuery(baseOptions?: Apollo.QueryHookOptions<GetAllMenusByBusinessIdQuery, GetAllMenusByBusinessIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllMenusByBusinessIdQuery, GetAllMenusByBusinessIdQueryVariables>(GetAllMenusByBusinessIdDocument, options);
      }
export function useGetAllMenusByBusinessIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllMenusByBusinessIdQuery, GetAllMenusByBusinessIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllMenusByBusinessIdQuery, GetAllMenusByBusinessIdQueryVariables>(GetAllMenusByBusinessIdDocument, options);
        }
export type GetAllMenusByBusinessIdQueryHookResult = ReturnType<typeof useGetAllMenusByBusinessIdQuery>;
export type GetAllMenusByBusinessIdLazyQueryHookResult = ReturnType<typeof useGetAllMenusByBusinessIdLazyQuery>;
export type GetAllMenusByBusinessIdQueryResult = Apollo.QueryResult<GetAllMenusByBusinessIdQuery, GetAllMenusByBusinessIdQueryVariables>;
export const UpdateMenuInfoDocument = gql`
    mutation UpdateMenuInfo($input: UpdateMenuInfoInput) {
  updateMenuInfo(input: $input) {
    _id
    name
  }
}
    `;
export type UpdateMenuInfoMutationFn = Apollo.MutationFunction<UpdateMenuInfoMutation, UpdateMenuInfoMutationVariables>;

/**
 * __useUpdateMenuInfoMutation__
 *
 * To run a mutation, you first call `useUpdateMenuInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMenuInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMenuInfoMutation, { data, loading, error }] = useUpdateMenuInfoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMenuInfoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMenuInfoMutation, UpdateMenuInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMenuInfoMutation, UpdateMenuInfoMutationVariables>(UpdateMenuInfoDocument, options);
      }
export type UpdateMenuInfoMutationHookResult = ReturnType<typeof useUpdateMenuInfoMutation>;
export type UpdateMenuInfoMutationResult = Apollo.MutationResult<UpdateMenuInfoMutation>;
export type UpdateMenuInfoMutationOptions = Apollo.BaseMutationOptions<UpdateMenuInfoMutation, UpdateMenuInfoMutationVariables>;
export const UpdateMenuDocument = gql`
    mutation UpdateMenu($input: UpdateMenuInput) {
  updateMenu(input: $input) {
    _id
    name
    sections {
      category {
        _id
        name
      }
      products {
        _id
        name
      }
    }
  }
}
    `;
export type UpdateMenuMutationFn = Apollo.MutationFunction<UpdateMenuMutation, UpdateMenuMutationVariables>;

/**
 * __useUpdateMenuMutation__
 *
 * To run a mutation, you first call `useUpdateMenuMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMenuMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMenuMutation, { data, loading, error }] = useUpdateMenuMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMenuMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMenuMutation, UpdateMenuMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMenuMutation, UpdateMenuMutationVariables>(UpdateMenuDocument, options);
      }
export type UpdateMenuMutationHookResult = ReturnType<typeof useUpdateMenuMutation>;
export type UpdateMenuMutationResult = Apollo.MutationResult<UpdateMenuMutation>;
export type UpdateMenuMutationOptions = Apollo.BaseMutationOptions<UpdateMenuMutation, UpdateMenuMutationVariables>;
export const CreateMultipleOrderDetailsDocument = gql`
    mutation CreateMultipleOrderDetails($input: [CreateOrderInput!]!) {
  createMultipleOrderDetails(input: $input) {
    _id
    product {
      imageUrl
    }
    status
    quantity
    subTotal
    user
  }
}
    `;
export type CreateMultipleOrderDetailsMutationFn = Apollo.MutationFunction<CreateMultipleOrderDetailsMutation, CreateMultipleOrderDetailsMutationVariables>;

/**
 * __useCreateMultipleOrderDetailsMutation__
 *
 * To run a mutation, you first call `useCreateMultipleOrderDetailsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMultipleOrderDetailsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMultipleOrderDetailsMutation, { data, loading, error }] = useCreateMultipleOrderDetailsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMultipleOrderDetailsMutation(baseOptions?: Apollo.MutationHookOptions<CreateMultipleOrderDetailsMutation, CreateMultipleOrderDetailsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMultipleOrderDetailsMutation, CreateMultipleOrderDetailsMutationVariables>(CreateMultipleOrderDetailsDocument, options);
      }
export type CreateMultipleOrderDetailsMutationHookResult = ReturnType<typeof useCreateMultipleOrderDetailsMutation>;
export type CreateMultipleOrderDetailsMutationResult = Apollo.MutationResult<CreateMultipleOrderDetailsMutation>;
export type CreateMultipleOrderDetailsMutationOptions = Apollo.BaseMutationOptions<CreateMultipleOrderDetailsMutation, CreateMultipleOrderDetailsMutationVariables>;
export const CreateProductDocument = gql`
    mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    _id
    name
    description
    price
    imageUrl
  }
}
    `;
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id) {
    ok
  }
}
    `;
export type DeleteProductMutationFn = Apollo.MutationFunction<DeleteProductMutation, DeleteProductMutationVariables>;

/**
 * __useDeleteProductMutation__
 *
 * To run a mutation, you first call `useDeleteProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductMutation, { data, loading, error }] = useDeleteProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProductMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductMutation, DeleteProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, options);
      }
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<DeleteProductMutation, DeleteProductMutationVariables>;
export const GetAllProductsByBusinessIdDocument = gql`
    query GetAllProductsByBusinessID {
  getAllProductsByBusinessID {
    _id
    name
    price
    description
    imageUrl
    category {
      name
      _id
    }
  }
}
    `;

/**
 * __useGetAllProductsByBusinessIdQuery__
 *
 * To run a query within a React component, call `useGetAllProductsByBusinessIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllProductsByBusinessIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllProductsByBusinessIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllProductsByBusinessIdQuery(baseOptions?: Apollo.QueryHookOptions<GetAllProductsByBusinessIdQuery, GetAllProductsByBusinessIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllProductsByBusinessIdQuery, GetAllProductsByBusinessIdQueryVariables>(GetAllProductsByBusinessIdDocument, options);
      }
export function useGetAllProductsByBusinessIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllProductsByBusinessIdQuery, GetAllProductsByBusinessIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllProductsByBusinessIdQuery, GetAllProductsByBusinessIdQueryVariables>(GetAllProductsByBusinessIdDocument, options);
        }
export type GetAllProductsByBusinessIdQueryHookResult = ReturnType<typeof useGetAllProductsByBusinessIdQuery>;
export type GetAllProductsByBusinessIdLazyQueryHookResult = ReturnType<typeof useGetAllProductsByBusinessIdLazyQuery>;
export type GetAllProductsByBusinessIdQueryResult = Apollo.QueryResult<GetAllProductsByBusinessIdQuery, GetAllProductsByBusinessIdQueryVariables>;
export const UpdateProductByIdDocument = gql`
    mutation UpdateProductByID($input: UpdateProductInput!) {
  updateProductByID(input: $input) {
    _id
    name
    description
  }
}
    `;
export type UpdateProductByIdMutationFn = Apollo.MutationFunction<UpdateProductByIdMutation, UpdateProductByIdMutationVariables>;

/**
 * __useUpdateProductByIdMutation__
 *
 * To run a mutation, you first call `useUpdateProductByIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductByIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductByIdMutation, { data, loading, error }] = useUpdateProductByIdMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductByIdMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductByIdMutation, UpdateProductByIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductByIdMutation, UpdateProductByIdMutationVariables>(UpdateProductByIdDocument, options);
      }
export type UpdateProductByIdMutationHookResult = ReturnType<typeof useUpdateProductByIdMutation>;
export type UpdateProductByIdMutationResult = Apollo.MutationResult<UpdateProductByIdMutation>;
export type UpdateProductByIdMutationOptions = Apollo.BaseMutationOptions<UpdateProductByIdMutation, UpdateProductByIdMutationVariables>;
export const UploadFileDocument = gql`
    mutation UploadFile($file: Upload!) {
  uploadFile(file: $file)
}
    `;
export type UploadFileMutationFn = Apollo.MutationFunction<UploadFileMutation, UploadFileMutationVariables>;

/**
 * __useUploadFileMutation__
 *
 * To run a mutation, you first call `useUploadFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadFileMutation, { data, loading, error }] = useUploadFileMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadFileMutation(baseOptions?: Apollo.MutationHookOptions<UploadFileMutation, UploadFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadFileMutation, UploadFileMutationVariables>(UploadFileDocument, options);
      }
export type UploadFileMutationHookResult = ReturnType<typeof useUploadFileMutation>;
export type UploadFileMutationResult = Apollo.MutationResult<UploadFileMutation>;
export type UploadFileMutationOptions = Apollo.BaseMutationOptions<UploadFileMutation, UploadFileMutationVariables>;
export const CreateSpaceDocument = gql`
    mutation CreateSpace($input: CreateSpaceInput) {
  createSpace(input: $input) {
    _id
    name
    business
  }
}
    `;
export type CreateSpaceMutationFn = Apollo.MutationFunction<CreateSpaceMutation, CreateSpaceMutationVariables>;

/**
 * __useCreateSpaceMutation__
 *
 * To run a mutation, you first call `useCreateSpaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSpaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSpaceMutation, { data, loading, error }] = useCreateSpaceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSpaceMutation(baseOptions?: Apollo.MutationHookOptions<CreateSpaceMutation, CreateSpaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSpaceMutation, CreateSpaceMutationVariables>(CreateSpaceDocument, options);
      }
export type CreateSpaceMutationHookResult = ReturnType<typeof useCreateSpaceMutation>;
export type CreateSpaceMutationResult = Apollo.MutationResult<CreateSpaceMutation>;
export type CreateSpaceMutationOptions = Apollo.BaseMutationOptions<CreateSpaceMutation, CreateSpaceMutationVariables>;
export const GetSpacesFromBusinessDocument = gql`
    query GetSpacesFromBusiness {
  getSpacesFromBusiness {
    _id
    name
    business
    tables {
      _id
      status
      tableNumber
      tab {
        users {
          _id
        }
        _id
        table {
          _id
          tableNumber
        }
        admin
        orders {
          _id
          status
          quantity
          subTotal
          product {
            imageUrl
            price
            name
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetSpacesFromBusinessQuery__
 *
 * To run a query within a React component, call `useGetSpacesFromBusinessQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSpacesFromBusinessQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSpacesFromBusinessQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSpacesFromBusinessQuery(baseOptions?: Apollo.QueryHookOptions<GetSpacesFromBusinessQuery, GetSpacesFromBusinessQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSpacesFromBusinessQuery, GetSpacesFromBusinessQueryVariables>(GetSpacesFromBusinessDocument, options);
      }
export function useGetSpacesFromBusinessLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSpacesFromBusinessQuery, GetSpacesFromBusinessQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSpacesFromBusinessQuery, GetSpacesFromBusinessQueryVariables>(GetSpacesFromBusinessDocument, options);
        }
export type GetSpacesFromBusinessQueryHookResult = ReturnType<typeof useGetSpacesFromBusinessQuery>;
export type GetSpacesFromBusinessLazyQueryHookResult = ReturnType<typeof useGetSpacesFromBusinessLazyQuery>;
export type GetSpacesFromBusinessQueryResult = Apollo.QueryResult<GetSpacesFromBusinessQuery, GetSpacesFromBusinessQueryVariables>;
export const CreateTabDocument = gql`
    mutation CreateTab($input: CreateTabInput!) {
  createTab(input: $input) {
    _id
    status
    table {
      _id
      tableNumber
    }
  }
}
    `;
export type CreateTabMutationFn = Apollo.MutationFunction<CreateTabMutation, CreateTabMutationVariables>;

/**
 * __useCreateTabMutation__
 *
 * To run a mutation, you first call `useCreateTabMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTabMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTabMutation, { data, loading, error }] = useCreateTabMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTabMutation(baseOptions?: Apollo.MutationHookOptions<CreateTabMutation, CreateTabMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTabMutation, CreateTabMutationVariables>(CreateTabDocument, options);
      }
export type CreateTabMutationHookResult = ReturnType<typeof useCreateTabMutation>;
export type CreateTabMutationResult = Apollo.MutationResult<CreateTabMutation>;
export type CreateTabMutationOptions = Apollo.BaseMutationOptions<CreateTabMutation, CreateTabMutationVariables>;
export const GetTabByIdDocument = gql`
    query GetTabByID($input: GetById!) {
  getTabByID(input: $input) {
    _id
    users {
      _id
    }
    _id
    table {
      _id
      tableNumber
    }
    admin
    orders {
      _id
      status
      quantity
      subTotal
      product {
        imageUrl
        price
        name
      }
    }
  }
}
    `;

/**
 * __useGetTabByIdQuery__
 *
 * To run a query within a React component, call `useGetTabByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTabByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTabByIdQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetTabByIdQuery(baseOptions: Apollo.QueryHookOptions<GetTabByIdQuery, GetTabByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTabByIdQuery, GetTabByIdQueryVariables>(GetTabByIdDocument, options);
      }
export function useGetTabByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTabByIdQuery, GetTabByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTabByIdQuery, GetTabByIdQueryVariables>(GetTabByIdDocument, options);
        }
export type GetTabByIdQueryHookResult = ReturnType<typeof useGetTabByIdQuery>;
export type GetTabByIdLazyQueryHookResult = ReturnType<typeof useGetTabByIdLazyQuery>;
export type GetTabByIdQueryResult = Apollo.QueryResult<GetTabByIdQuery, GetTabByIdQueryVariables>;
export const CreateTableDocument = gql`
    mutation CreateTable($input: CreateTableInput) {
  createTable(input: $input) {
    space
    _id
  }
}
    `;
export type CreateTableMutationFn = Apollo.MutationFunction<CreateTableMutation, CreateTableMutationVariables>;

/**
 * __useCreateTableMutation__
 *
 * To run a mutation, you first call `useCreateTableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTableMutation, { data, loading, error }] = useCreateTableMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTableMutation(baseOptions?: Apollo.MutationHookOptions<CreateTableMutation, CreateTableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTableMutation, CreateTableMutationVariables>(CreateTableDocument, options);
      }
export type CreateTableMutationHookResult = ReturnType<typeof useCreateTableMutation>;
export type CreateTableMutationResult = Apollo.MutationResult<CreateTableMutation>;
export type CreateTableMutationOptions = Apollo.BaseMutationOptions<CreateTableMutation, CreateTableMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($input: UserInput) {
  createUser(input: $input) {
    _id
    name
    email
    token
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const PostUserLoginDocument = gql`
    mutation PostUserLogin($input: loginInput!) {
  postUserLogin(input: $input) {
    name
    email
    token
  }
}
    `;
export type PostUserLoginMutationFn = Apollo.MutationFunction<PostUserLoginMutation, PostUserLoginMutationVariables>;

/**
 * __usePostUserLoginMutation__
 *
 * To run a mutation, you first call `usePostUserLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostUserLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postUserLoginMutation, { data, loading, error }] = usePostUserLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePostUserLoginMutation(baseOptions?: Apollo.MutationHookOptions<PostUserLoginMutation, PostUserLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostUserLoginMutation, PostUserLoginMutationVariables>(PostUserLoginDocument, options);
      }
export type PostUserLoginMutationHookResult = ReturnType<typeof usePostUserLoginMutation>;
export type PostUserLoginMutationResult = Apollo.MutationResult<PostUserLoginMutation>;
export type PostUserLoginMutationOptions = Apollo.BaseMutationOptions<PostUserLoginMutation, PostUserLoginMutationVariables>;
export const RecoverPasswordDocument = gql`
    mutation RecoverPassword($input: String!) {
  recoverPassword(input: $input) {
    ok
  }
}
    `;
export type RecoverPasswordMutationFn = Apollo.MutationFunction<RecoverPasswordMutation, RecoverPasswordMutationVariables>;

/**
 * __useRecoverPasswordMutation__
 *
 * To run a mutation, you first call `useRecoverPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRecoverPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [recoverPasswordMutation, { data, loading, error }] = useRecoverPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRecoverPasswordMutation(baseOptions?: Apollo.MutationHookOptions<RecoverPasswordMutation, RecoverPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RecoverPasswordMutation, RecoverPasswordMutationVariables>(RecoverPasswordDocument, options);
      }
export type RecoverPasswordMutationHookResult = ReturnType<typeof useRecoverPasswordMutation>;
export type RecoverPasswordMutationResult = Apollo.MutationResult<RecoverPasswordMutation>;
export type RecoverPasswordMutationOptions = Apollo.BaseMutationOptions<RecoverPasswordMutation, RecoverPasswordMutationVariables>;
export const RequestUserAccountCreationDocument = gql`
    mutation RequestUserAccountCreation($input: RequestUserAccountInput) {
  requestUserAccountCreation(input: $input) {
    ok
    url
  }
}
    `;
export type RequestUserAccountCreationMutationFn = Apollo.MutationFunction<RequestUserAccountCreationMutation, RequestUserAccountCreationMutationVariables>;

/**
 * __useRequestUserAccountCreationMutation__
 *
 * To run a mutation, you first call `useRequestUserAccountCreationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestUserAccountCreationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestUserAccountCreationMutation, { data, loading, error }] = useRequestUserAccountCreationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRequestUserAccountCreationMutation(baseOptions?: Apollo.MutationHookOptions<RequestUserAccountCreationMutation, RequestUserAccountCreationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestUserAccountCreationMutation, RequestUserAccountCreationMutationVariables>(RequestUserAccountCreationDocument, options);
      }
export type RequestUserAccountCreationMutationHookResult = ReturnType<typeof useRequestUserAccountCreationMutation>;
export type RequestUserAccountCreationMutationResult = Apollo.MutationResult<RequestUserAccountCreationMutation>;
export type RequestUserAccountCreationMutationOptions = Apollo.BaseMutationOptions<RequestUserAccountCreationMutation, RequestUserAccountCreationMutationVariables>;
export const UpdateUserInformationDocument = gql`
    mutation UpdateUserInformation($input: UpdateUserInput!) {
  updateUserInformation(input: $input) {
    token
    email
    name
    _id
  }
}
    `;
export type UpdateUserInformationMutationFn = Apollo.MutationFunction<UpdateUserInformationMutation, UpdateUserInformationMutationVariables>;

/**
 * __useUpdateUserInformationMutation__
 *
 * To run a mutation, you first call `useUpdateUserInformationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserInformationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserInformationMutation, { data, loading, error }] = useUpdateUserInformationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserInformationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserInformationMutation, UpdateUserInformationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserInformationMutation, UpdateUserInformationMutationVariables>(UpdateUserInformationDocument, options);
      }
export type UpdateUserInformationMutationHookResult = ReturnType<typeof useUpdateUserInformationMutation>;
export type UpdateUserInformationMutationResult = Apollo.MutationResult<UpdateUserInformationMutation>;
export type UpdateUserInformationMutationOptions = Apollo.BaseMutationOptions<UpdateUserInformationMutation, UpdateUserInformationMutationVariables>;