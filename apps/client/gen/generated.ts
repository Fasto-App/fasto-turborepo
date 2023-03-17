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
  description?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  employees: Array<Maybe<Scalars['String']>>;
  hoursOfOperation?: Maybe<HoursOfOperation>;
  menus?: Maybe<Array<Menu>>;
  name: Scalars['String'];
  picture?: Maybe<Scalars['String']>;
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
  privilege: UserPrivileges;
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

export type Checkout = {
  __typename?: 'Checkout';
  _id: Scalars['ID'];
  business: Scalars['ID'];
  created_date: Scalars['String'];
  orders: Array<Maybe<OrderDetail>>;
  paid: Scalars['Boolean'];
  payments: Array<Maybe<Payment>>;
  status: CheckoutStatusKeys;
  subTotal: Scalars['Float'];
  tab: Scalars['ID'];
  tax: Scalars['Float'];
  tip: Scalars['Float'];
  total: Scalars['Float'];
  totalPaid: Scalars['Float'];
};

export enum CheckoutStatusKeys {
  Canceled = 'Canceled',
  Paid = 'Paid',
  PartiallyPaid = 'PartiallyPaid',
  Pending = 'Pending'
}

export type CreateBusinessPayload = {
  __typename?: 'CreateBusinessPayload';
  business: Business;
  token?: Maybe<Scalars['String']>;
};

export type CreateEmployeeAccountInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  token: Scalars['String'];
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
  Friday = 'Friday',
  Monday = 'Monday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
  Thursday = 'Thursday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday'
}

export type DeleteBusinessPayload = {
  __typename?: 'DeleteBusinessPayload';
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type DeleteEmployee = {
  _id: Scalars['ID'];
};

export type DeleteSpaceInput = {
  space: Scalars['ID'];
};

export type DeleteTableInput = {
  table: Scalars['ID'];
};

export type Employee = {
  __typename?: 'Employee';
  _id: Scalars['ID'];
  email: Scalars['String'];
  isPending: Scalars['Boolean'];
  jobTitle: Scalars['String'];
  name: Scalars['String'];
  picture?: Maybe<Scalars['String']>;
  privilege: UserPrivileges;
};

export type Employees = {
  __typename?: 'Employees';
  employees: Array<Employee>;
  employeesPending: Array<Employee>;
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

export type Hours = {
  __typename?: 'Hours';
  close: Scalars['String'];
  open: Scalars['String'];
};

export type HoursInput = {
  close: Scalars['String'];
  open: Scalars['String'];
};

export type HoursOfOperation = {
  __typename?: 'HoursOfOperation';
  Friday: WorkingHours;
  Monday: WorkingHours;
  Saturday: WorkingHours;
  Sunday: WorkingHours;
  Thursday: WorkingHours;
  Tuesday: WorkingHours;
  Wednesday: WorkingHours;
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

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MakeCheckoutPaymentInput = {
  amount: Scalars['Float'];
  checkout: Scalars['ID'];
  discount: Scalars['Float'];
  patron: Scalars['ID'];
  paymentMethod?: InputMaybe<Scalars['String']>;
  splitType?: InputMaybe<SplitType>;
  tip: Scalars['Float'];
};

export type ManageBusinessEmployeesInput = {
  _id?: InputMaybe<Scalars['ID']>;
  email: Scalars['String'];
  isPending?: InputMaybe<Scalars['Boolean']>;
  jobTitle: Scalars['String'];
  name: Scalars['String'];
  privilege: UserPrivileges;
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
  createAddress?: Maybe<Address>;
  createBusiness?: Maybe<CreateBusinessPayload>;
  createCategory?: Maybe<Category>;
  createEmployeeAccount: User;
  createMenu: Menu;
  createMultipleOrderDetails?: Maybe<Array<OrderDetail>>;
  createOrderDetail?: Maybe<OrderDetail>;
  createProduct: Product;
  createSpace: Space;
  createTab: Tab;
  createTable: Table;
  createUser: User;
  deleteBusiness?: Maybe<DeleteBusinessPayload>;
  deleteBusinessEmployee: Scalars['ID'];
  deleteCategory?: Maybe<RequestResponseOk>;
  deleteMenu: Menu;
  deleteOrderDetail?: Maybe<OrderDetail>;
  deleteProduct?: Maybe<RequestResponseOk>;
  deleteSpace: Space;
  deleteTab?: Maybe<Tab>;
  deleteTable: RequestResponseOk;
  deleteUser: RequestResponseOk;
  linkCategoryToProducts?: Maybe<Category>;
  makeCheckoutPayment: Checkout;
  manageBusinessEmployees: Employee;
  openTabRequest?: Maybe<Scalars['String']>;
  passwordReset: User;
  postUserLogin: User;
  recoverPassword?: Maybe<RequestResponseOk>;
  requestCloseTab: Tab;
  requestUserAccountCreation: AccountCreationResponse;
  updateAddress?: Maybe<Address>;
  updateBusinessInformation: Business;
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


export type MutationCreateAddressArgs = {
  input: AddressInput;
};


export type MutationCreateBusinessArgs = {
  input: BusinessInput;
};


export type MutationCreateCategoryArgs = {
  input?: InputMaybe<CategoryInput>;
};


export type MutationCreateEmployeeAccountArgs = {
  input: CreateEmployeeAccountInput;
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


export type MutationDeleteBusinessEmployeeArgs = {
  input: DeleteEmployee;
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


export type MutationMakeCheckoutPaymentArgs = {
  input: MakeCheckoutPaymentInput;
};


export type MutationManageBusinessEmployeesArgs = {
  input: ManageBusinessEmployeesInput;
};


export type MutationOpenTabRequestArgs = {
  input: OpenTabRequestInput;
};


export type MutationPasswordResetArgs = {
  input: ResetPasswordInput;
};


export type MutationPostUserLoginArgs = {
  input: LoginInput;
};


export type MutationRecoverPasswordArgs = {
  input: Scalars['String'];
};


export type MutationRequestCloseTabArgs = {
  input: GetById;
};


export type MutationRequestUserAccountCreationArgs = {
  input?: InputMaybe<RequestUserAccountInput>;
};


export type MutationUpdateAddressArgs = {
  input?: InputMaybe<UpdateAddressInput>;
};


export type MutationUpdateBusinessInformationArgs = {
  input: UpdateBusinessInfoInput;
};


export type MutationUpdateBusinessLocationArgs = {
  input: AddressInput;
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

export type OpenTabRequestInput = {
  name: Scalars['String'];
  names?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  phoneNumber: Scalars['String'];
  totalGuests: Scalars['Int'];
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
  Closed = 'Closed',
  Delivered = 'Delivered',
  Open = 'Open',
  Pendent = 'Pendent'
}

export type Payment = {
  __typename?: 'Payment';
  _id: Scalars['ID'];
  amount: Scalars['Float'];
  discount: Scalars['Float'];
  patron: Scalars['ID'];
  splitType?: Maybe<SplitType>;
  tip: Scalars['Float'];
};

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
  getAllBusiness: Array<Maybe<Business>>;
  getAllBusinessByUser: Array<Maybe<Business>>;
  getAllCategoriesByBusiness: Array<Category>;
  getAllEmployees: Employees;
  getAllMenus: Array<Menu>;
  getAllMenusByBusinessID: Array<Menu>;
  getAllOpenTabsByBusinessID?: Maybe<Array<Maybe<Tab>>>;
  getAllOrderDetailsByOrderID?: Maybe<Array<Maybe<OrderDetail>>>;
  getAllProductsByBusinessID: Array<Maybe<Product>>;
  getAllTabsByBusinessID?: Maybe<Array<Maybe<Tab>>>;
  getAllUsers: Array<User>;
  getBusinessInformation: Business;
  getBusinessLocation?: Maybe<Address>;
  getCategoryByID?: Maybe<Category>;
  getCheckoutByID: Checkout;
  getMenuByID: Menu;
  getOrderDetailByID?: Maybe<OrderDetail>;
  getProductByID?: Maybe<Product>;
  getSpacesFromBusiness?: Maybe<Array<Space>>;
  getTabByID?: Maybe<Tab>;
  getToken?: Maybe<User>;
  getUserInformation?: Maybe<User>;
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


export type QueryGetCheckoutByIdArgs = {
  input: GetById;
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

export type RequestResponseOk = {
  __typename?: 'RequestResponseOK';
  ok?: Maybe<Scalars['Boolean']>;
};

export type RequestUserAccountInput = {
  email: Scalars['String'];
};

export type ResetPasswordInput = {
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  token: Scalars['String'];
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

export enum SplitType {
  ByPatron = 'ByPatron',
  Custom = 'Custom',
  Equally = 'Equally'
}

export type Tab = {
  __typename?: 'Tab';
  _id: Scalars['ID'];
  admin: Scalars['ID'];
  checkout?: Maybe<Scalars['ID']>;
  completed_at?: Maybe<Scalars['String']>;
  created_date: Scalars['String'];
  orders: Array<Maybe<OrderDetail>>;
  status: TabStatus;
  table: Table;
  users?: Maybe<Array<User>>;
};

export enum TabStatus {
  Closed = 'Closed',
  Open = 'Open',
  Pendent = 'Pendent'
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
  Available = 'Available',
  Closed = 'Closed',
  Occupied = 'Occupied',
  Reserved = 'Reserved'
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

export type UpdateBusinessInfoInput = {
  description?: InputMaybe<Scalars['String']>;
  hoursOfOperation?: InputMaybe<HoursOfOperationInput>;
  name: Scalars['String'];
  picture?: InputMaybe<Scalars['Upload']>;
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
  email: Scalars['String'];
  name: Scalars['String'];
  newPassword?: InputMaybe<Scalars['String']>;
  newPasswordConfirmation?: InputMaybe<Scalars['String']>;
  oldPassword?: InputMaybe<Scalars['String']>;
  picture?: InputMaybe<Scalars['Upload']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  businesses: Array<BusinessPrivileges>;
  email: Scalars['String'];
  name: Scalars['String'];
  picture?: Maybe<Scalars['String']>;
  token: Scalars['String'];
};

export type UserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  privilege?: InputMaybe<UserPrivileges>;
};

export enum UserPrivileges {
  Admin = 'Admin',
  Customer = 'Customer',
  Manager = 'Manager',
  Staff = 'Staff',
  View = 'View'
}

export type WorkingHours = {
  __typename?: 'WorkingHours';
  hours?: Maybe<Hours>;
  isOpen: Scalars['Boolean'];
};

export type WorkingHoursInput = {
  hours?: InputMaybe<HoursInput>;
  isOpen: Scalars['Boolean'];
};

export type DeleteBusinessEmployeeMutationVariables = Exact<{
  input: DeleteEmployee;
}>;


export type DeleteBusinessEmployeeMutation = { __typename?: 'Mutation', deleteBusinessEmployee: string };

export type ManageBusinessEmployeesMutationVariables = Exact<{
  input: ManageBusinessEmployeesInput;
}>;


export type ManageBusinessEmployeesMutation = { __typename?: 'Mutation', manageBusinessEmployees: { __typename?: 'Employee', email: string, name: string, picture?: string | null, privilege: UserPrivileges } };

export type UpdateBusinessInformationMutationVariables = Exact<{
  input: UpdateBusinessInfoInput;
}>;


export type UpdateBusinessInformationMutation = { __typename?: 'Mutation', updateBusinessInformation: { __typename?: 'Business', name: string, picture?: string | null, description?: string | null, _id: string } };

export type UpdateBusinessLocationMutationVariables = Exact<{
  input: AddressInput;
}>;


export type UpdateBusinessLocationMutation = { __typename?: 'Mutation', updateBusinessLocation?: { __typename?: 'Business', address?: { __typename?: 'Address', streetAddress: string, stateOrProvince: string, postalCode: string, country: string, complement?: string | null, city: string, _id: string } | null } | null };

export type GetAllEmployeesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllEmployeesQuery = { __typename?: 'Query', getAllEmployees: { __typename?: 'Employees', employees: Array<{ __typename?: 'Employee', jobTitle: string, isPending: boolean, name: string, email: string, picture?: string | null, privilege: UserPrivileges, _id: string }>, employeesPending: Array<{ __typename?: 'Employee', jobTitle: string, isPending: boolean, email: string, name: string, picture?: string | null, privilege: UserPrivileges, _id: string }> } };

export type GetBusinessInformationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBusinessInformationQuery = { __typename?: 'Query', getBusinessInformation: { __typename?: 'Business', _id: string, name: string, description?: string | null, picture?: string | null, hoursOfOperation?: { __typename?: 'HoursOfOperation', Friday: { __typename?: 'WorkingHours', isOpen: boolean, hours?: { __typename?: 'Hours', close: string, open: string } | null }, Monday: { __typename?: 'WorkingHours', isOpen: boolean, hours?: { __typename?: 'Hours', close: string, open: string } | null }, Saturday: { __typename?: 'WorkingHours', isOpen: boolean, hours?: { __typename?: 'Hours', close: string, open: string } | null }, Sunday: { __typename?: 'WorkingHours', isOpen: boolean, hours?: { __typename?: 'Hours', close: string, open: string } | null }, Thursday: { __typename?: 'WorkingHours', isOpen: boolean, hours?: { __typename?: 'Hours', close: string, open: string } | null }, Tuesday: { __typename?: 'WorkingHours', isOpen: boolean, hours?: { __typename?: 'Hours', close: string, open: string } | null }, Wednesday: { __typename?: 'WorkingHours', isOpen: boolean, hours?: { __typename?: 'Hours', close: string, open: string } | null } } | null } };

export type GetBusinessLocationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBusinessLocationQuery = { __typename?: 'Query', getBusinessLocation?: { __typename?: 'Address', streetAddress: string, stateOrProvince: string, postalCode: string, country: string, complement?: string | null, city: string, _id: string } | null };

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

export type MakeCheckoutPaymentMutationVariables = Exact<{
  input: MakeCheckoutPaymentInput;
}>;


export type MakeCheckoutPaymentMutation = { __typename?: 'Mutation', makeCheckoutPayment: { __typename?: 'Checkout', _id: string, paid: boolean, totalPaid: number, total: number, tip: number, tax: number, tab: string, subTotal: number, status: CheckoutStatusKeys, payments: Array<{ __typename?: 'Payment', _id: string, amount: number, patron: string, splitType?: SplitType | null, tip: number } | null> } };

export type GetCheckoutByIdQueryVariables = Exact<{
  input: GetById;
}>;


export type GetCheckoutByIdQuery = { __typename?: 'Query', getCheckoutByID: { __typename?: 'Checkout', _id: string, business: string, created_date: string, paid: boolean, subTotal: number, totalPaid: number, total: number, tip: number, tax: number, tab: string, status: CheckoutStatusKeys, payments: Array<{ __typename?: 'Payment', amount: number, _id: string, splitType?: SplitType | null, patron: string, tip: number, discount: number } | null> } };

export type CreateMenuMutationVariables = Exact<{
  input: CreateMenuInput;
}>;


export type CreateMenuMutation = { __typename?: 'Mutation', createMenu: { __typename?: 'Menu', _id: string, name: string, sections?: Array<{ __typename?: 'Section', category: { __typename?: 'Category', name: string }, products?: Array<{ __typename?: 'Product', _id: string }> | null }> | null } };

export type DeleteMenuMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteMenuMutation = { __typename?: 'Mutation', deleteMenu: { __typename?: 'Menu', _id: string, name: string } };

export type GetAllMenusByBusinessIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllMenusByBusinessIdQuery = { __typename?: 'Query', getAllMenusByBusinessID: Array<{ __typename?: 'Menu', _id: string, name: string, sections?: Array<{ __typename?: 'Section', category: { __typename?: 'Category', _id: string, name: string }, products?: Array<{ __typename?: 'Product', _id: string, name: string, description?: string | null, imageUrl?: string | null, price: number }> | null }> | null }> };

export type GetMenuByIdQueryVariables = Exact<{
  input?: InputMaybe<GetMenuById>;
}>;


export type GetMenuByIdQuery = { __typename?: 'Query', getMenuByID: { __typename?: 'Menu', _id: string, name: string, sections?: Array<{ __typename?: 'Section', category: { __typename?: 'Category', _id: string, name: string }, products?: Array<{ __typename?: 'Product', _id: string, name: string, imageUrl?: string | null, price: number }> | null }> | null } };

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

export type OpenTabRequestMutationVariables = Exact<{
  input: OpenTabRequestInput;
}>;


export type OpenTabRequestMutation = { __typename?: 'Mutation', openTabRequest?: string | null };

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

export type RequestCloseTabMutationVariables = Exact<{
  input: GetById;
}>;


export type RequestCloseTabMutation = { __typename?: 'Mutation', requestCloseTab: { __typename?: 'Tab', _id: string, checkout?: string | null, status: TabStatus, users?: Array<{ __typename?: 'User', _id: string }> | null } };

export type GetTabByIdQueryVariables = Exact<{
  input: GetById;
}>;


export type GetTabByIdQuery = { __typename?: 'Query', getTabByID?: { __typename?: 'Tab', _id: string, admin: string, users?: Array<{ __typename?: 'User', _id: string }> | null, table: { __typename?: 'Table', _id: string, tableNumber: string }, orders: Array<{ __typename?: 'OrderDetail', _id: string, status: OrderStatus, quantity: number, subTotal: number, product: { __typename?: 'Product', imageUrl?: string | null, price: number, name: string } } | null> } | null };

export type GetTabCheckoutByIdQueryVariables = Exact<{
  input: GetById;
}>;


export type GetTabCheckoutByIdQuery = { __typename?: 'Query', getTabByID?: { __typename?: 'Tab', _id: string, status: TabStatus, users?: Array<{ __typename?: 'User', _id: string }> | null, orders: Array<{ __typename?: 'OrderDetail', user?: string | null, _id: string, subTotal: number } | null> } | null };

export type CreateTableMutationVariables = Exact<{
  input?: InputMaybe<CreateTableInput>;
}>;


export type CreateTableMutation = { __typename?: 'Mutation', createTable: { __typename?: 'Table', space: string, _id: string } };

export type CreateEmployeeAccountMutationVariables = Exact<{
  input: CreateEmployeeAccountInput;
}>;


export type CreateEmployeeAccountMutation = { __typename?: 'Mutation', createEmployeeAccount: { __typename?: 'User', token: string, name: string, email: string, _id: string, picture?: string | null } };

export type CreateUserMutationVariables = Exact<{
  input?: InputMaybe<UserInput>;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', _id: string, name: string, email: string, token: string } };

export type PasswordResetMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type PasswordResetMutation = { __typename?: 'Mutation', passwordReset: { __typename?: 'User', _id: string, email: string, name: string, token: string, picture?: string | null } };

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


export type UpdateUserInformationMutation = { __typename?: 'Mutation', updateUserInformation: { __typename?: 'User', _id: string, email: string, name: string, picture?: string | null, businesses: Array<{ __typename?: 'BusinessPrivileges', business: string, privilege: UserPrivileges }> } };

export type GetUserInformationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserInformationQuery = { __typename?: 'Query', getUserInformation?: { __typename?: 'User', _id: string, email: string, name: string, picture?: string | null, businesses: Array<{ __typename?: 'BusinessPrivileges', business: string, privilege: UserPrivileges }> } | null };


export const DeleteBusinessEmployeeDocument = gql`
    mutation DeleteBusinessEmployee($input: DeleteEmployee!) {
  deleteBusinessEmployee(input: $input)
}
    `;
export type DeleteBusinessEmployeeMutationFn = Apollo.MutationFunction<DeleteBusinessEmployeeMutation, DeleteBusinessEmployeeMutationVariables>;

/**
 * __useDeleteBusinessEmployeeMutation__
 *
 * To run a mutation, you first call `useDeleteBusinessEmployeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBusinessEmployeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBusinessEmployeeMutation, { data, loading, error }] = useDeleteBusinessEmployeeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteBusinessEmployeeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBusinessEmployeeMutation, DeleteBusinessEmployeeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBusinessEmployeeMutation, DeleteBusinessEmployeeMutationVariables>(DeleteBusinessEmployeeDocument, options);
      }
export type DeleteBusinessEmployeeMutationHookResult = ReturnType<typeof useDeleteBusinessEmployeeMutation>;
export type DeleteBusinessEmployeeMutationResult = Apollo.MutationResult<DeleteBusinessEmployeeMutation>;
export type DeleteBusinessEmployeeMutationOptions = Apollo.BaseMutationOptions<DeleteBusinessEmployeeMutation, DeleteBusinessEmployeeMutationVariables>;
export const ManageBusinessEmployeesDocument = gql`
    mutation ManageBusinessEmployees($input: ManageBusinessEmployeesInput!) {
  manageBusinessEmployees(input: $input) {
    email
    name
    picture
    privilege
  }
}
    `;
export type ManageBusinessEmployeesMutationFn = Apollo.MutationFunction<ManageBusinessEmployeesMutation, ManageBusinessEmployeesMutationVariables>;

/**
 * __useManageBusinessEmployeesMutation__
 *
 * To run a mutation, you first call `useManageBusinessEmployeesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useManageBusinessEmployeesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [manageBusinessEmployeesMutation, { data, loading, error }] = useManageBusinessEmployeesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useManageBusinessEmployeesMutation(baseOptions?: Apollo.MutationHookOptions<ManageBusinessEmployeesMutation, ManageBusinessEmployeesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ManageBusinessEmployeesMutation, ManageBusinessEmployeesMutationVariables>(ManageBusinessEmployeesDocument, options);
      }
export type ManageBusinessEmployeesMutationHookResult = ReturnType<typeof useManageBusinessEmployeesMutation>;
export type ManageBusinessEmployeesMutationResult = Apollo.MutationResult<ManageBusinessEmployeesMutation>;
export type ManageBusinessEmployeesMutationOptions = Apollo.BaseMutationOptions<ManageBusinessEmployeesMutation, ManageBusinessEmployeesMutationVariables>;
export const UpdateBusinessInformationDocument = gql`
    mutation UpdateBusinessInformation($input: UpdateBusinessInfoInput!) {
  updateBusinessInformation(input: $input) {
    name
    picture
    description
    _id
  }
}
    `;
export type UpdateBusinessInformationMutationFn = Apollo.MutationFunction<UpdateBusinessInformationMutation, UpdateBusinessInformationMutationVariables>;

/**
 * __useUpdateBusinessInformationMutation__
 *
 * To run a mutation, you first call `useUpdateBusinessInformationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBusinessInformationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBusinessInformationMutation, { data, loading, error }] = useUpdateBusinessInformationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateBusinessInformationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBusinessInformationMutation, UpdateBusinessInformationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBusinessInformationMutation, UpdateBusinessInformationMutationVariables>(UpdateBusinessInformationDocument, options);
      }
export type UpdateBusinessInformationMutationHookResult = ReturnType<typeof useUpdateBusinessInformationMutation>;
export type UpdateBusinessInformationMutationResult = Apollo.MutationResult<UpdateBusinessInformationMutation>;
export type UpdateBusinessInformationMutationOptions = Apollo.BaseMutationOptions<UpdateBusinessInformationMutation, UpdateBusinessInformationMutationVariables>;
export const UpdateBusinessLocationDocument = gql`
    mutation UpdateBusinessLocation($input: AddressInput!) {
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
export const GetAllEmployeesDocument = gql`
    query GetAllEmployees {
  getAllEmployees {
    employees {
      jobTitle
      isPending
      name
      email
      picture
      privilege
      _id
    }
    employeesPending {
      jobTitle
      isPending
      email
      name
      picture
      privilege
      _id
    }
  }
}
    `;

/**
 * __useGetAllEmployeesQuery__
 *
 * To run a query within a React component, call `useGetAllEmployeesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllEmployeesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllEmployeesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllEmployeesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllEmployeesQuery, GetAllEmployeesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllEmployeesQuery, GetAllEmployeesQueryVariables>(GetAllEmployeesDocument, options);
      }
export function useGetAllEmployeesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllEmployeesQuery, GetAllEmployeesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllEmployeesQuery, GetAllEmployeesQueryVariables>(GetAllEmployeesDocument, options);
        }
export type GetAllEmployeesQueryHookResult = ReturnType<typeof useGetAllEmployeesQuery>;
export type GetAllEmployeesLazyQueryHookResult = ReturnType<typeof useGetAllEmployeesLazyQuery>;
export type GetAllEmployeesQueryResult = Apollo.QueryResult<GetAllEmployeesQuery, GetAllEmployeesQueryVariables>;
export const GetBusinessInformationDocument = gql`
    query GetBusinessInformation {
  getBusinessInformation {
    _id
    name
    description
    picture
    hoursOfOperation {
      Friday {
        isOpen
        hours {
          close
          open
        }
      }
      Monday {
        isOpen
        hours {
          close
          open
        }
      }
      Saturday {
        isOpen
        hours {
          close
          open
        }
      }
      Sunday {
        isOpen
        hours {
          close
          open
        }
      }
      Thursday {
        isOpen
        hours {
          close
          open
        }
      }
      Tuesday {
        isOpen
        hours {
          close
          open
        }
      }
      Wednesday {
        isOpen
        hours {
          close
          open
        }
      }
    }
  }
}
    `;

/**
 * __useGetBusinessInformationQuery__
 *
 * To run a query within a React component, call `useGetBusinessInformationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBusinessInformationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBusinessInformationQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBusinessInformationQuery(baseOptions?: Apollo.QueryHookOptions<GetBusinessInformationQuery, GetBusinessInformationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBusinessInformationQuery, GetBusinessInformationQueryVariables>(GetBusinessInformationDocument, options);
      }
export function useGetBusinessInformationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBusinessInformationQuery, GetBusinessInformationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBusinessInformationQuery, GetBusinessInformationQueryVariables>(GetBusinessInformationDocument, options);
        }
export type GetBusinessInformationQueryHookResult = ReturnType<typeof useGetBusinessInformationQuery>;
export type GetBusinessInformationLazyQueryHookResult = ReturnType<typeof useGetBusinessInformationLazyQuery>;
export type GetBusinessInformationQueryResult = Apollo.QueryResult<GetBusinessInformationQuery, GetBusinessInformationQueryVariables>;
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
export const MakeCheckoutPaymentDocument = gql`
    mutation MakeCheckoutPayment($input: MakeCheckoutPaymentInput!) {
  makeCheckoutPayment(input: $input) {
    _id
    paid
    totalPaid
    total
    tip
    tax
    tab
    subTotal
    status
    payments {
      _id
      amount
      patron
      splitType
      tip
    }
  }
}
    `;
export type MakeCheckoutPaymentMutationFn = Apollo.MutationFunction<MakeCheckoutPaymentMutation, MakeCheckoutPaymentMutationVariables>;

/**
 * __useMakeCheckoutPaymentMutation__
 *
 * To run a mutation, you first call `useMakeCheckoutPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMakeCheckoutPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [makeCheckoutPaymentMutation, { data, loading, error }] = useMakeCheckoutPaymentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMakeCheckoutPaymentMutation(baseOptions?: Apollo.MutationHookOptions<MakeCheckoutPaymentMutation, MakeCheckoutPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MakeCheckoutPaymentMutation, MakeCheckoutPaymentMutationVariables>(MakeCheckoutPaymentDocument, options);
      }
export type MakeCheckoutPaymentMutationHookResult = ReturnType<typeof useMakeCheckoutPaymentMutation>;
export type MakeCheckoutPaymentMutationResult = Apollo.MutationResult<MakeCheckoutPaymentMutation>;
export type MakeCheckoutPaymentMutationOptions = Apollo.BaseMutationOptions<MakeCheckoutPaymentMutation, MakeCheckoutPaymentMutationVariables>;
export const GetCheckoutByIdDocument = gql`
    query GetCheckoutByID($input: GetById!) {
  getCheckoutByID(input: $input) {
    _id
    business
    created_date
    paid
    subTotal
    totalPaid
    total
    tip
    tax
    tab
    status
    payments {
      amount
      _id
      splitType
      patron
      tip
      discount
    }
  }
}
    `;

/**
 * __useGetCheckoutByIdQuery__
 *
 * To run a query within a React component, call `useGetCheckoutByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCheckoutByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCheckoutByIdQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetCheckoutByIdQuery(baseOptions: Apollo.QueryHookOptions<GetCheckoutByIdQuery, GetCheckoutByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCheckoutByIdQuery, GetCheckoutByIdQueryVariables>(GetCheckoutByIdDocument, options);
      }
export function useGetCheckoutByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCheckoutByIdQuery, GetCheckoutByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCheckoutByIdQuery, GetCheckoutByIdQueryVariables>(GetCheckoutByIdDocument, options);
        }
export type GetCheckoutByIdQueryHookResult = ReturnType<typeof useGetCheckoutByIdQuery>;
export type GetCheckoutByIdLazyQueryHookResult = ReturnType<typeof useGetCheckoutByIdLazyQuery>;
export type GetCheckoutByIdQueryResult = Apollo.QueryResult<GetCheckoutByIdQuery, GetCheckoutByIdQueryVariables>;
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
export const OpenTabRequestDocument = gql`
    mutation OpenTabRequest($input: OpenTabRequestInput!) {
  openTabRequest(input: $input)
}
    `;
export type OpenTabRequestMutationFn = Apollo.MutationFunction<OpenTabRequestMutation, OpenTabRequestMutationVariables>;

/**
 * __useOpenTabRequestMutation__
 *
 * To run a mutation, you first call `useOpenTabRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOpenTabRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [openTabRequestMutation, { data, loading, error }] = useOpenTabRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOpenTabRequestMutation(baseOptions?: Apollo.MutationHookOptions<OpenTabRequestMutation, OpenTabRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OpenTabRequestMutation, OpenTabRequestMutationVariables>(OpenTabRequestDocument, options);
      }
export type OpenTabRequestMutationHookResult = ReturnType<typeof useOpenTabRequestMutation>;
export type OpenTabRequestMutationResult = Apollo.MutationResult<OpenTabRequestMutation>;
export type OpenTabRequestMutationOptions = Apollo.BaseMutationOptions<OpenTabRequestMutation, OpenTabRequestMutationVariables>;
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
export const RequestCloseTabDocument = gql`
    mutation RequestCloseTab($input: GetById!) {
  requestCloseTab(input: $input) {
    _id
    checkout
    status
    users {
      _id
    }
  }
}
    `;
export type RequestCloseTabMutationFn = Apollo.MutationFunction<RequestCloseTabMutation, RequestCloseTabMutationVariables>;

/**
 * __useRequestCloseTabMutation__
 *
 * To run a mutation, you first call `useRequestCloseTabMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestCloseTabMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestCloseTabMutation, { data, loading, error }] = useRequestCloseTabMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRequestCloseTabMutation(baseOptions?: Apollo.MutationHookOptions<RequestCloseTabMutation, RequestCloseTabMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestCloseTabMutation, RequestCloseTabMutationVariables>(RequestCloseTabDocument, options);
      }
export type RequestCloseTabMutationHookResult = ReturnType<typeof useRequestCloseTabMutation>;
export type RequestCloseTabMutationResult = Apollo.MutationResult<RequestCloseTabMutation>;
export type RequestCloseTabMutationOptions = Apollo.BaseMutationOptions<RequestCloseTabMutation, RequestCloseTabMutationVariables>;
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
export const GetTabCheckoutByIdDocument = gql`
    query GetTabCheckoutByID($input: GetById!) {
  getTabByID(input: $input) {
    _id
    status
    users {
      _id
    }
    orders {
      user
      _id
      subTotal
    }
  }
}
    `;

/**
 * __useGetTabCheckoutByIdQuery__
 *
 * To run a query within a React component, call `useGetTabCheckoutByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTabCheckoutByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTabCheckoutByIdQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetTabCheckoutByIdQuery(baseOptions: Apollo.QueryHookOptions<GetTabCheckoutByIdQuery, GetTabCheckoutByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTabCheckoutByIdQuery, GetTabCheckoutByIdQueryVariables>(GetTabCheckoutByIdDocument, options);
      }
export function useGetTabCheckoutByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTabCheckoutByIdQuery, GetTabCheckoutByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTabCheckoutByIdQuery, GetTabCheckoutByIdQueryVariables>(GetTabCheckoutByIdDocument, options);
        }
export type GetTabCheckoutByIdQueryHookResult = ReturnType<typeof useGetTabCheckoutByIdQuery>;
export type GetTabCheckoutByIdLazyQueryHookResult = ReturnType<typeof useGetTabCheckoutByIdLazyQuery>;
export type GetTabCheckoutByIdQueryResult = Apollo.QueryResult<GetTabCheckoutByIdQuery, GetTabCheckoutByIdQueryVariables>;
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
export const CreateEmployeeAccountDocument = gql`
    mutation CreateEmployeeAccount($input: CreateEmployeeAccountInput!) {
  createEmployeeAccount(input: $input) {
    token
    name
    email
    _id
    picture
  }
}
    `;
export type CreateEmployeeAccountMutationFn = Apollo.MutationFunction<CreateEmployeeAccountMutation, CreateEmployeeAccountMutationVariables>;

/**
 * __useCreateEmployeeAccountMutation__
 *
 * To run a mutation, you first call `useCreateEmployeeAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEmployeeAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEmployeeAccountMutation, { data, loading, error }] = useCreateEmployeeAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEmployeeAccountMutation(baseOptions?: Apollo.MutationHookOptions<CreateEmployeeAccountMutation, CreateEmployeeAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEmployeeAccountMutation, CreateEmployeeAccountMutationVariables>(CreateEmployeeAccountDocument, options);
      }
export type CreateEmployeeAccountMutationHookResult = ReturnType<typeof useCreateEmployeeAccountMutation>;
export type CreateEmployeeAccountMutationResult = Apollo.MutationResult<CreateEmployeeAccountMutation>;
export type CreateEmployeeAccountMutationOptions = Apollo.BaseMutationOptions<CreateEmployeeAccountMutation, CreateEmployeeAccountMutationVariables>;
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
export const PasswordResetDocument = gql`
    mutation PasswordReset($input: ResetPasswordInput!) {
  passwordReset(input: $input) {
    _id
    email
    name
    token
    picture
  }
}
    `;
export type PasswordResetMutationFn = Apollo.MutationFunction<PasswordResetMutation, PasswordResetMutationVariables>;

/**
 * __usePasswordResetMutation__
 *
 * To run a mutation, you first call `usePasswordResetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePasswordResetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [passwordResetMutation, { data, loading, error }] = usePasswordResetMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePasswordResetMutation(baseOptions?: Apollo.MutationHookOptions<PasswordResetMutation, PasswordResetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PasswordResetMutation, PasswordResetMutationVariables>(PasswordResetDocument, options);
      }
export type PasswordResetMutationHookResult = ReturnType<typeof usePasswordResetMutation>;
export type PasswordResetMutationResult = Apollo.MutationResult<PasswordResetMutation>;
export type PasswordResetMutationOptions = Apollo.BaseMutationOptions<PasswordResetMutation, PasswordResetMutationVariables>;
export const PostUserLoginDocument = gql`
    mutation PostUserLogin($input: LoginInput!) {
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
    _id
    email
    name
    picture
    businesses {
      business
      privilege
    }
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
export const GetUserInformationDocument = gql`
    query GetUserInformation {
  getUserInformation {
    _id
    email
    name
    picture
    businesses {
      business
      privilege
    }
  }
}
    `;

/**
 * __useGetUserInformationQuery__
 *
 * To run a query within a React component, call `useGetUserInformationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserInformationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserInformationQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserInformationQuery(baseOptions?: Apollo.QueryHookOptions<GetUserInformationQuery, GetUserInformationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserInformationQuery, GetUserInformationQueryVariables>(GetUserInformationDocument, options);
      }
export function useGetUserInformationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserInformationQuery, GetUserInformationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserInformationQuery, GetUserInformationQueryVariables>(GetUserInformationDocument, options);
        }
export type GetUserInformationQueryHookResult = ReturnType<typeof useGetUserInformationQuery>;
export type GetUserInformationLazyQueryHookResult = ReturnType<typeof useGetUserInformationLazyQuery>;
export type GetUserInformationQueryResult = Apollo.QueryResult<GetUserInformationQuery, GetUserInformationQueryVariables>;