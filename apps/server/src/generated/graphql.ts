import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '../graphql/resolvers/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export type AcceptTabRequestInput = {
  request: Scalars['ID'];
  table?: InputMaybe<Scalars['String']>;
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

export type Balance = {
  __typename?: 'Balance';
  balanceAvailable: Scalars['Float'];
  balanceCurrency: Scalars['String'];
  balancePending: Scalars['Float'];
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
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

export enum BusinessType {
  Company = 'company',
  Individual = 'individual'
}

export type CartItem = {
  __typename?: 'CartItem';
  _id: Scalars['ID'];
  notes?: Maybe<Scalars['String']>;
  options?: Maybe<Array<Maybe<Scalars['String']>>>;
  product: Product;
  quantity: Scalars['Int'];
  subTotal: Scalars['Float'];
  tab: Tab;
  user: User;
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
  discount?: Maybe<Scalars['Float']>;
  orders: Array<Maybe<OrderDetail>>;
  paid: Scalars['Boolean'];
  payments: Array<Maybe<Payment>>;
  splitType?: Maybe<SplitType>;
  status: CheckoutStatusKeys;
  subTotal: Scalars['Float'];
  tab: Scalars['ID'];
  tax: Scalars['Float'];
  tip?: Maybe<Scalars['Float']>;
  total: Scalars['Float'];
  totalPaid: Scalars['Float'];
};

export enum CheckoutStatusKeys {
  Canceled = 'Canceled',
  Paid = 'Paid',
  PartiallyPaid = 'PartiallyPaid',
  Pending = 'Pending'
}

export type ClientCreateOrderInput = {
  cartItem: Scalars['ID'];
  quantity: Scalars['Int'];
  user: Scalars['ID'];
};

export type ClientSession = {
  __typename?: 'ClientSession';
  request: Request;
  tab?: Maybe<Tab>;
  user: User;
};

export type ConfirmPaymentInput = {
  payment: Scalars['ID'];
};

export type ConnectExpressInput = {
  business_type: BusinessType;
};

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

export type CreateNewTakeoutOrDeliveryInput = {
  business: Scalars['ID'];
  name: Scalars['String'];
  phoneNumber: Scalars['String'];
  type: TakeoutDelivery;
};

export type CreateOrderInput = {
  message?: InputMaybe<Scalars['String']>;
  product: Scalars['ID'];
  quantity: Scalars['Int'];
  tab?: InputMaybe<Scalars['ID']>;
  user?: InputMaybe<Scalars['ID']>;
};

export type CreateProductInput = {
  addons?: InputMaybe<Array<InputMaybe<CreateProductInput>>>;
  category: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  file?: InputMaybe<Scalars['Upload']>;
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

export type CustomSplitInput = {
  amount: Scalars['Float'];
  patron: Scalars['ID'];
};

export type CustomerRequestPayFullInput = {
  checkout: Scalars['ID'];
  patron: Scalars['ID'];
  tip: Scalars['Float'];
};

export type CustomerRequestSplitInput = {
  checkout: Scalars['ID'];
  customSplit?: InputMaybe<Array<CustomSplitInput>>;
  selectedUsers: Array<Scalars['String']>;
  splitType: SplitType;
  tip: Scalars['Float'];
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

export type GetMenu = {
  _id?: InputMaybe<Scalars['ID']>;
  business: Scalars['ID'];
};

export type GetMenuById = {
  id: Scalars['ID'];
};

export type GetTabRequestInput = {
  filterBy?: InputMaybe<RequestStatus>;
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

export enum IsoCountry {
  Br = 'BR',
  Us = 'US'
}

export type JoinTabForm = {
  admin: Scalars['ID'];
  business: Scalars['ID'];
  name: Scalars['String'];
  phoneNumber: Scalars['String'];
  tab: Scalars['ID'];
};

export type LinkCategoryToProductInput = {
  category: Scalars['ID'];
  products: Array<InputMaybe<Scalars['String']>>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MakeCheckoutFullPaymentInput = {
  amount: Scalars['Float'];
  checkout: Scalars['ID'];
  discount: Scalars['Float'];
  patron: Scalars['ID'];
  paymentMethod?: InputMaybe<Scalars['String']>;
  splitType?: InputMaybe<SplitType>;
  tip: Scalars['Float'];
};

export type MakeCheckoutPaymentInput = {
  checkout: Scalars['ID'];
  payment: Scalars['ID'];
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
  isFavorite?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  sections?: Maybe<Array<Section>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  acceptInvitation: Request;
  acceptTabRequest?: Maybe<Request>;
  addItemToCart: CartItem;
  clientCreateMultipleOrderDetails: Array<OrderDetail>;
  confirmPayment: Scalars['Boolean'];
  connectExpressPayment: Scalars['String'];
  createAddress?: Maybe<Address>;
  createBusiness?: Maybe<CreateBusinessPayload>;
  createCategory?: Maybe<Category>;
  createEmployeeAccount: User;
  createMenu: Menu;
  createMultipleOrderDetails: Array<OrderDetail>;
  createNewTakeoutOrDelivery: Scalars['String'];
  createOrdersCheckout: Checkout;
  createProduct: Product;
  createSpace: Space;
  createTab: Tab;
  createTable: Table;
  createUser: User;
  customerRequestPayFull: Checkout;
  customerRequestSplit: Checkout;
  declineInvitation: Request;
  declineTabRequest: Request;
  deleteBusiness?: Maybe<DeleteBusinessPayload>;
  deleteBusinessEmployee: Scalars['ID'];
  deleteCategory?: Maybe<RequestResponseOk>;
  deleteItemFromCart: CartItem;
  deleteMenu: Menu;
  deleteOrderDetail: OrderDetail;
  deleteProduct?: Maybe<RequestResponseOk>;
  deleteSpace: Space;
  deleteTab?: Maybe<Tab>;
  deleteTable: RequestResponseOk;
  deleteUser: RequestResponseOk;
  generatePaymentIntent: PaymentIntent;
  generateStripePayout: Scalars['Boolean'];
  linkCategoryToProducts?: Maybe<Category>;
  makeCheckoutFullPayment: Checkout;
  makeCheckoutPayment: Checkout;
  manageBusinessEmployees: Employee;
  openTabRequest?: Maybe<Scalars['String']>;
  passwordReset: User;
  postUserLogin: User;
  recoverPassword?: Maybe<RequestResponseOk>;
  requestCloseTab: Tab;
  requestJoinTab?: Maybe<Scalars['String']>;
  requestUserAccountCreation: AccountCreationResponse;
  shareQRCode: Scalars['Boolean'];
  updateAddress?: Maybe<Address>;
  updateBusinessInformation: Business;
  updateBusinessLocation?: Maybe<Business>;
  updateBusinessToken?: Maybe<Scalars['String']>;
  updateCategory?: Maybe<Category>;
  updateItemFromCart: CartItem;
  updateMenu?: Maybe<Menu>;
  updateMenuInfo: Menu;
  updateOrderDetail: OrderDetail;
  updateProductByID: Product;
  updateSpace: Space;
  updateTab: Tab;
  updateUserInformation: User;
  uploadFile: Scalars['String'];
};


export type MutationAcceptInvitationArgs = {
  input: GetById;
};


export type MutationAcceptTabRequestArgs = {
  input: AcceptTabRequestInput;
};


export type MutationAddItemToCartArgs = {
  input: AddItemToCartInput;
};


export type MutationClientCreateMultipleOrderDetailsArgs = {
  input: Array<ClientCreateOrderInput>;
};


export type MutationConfirmPaymentArgs = {
  input: ConfirmPaymentInput;
};


export type MutationConnectExpressPaymentArgs = {
  input: ConnectExpressInput;
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


export type MutationCreateNewTakeoutOrDeliveryArgs = {
  input: CreateNewTakeoutOrDeliveryInput;
};


export type MutationCreateOrdersCheckoutArgs = {
  input: Array<OrderDetailInput>;
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


export type MutationCustomerRequestPayFullArgs = {
  input: CustomerRequestPayFullInput;
};


export type MutationCustomerRequestSplitArgs = {
  input: CustomerRequestSplitInput;
};


export type MutationDeclineInvitationArgs = {
  input: GetById;
};


export type MutationDeclineTabRequestArgs = {
  input: GetById;
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


export type MutationDeleteItemFromCartArgs = {
  input: DeleteItemFromCartInput;
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


export type MutationGeneratePaymentIntentArgs = {
  input: GeneratePaymentIntentInput;
};


export type MutationLinkCategoryToProductsArgs = {
  input: LinkCategoryToProductInput;
};


export type MutationMakeCheckoutFullPaymentArgs = {
  input: MakeCheckoutFullPaymentInput;
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
  input?: InputMaybe<GetById>;
};


export type MutationRequestJoinTabArgs = {
  input: JoinTabForm;
};


export type MutationRequestUserAccountCreationArgs = {
  input: RequestUserAccountInput;
};


export type MutationShareQrCodeArgs = {
  input: ShareQrCodeInput;
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


export type MutationUpdateItemFromCartArgs = {
  input: UpdateItemFromCartInput;
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
  business: Scalars['ID'];
  name: Scalars['String'];
  names?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  phoneNumber: Scalars['String'];
  totalGuests: Scalars['Int'];
};

export type OrderDetail = {
  __typename?: 'OrderDetail';
  _id: Scalars['ID'];
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
  discount?: Maybe<Scalars['Float']>;
  paid: Scalars['Boolean'];
  patron: Scalars['ID'];
  splitType?: Maybe<SplitType>;
  tip: Scalars['Float'];
};

export type PaymentIntent = {
  __typename?: 'PaymentIntent';
  amount: Scalars['Float'];
  clientSecret?: Maybe<Scalars['ID']>;
  currency: Scalars['String'];
  paymentIntent: Scalars['ID'];
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
  createStripeAccessLink?: Maybe<Scalars['String']>;
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
  getBusinessById: Business;
  getBusinessInformation: Business;
  getBusinessLocation?: Maybe<Address>;
  getCartItemsPerTab: Array<CartItem>;
  getCategoryByID?: Maybe<Category>;
  getCheckoutByID: Checkout;
  getCheckoutsByBusiness: Array<Checkout>;
  getClientInformation: User;
  getClientMenu?: Maybe<Menu>;
  getClientSession: ClientSession;
  getIsConnected?: Maybe<Balance>;
  getMenuByID: Menu;
  getOrderDetailByID?: Maybe<OrderDetail>;
  getOrdersByCheckout: Checkout;
  getOrdersBySession: Array<OrderDetail>;
  getPendingInvitations: Array<Request>;
  getProductByID?: Maybe<Product>;
  getSpacesFromBusiness?: Maybe<Array<Space>>;
  getTabByID: Tab;
  getTabRequest: Request;
  getTabRequests: Array<Request>;
  getTableById: Table;
  getTablesFromSpace: Array<Table>;
  getToken?: Maybe<User>;
  getUserInformation?: Maybe<User>;
};


export type QueryGetAddressArgs = {
  id: Scalars['ID'];
};


export type QueryGetAllOrderDetailsByOrderIdArgs = {
  orderID: Scalars['ID'];
};


export type QueryGetBusinessByIdArgs = {
  input: GetById;
};


export type QueryGetCategoryByIdArgs = {
  id: Scalars['ID'];
};


export type QueryGetCheckoutByIdArgs = {
  input: GetById;
};


export type QueryGetClientMenuArgs = {
  input: GetMenu;
};


export type QueryGetMenuByIdArgs = {
  input?: InputMaybe<GetMenuById>;
};


export type QueryGetOrderDetailByIdArgs = {
  orderDetailID: Scalars['ID'];
};


export type QueryGetOrdersByCheckoutArgs = {
  input: GetById;
};


export type QueryGetProductByIdArgs = {
  productID: Scalars['ID'];
};


export type QueryGetTabByIdArgs = {
  input: GetById;
};


export type QueryGetTabRequestsArgs = {
  input?: InputMaybe<GetTabRequestInput>;
};


export type QueryGetTableByIdArgs = {
  input: GetById;
};


export type QueryGetTablesFromSpaceArgs = {
  input: GetById;
};

export type Request = {
  __typename?: 'Request';
  _id: Scalars['ID'];
  admin?: Maybe<User>;
  business?: Maybe<Scalars['ID']>;
  names?: Maybe<Array<Maybe<Scalars['String']>>>;
  requestor?: Maybe<User>;
  status: RequestStatus;
  tab?: Maybe<Scalars['ID']>;
  totalGuests?: Maybe<Scalars['Int']>;
};

export type RequestResponseOk = {
  __typename?: 'RequestResponseOK';
  ok?: Maybe<Scalars['Boolean']>;
};

export enum RequestStatus {
  Accepted = 'Accepted',
  Canceled = 'Canceled',
  Completed = 'Completed',
  Expired = 'Expired',
  Pending = 'Pending',
  Rejected = 'Rejected'
}

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
  products: Array<Product>;
};

export type SectionInput = {
  name: Scalars['String'];
  products: Array<Scalars['String']>;
};

export type ShareQrCodeInput = {
  email: Scalars['String'];
  file: Scalars['Upload'];
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
  Equally = 'Equally',
  Full = 'Full'
}

export type Subscription = {
  __typename?: 'Subscription';
  _empty?: Maybe<Scalars['String']>;
  numberIncremented: Scalars['Int'];
  onTabRequest: Request;
  onTabRequestResponse: Request;
};

export type Tab = {
  __typename?: 'Tab';
  _id: Scalars['ID'];
  admin: Scalars['ID'];
  cartItems: Array<Scalars['ID']>;
  checkout?: Maybe<Scalars['ID']>;
  orders: Array<OrderDetail>;
  status: TabStatus;
  table?: Maybe<Table>;
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

export enum TakeoutDelivery {
  Delivery = 'Delivery',
  Takeout = 'Takeout'
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
  isFavorite?: InputMaybe<Scalars['Boolean']>;
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
  file?: InputMaybe<Scalars['Upload']>;
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
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
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

export type AddItemToCartInput = {
  notes?: InputMaybe<Scalars['String']>;
  options?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  product: Scalars['ID'];
  quantity: Scalars['Int'];
};

export type DeleteItemFromCartInput = {
  cartItem: Scalars['ID'];
};

export type GeneratePaymentIntentInput = {
  payment: Scalars['ID'];
};

export type UpdateItemFromCartInput = {
  cartItem: Scalars['ID'];
  quantity: Scalars['Int'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AcceptTabRequestInput: AcceptTabRequestInput;
  AccountCreationResponse: ResolverTypeWrapper<AccountCreationResponse>;
  Address: ResolverTypeWrapper<Address>;
  AddressInput: AddressInput;
  Balance: ResolverTypeWrapper<Balance>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Business: ResolverTypeWrapper<Business>;
  BusinessInput: BusinessInput;
  BusinessPrivileges: ResolverTypeWrapper<BusinessPrivileges>;
  BusinessType: BusinessType;
  CartItem: ResolverTypeWrapper<CartItem>;
  Category: ResolverTypeWrapper<Category>;
  CategoryInput: CategoryInput;
  Checkout: ResolverTypeWrapper<Checkout>;
  CheckoutStatusKeys: CheckoutStatusKeys;
  ClientCreateOrderInput: ClientCreateOrderInput;
  ClientSession: ResolverTypeWrapper<ClientSession>;
  ConfirmPaymentInput: ConfirmPaymentInput;
  ConnectExpressInput: ConnectExpressInput;
  CreateBusinessPayload: ResolverTypeWrapper<CreateBusinessPayload>;
  CreateEmployeeAccountInput: CreateEmployeeAccountInput;
  CreateMenuInput: CreateMenuInput;
  CreateNewTakeoutOrDeliveryInput: CreateNewTakeoutOrDeliveryInput;
  CreateOrderInput: CreateOrderInput;
  CreateProductInput: CreateProductInput;
  CreateSpaceInput: CreateSpaceInput;
  CreateTabInput: CreateTabInput;
  CreateTableInput: CreateTableInput;
  CustomSplitInput: CustomSplitInput;
  CustomerRequestPayFullInput: CustomerRequestPayFullInput;
  CustomerRequestSplitInput: CustomerRequestSplitInput;
  DaysOfWeek: DaysOfWeek;
  DeleteBusinessPayload: ResolverTypeWrapper<DeleteBusinessPayload>;
  DeleteEmployee: DeleteEmployee;
  DeleteSpaceInput: DeleteSpaceInput;
  DeleteTableInput: DeleteTableInput;
  Employee: ResolverTypeWrapper<Employee>;
  Employees: ResolverTypeWrapper<Employees>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Geo: ResolverTypeWrapper<Geo>;
  GetById: GetById;
  GetMenu: GetMenu;
  GetMenuById: GetMenuById;
  GetTabRequestInput: GetTabRequestInput;
  Hours: ResolverTypeWrapper<Hours>;
  HoursInput: HoursInput;
  HoursOfOperation: ResolverTypeWrapper<HoursOfOperation>;
  HoursOfOperationInput: HoursOfOperationInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  ISOCountry: IsoCountry;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JoinTabForm: JoinTabForm;
  LinkCategoryToProductInput: LinkCategoryToProductInput;
  LoginInput: LoginInput;
  MakeCheckoutFullPaymentInput: MakeCheckoutFullPaymentInput;
  MakeCheckoutPaymentInput: MakeCheckoutPaymentInput;
  ManageBusinessEmployeesInput: ManageBusinessEmployeesInput;
  Menu: ResolverTypeWrapper<Menu>;
  Mutation: ResolverTypeWrapper<{}>;
  OpenTabRequestInput: OpenTabRequestInput;
  OrderDetail: ResolverTypeWrapper<OrderDetail>;
  OrderDetailInput: OrderDetailInput;
  OrderStatus: OrderStatus;
  Payment: ResolverTypeWrapper<Payment>;
  PaymentIntent: ResolverTypeWrapper<PaymentIntent>;
  Product: ResolverTypeWrapper<Product>;
  Query: ResolverTypeWrapper<{}>;
  Request: ResolverTypeWrapper<Request>;
  RequestResponseOK: ResolverTypeWrapper<RequestResponseOk>;
  RequestStatus: RequestStatus;
  RequestUserAccountInput: RequestUserAccountInput;
  ResetPasswordInput: ResetPasswordInput;
  Section: ResolverTypeWrapper<Section>;
  SectionInput: SectionInput;
  ShareQRCodeInput: ShareQrCodeInput;
  Space: ResolverTypeWrapper<Space>;
  SplitType: SplitType;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  Tab: ResolverTypeWrapper<Tab>;
  TabStatus: TabStatus;
  Table: ResolverTypeWrapper<Table>;
  TableStatus: TableStatus;
  TakeoutDelivery: TakeoutDelivery;
  UpdateAddressInput: UpdateAddressInput;
  UpdateBusinessInfoInput: UpdateBusinessInfoInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateMenuInfoInput: UpdateMenuInfoInput;
  UpdateMenuInput: UpdateMenuInput;
  UpdateOrderDetailInput: UpdateOrderDetailInput;
  UpdateProductInput: UpdateProductInput;
  UpdateSectionInput: UpdateSectionInput;
  UpdateSpaceInput: UpdateSpaceInput;
  UpdateTabInput: UpdateTabInput;
  UpdateUserInput: UpdateUserInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  User: ResolverTypeWrapper<User>;
  UserInput: UserInput;
  UserPrivileges: UserPrivileges;
  WorkingHours: ResolverTypeWrapper<WorkingHours>;
  WorkingHoursInput: WorkingHoursInput;
  addItemToCartInput: AddItemToCartInput;
  deleteItemFromCartInput: DeleteItemFromCartInput;
  generatePaymentIntentInput: GeneratePaymentIntentInput;
  updateItemFromCartInput: UpdateItemFromCartInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AcceptTabRequestInput: AcceptTabRequestInput;
  AccountCreationResponse: AccountCreationResponse;
  Address: Address;
  AddressInput: AddressInput;
  Balance: Balance;
  Boolean: Scalars['Boolean'];
  Business: Business;
  BusinessInput: BusinessInput;
  BusinessPrivileges: BusinessPrivileges;
  CartItem: CartItem;
  Category: Category;
  CategoryInput: CategoryInput;
  Checkout: Checkout;
  ClientCreateOrderInput: ClientCreateOrderInput;
  ClientSession: ClientSession;
  ConfirmPaymentInput: ConfirmPaymentInput;
  ConnectExpressInput: ConnectExpressInput;
  CreateBusinessPayload: CreateBusinessPayload;
  CreateEmployeeAccountInput: CreateEmployeeAccountInput;
  CreateMenuInput: CreateMenuInput;
  CreateNewTakeoutOrDeliveryInput: CreateNewTakeoutOrDeliveryInput;
  CreateOrderInput: CreateOrderInput;
  CreateProductInput: CreateProductInput;
  CreateSpaceInput: CreateSpaceInput;
  CreateTabInput: CreateTabInput;
  CreateTableInput: CreateTableInput;
  CustomSplitInput: CustomSplitInput;
  CustomerRequestPayFullInput: CustomerRequestPayFullInput;
  CustomerRequestSplitInput: CustomerRequestSplitInput;
  DeleteBusinessPayload: DeleteBusinessPayload;
  DeleteEmployee: DeleteEmployee;
  DeleteSpaceInput: DeleteSpaceInput;
  DeleteTableInput: DeleteTableInput;
  Employee: Employee;
  Employees: Employees;
  Float: Scalars['Float'];
  Geo: Geo;
  GetById: GetById;
  GetMenu: GetMenu;
  GetMenuById: GetMenuById;
  GetTabRequestInput: GetTabRequestInput;
  Hours: Hours;
  HoursInput: HoursInput;
  HoursOfOperation: HoursOfOperation;
  HoursOfOperationInput: HoursOfOperationInput;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  JoinTabForm: JoinTabForm;
  LinkCategoryToProductInput: LinkCategoryToProductInput;
  LoginInput: LoginInput;
  MakeCheckoutFullPaymentInput: MakeCheckoutFullPaymentInput;
  MakeCheckoutPaymentInput: MakeCheckoutPaymentInput;
  ManageBusinessEmployeesInput: ManageBusinessEmployeesInput;
  Menu: Menu;
  Mutation: {};
  OpenTabRequestInput: OpenTabRequestInput;
  OrderDetail: OrderDetail;
  OrderDetailInput: OrderDetailInput;
  Payment: Payment;
  PaymentIntent: PaymentIntent;
  Product: Product;
  Query: {};
  Request: Request;
  RequestResponseOK: RequestResponseOk;
  RequestUserAccountInput: RequestUserAccountInput;
  ResetPasswordInput: ResetPasswordInput;
  Section: Section;
  SectionInput: SectionInput;
  ShareQRCodeInput: ShareQrCodeInput;
  Space: Space;
  String: Scalars['String'];
  Subscription: {};
  Tab: Tab;
  Table: Table;
  UpdateAddressInput: UpdateAddressInput;
  UpdateBusinessInfoInput: UpdateBusinessInfoInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateMenuInfoInput: UpdateMenuInfoInput;
  UpdateMenuInput: UpdateMenuInput;
  UpdateOrderDetailInput: UpdateOrderDetailInput;
  UpdateProductInput: UpdateProductInput;
  UpdateSectionInput: UpdateSectionInput;
  UpdateSpaceInput: UpdateSpaceInput;
  UpdateTabInput: UpdateTabInput;
  UpdateUserInput: UpdateUserInput;
  Upload: Scalars['Upload'];
  User: User;
  UserInput: UserInput;
  WorkingHours: WorkingHours;
  WorkingHoursInput: WorkingHoursInput;
  addItemToCartInput: AddItemToCartInput;
  deleteItemFromCartInput: DeleteItemFromCartInput;
  generatePaymentIntentInput: GeneratePaymentIntentInput;
  updateItemFromCartInput: UpdateItemFromCartInput;
};

export type AccountCreationResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AccountCreationResponse'] = ResolversParentTypes['AccountCreationResponse']> = {
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AddressResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  complement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postalCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stateOrProvince?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  streetAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BalanceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Balance'] = ResolversParentTypes['Balance']> = {
  balanceAvailable?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  balanceCurrency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  balancePending?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BusinessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Business'] = ResolversParentTypes['Business']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  cuisine?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employees?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  hoursOfOperation?: Resolver<Maybe<ResolversTypes['HoursOfOperation']>, ParentType, ContextType>;
  menus?: Resolver<Maybe<Array<ResolversTypes['Menu']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  picture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price_range?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  website?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BusinessPrivilegesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['BusinessPrivileges'] = ResolversParentTypes['BusinessPrivileges']> = {
  business?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  privilege?: Resolver<ResolversTypes['UserPrivileges'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CartItemResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CartItem'] = ResolversParentTypes['CartItem']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  options?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  subTotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tab?: Resolver<ResolversTypes['Tab'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parentCategory?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  products?: Resolver<Maybe<Array<Maybe<ResolversTypes['Product']>>>, ParentType, ContextType>;
  subCategories?: Resolver<Maybe<Array<Maybe<ResolversTypes['Category']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CheckoutResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Checkout'] = ResolversParentTypes['Checkout']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  business?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  created_date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  discount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  orders?: Resolver<Array<Maybe<ResolversTypes['OrderDetail']>>, ParentType, ContextType>;
  paid?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  payments?: Resolver<Array<Maybe<ResolversTypes['Payment']>>, ParentType, ContextType>;
  splitType?: Resolver<Maybe<ResolversTypes['SplitType']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['CheckoutStatusKeys'], ParentType, ContextType>;
  subTotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tab?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tax?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tip?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalPaid?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClientSessionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ClientSession'] = ResolversParentTypes['ClientSession']> = {
  request?: Resolver<ResolversTypes['Request'], ParentType, ContextType>;
  tab?: Resolver<Maybe<ResolversTypes['Tab']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateBusinessPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateBusinessPayload'] = ResolversParentTypes['CreateBusinessPayload']> = {
  business?: Resolver<ResolversTypes['Business'], ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteBusinessPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteBusinessPayload'] = ResolversParentTypes['DeleteBusinessPayload']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmployeeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Employee'] = ResolversParentTypes['Employee']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isPending?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  jobTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  picture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  privilege?: Resolver<ResolversTypes['UserPrivileges'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmployeesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Employees'] = ResolversParentTypes['Employees']> = {
  employees?: Resolver<Array<ResolversTypes['Employee']>, ParentType, ContextType>;
  employeesPending?: Resolver<Array<ResolversTypes['Employee']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GeoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Geo'] = ResolversParentTypes['Geo']> = {
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lng?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HoursResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Hours'] = ResolversParentTypes['Hours']> = {
  close?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  open?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HoursOfOperationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['HoursOfOperation'] = ResolversParentTypes['HoursOfOperation']> = {
  Friday?: Resolver<ResolversTypes['WorkingHours'], ParentType, ContextType>;
  Monday?: Resolver<ResolversTypes['WorkingHours'], ParentType, ContextType>;
  Saturday?: Resolver<ResolversTypes['WorkingHours'], ParentType, ContextType>;
  Sunday?: Resolver<ResolversTypes['WorkingHours'], ParentType, ContextType>;
  Thursday?: Resolver<ResolversTypes['WorkingHours'], ParentType, ContextType>;
  Tuesday?: Resolver<ResolversTypes['WorkingHours'], ParentType, ContextType>;
  Wednesday?: Resolver<ResolversTypes['WorkingHours'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MenuResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Menu'] = ResolversParentTypes['Menu']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isFavorite?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sections?: Resolver<Maybe<Array<ResolversTypes['Section']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  acceptInvitation?: Resolver<ResolversTypes['Request'], ParentType, ContextType, RequireFields<MutationAcceptInvitationArgs, 'input'>>;
  acceptTabRequest?: Resolver<Maybe<ResolversTypes['Request']>, ParentType, ContextType, RequireFields<MutationAcceptTabRequestArgs, 'input'>>;
  addItemToCart?: Resolver<ResolversTypes['CartItem'], ParentType, ContextType, RequireFields<MutationAddItemToCartArgs, 'input'>>;
  clientCreateMultipleOrderDetails?: Resolver<Array<ResolversTypes['OrderDetail']>, ParentType, ContextType, RequireFields<MutationClientCreateMultipleOrderDetailsArgs, 'input'>>;
  confirmPayment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConfirmPaymentArgs, 'input'>>;
  connectExpressPayment?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationConnectExpressPaymentArgs, 'input'>>;
  createAddress?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType, RequireFields<MutationCreateAddressArgs, 'input'>>;
  createBusiness?: Resolver<Maybe<ResolversTypes['CreateBusinessPayload']>, ParentType, ContextType, RequireFields<MutationCreateBusinessArgs, 'input'>>;
  createCategory?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, Partial<MutationCreateCategoryArgs>>;
  createEmployeeAccount?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateEmployeeAccountArgs, 'input'>>;
  createMenu?: Resolver<ResolversTypes['Menu'], ParentType, ContextType, RequireFields<MutationCreateMenuArgs, 'input'>>;
  createMultipleOrderDetails?: Resolver<Array<ResolversTypes['OrderDetail']>, ParentType, ContextType, RequireFields<MutationCreateMultipleOrderDetailsArgs, 'input'>>;
  createNewTakeoutOrDelivery?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationCreateNewTakeoutOrDeliveryArgs, 'input'>>;
  createOrdersCheckout?: Resolver<ResolversTypes['Checkout'], ParentType, ContextType, RequireFields<MutationCreateOrdersCheckoutArgs, 'input'>>;
  createProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'input'>>;
  createSpace?: Resolver<ResolversTypes['Space'], ParentType, ContextType, Partial<MutationCreateSpaceArgs>>;
  createTab?: Resolver<ResolversTypes['Tab'], ParentType, ContextType, RequireFields<MutationCreateTabArgs, 'input'>>;
  createTable?: Resolver<ResolversTypes['Table'], ParentType, ContextType, Partial<MutationCreateTableArgs>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, Partial<MutationCreateUserArgs>>;
  customerRequestPayFull?: Resolver<ResolversTypes['Checkout'], ParentType, ContextType, RequireFields<MutationCustomerRequestPayFullArgs, 'input'>>;
  customerRequestSplit?: Resolver<ResolversTypes['Checkout'], ParentType, ContextType, RequireFields<MutationCustomerRequestSplitArgs, 'input'>>;
  declineInvitation?: Resolver<ResolversTypes['Request'], ParentType, ContextType, RequireFields<MutationDeclineInvitationArgs, 'input'>>;
  declineTabRequest?: Resolver<ResolversTypes['Request'], ParentType, ContextType, RequireFields<MutationDeclineTabRequestArgs, 'input'>>;
  deleteBusiness?: Resolver<Maybe<ResolversTypes['DeleteBusinessPayload']>, ParentType, ContextType, RequireFields<MutationDeleteBusinessArgs, 'businessID'>>;
  deleteBusinessEmployee?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationDeleteBusinessEmployeeArgs, 'input'>>;
  deleteCategory?: Resolver<Maybe<ResolversTypes['RequestResponseOK']>, ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteItemFromCart?: Resolver<ResolversTypes['CartItem'], ParentType, ContextType, RequireFields<MutationDeleteItemFromCartArgs, 'input'>>;
  deleteMenu?: Resolver<ResolversTypes['Menu'], ParentType, ContextType, RequireFields<MutationDeleteMenuArgs, 'id'>>;
  deleteOrderDetail?: Resolver<ResolversTypes['OrderDetail'], ParentType, ContextType, RequireFields<MutationDeleteOrderDetailArgs, 'input'>>;
  deleteProduct?: Resolver<Maybe<ResolversTypes['RequestResponseOK']>, ParentType, ContextType, RequireFields<MutationDeleteProductArgs, 'id'>>;
  deleteSpace?: Resolver<ResolversTypes['Space'], ParentType, ContextType, RequireFields<MutationDeleteSpaceArgs, 'input'>>;
  deleteTab?: Resolver<Maybe<ResolversTypes['Tab']>, ParentType, ContextType, RequireFields<MutationDeleteTabArgs, 'input'>>;
  deleteTable?: Resolver<ResolversTypes['RequestResponseOK'], ParentType, ContextType, Partial<MutationDeleteTableArgs>>;
  deleteUser?: Resolver<ResolversTypes['RequestResponseOK'], ParentType, ContextType>;
  generatePaymentIntent?: Resolver<ResolversTypes['PaymentIntent'], ParentType, ContextType, RequireFields<MutationGeneratePaymentIntentArgs, 'input'>>;
  generateStripePayout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  linkCategoryToProducts?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationLinkCategoryToProductsArgs, 'input'>>;
  makeCheckoutFullPayment?: Resolver<ResolversTypes['Checkout'], ParentType, ContextType, RequireFields<MutationMakeCheckoutFullPaymentArgs, 'input'>>;
  makeCheckoutPayment?: Resolver<ResolversTypes['Checkout'], ParentType, ContextType, RequireFields<MutationMakeCheckoutPaymentArgs, 'input'>>;
  manageBusinessEmployees?: Resolver<ResolversTypes['Employee'], ParentType, ContextType, RequireFields<MutationManageBusinessEmployeesArgs, 'input'>>;
  openTabRequest?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationOpenTabRequestArgs, 'input'>>;
  passwordReset?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationPasswordResetArgs, 'input'>>;
  postUserLogin?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationPostUserLoginArgs, 'input'>>;
  recoverPassword?: Resolver<Maybe<ResolversTypes['RequestResponseOK']>, ParentType, ContextType, RequireFields<MutationRecoverPasswordArgs, 'input'>>;
  requestCloseTab?: Resolver<ResolversTypes['Tab'], ParentType, ContextType, Partial<MutationRequestCloseTabArgs>>;
  requestJoinTab?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationRequestJoinTabArgs, 'input'>>;
  requestUserAccountCreation?: Resolver<ResolversTypes['AccountCreationResponse'], ParentType, ContextType, RequireFields<MutationRequestUserAccountCreationArgs, 'input'>>;
  shareQRCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationShareQrCodeArgs, 'input'>>;
  updateAddress?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType, Partial<MutationUpdateAddressArgs>>;
  updateBusinessInformation?: Resolver<ResolversTypes['Business'], ParentType, ContextType, RequireFields<MutationUpdateBusinessInformationArgs, 'input'>>;
  updateBusinessLocation?: Resolver<Maybe<ResolversTypes['Business']>, ParentType, ContextType, RequireFields<MutationUpdateBusinessLocationArgs, 'input'>>;
  updateBusinessToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationUpdateBusinessTokenArgs>>;
  updateCategory?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, Partial<MutationUpdateCategoryArgs>>;
  updateItemFromCart?: Resolver<ResolversTypes['CartItem'], ParentType, ContextType, RequireFields<MutationUpdateItemFromCartArgs, 'input'>>;
  updateMenu?: Resolver<Maybe<ResolversTypes['Menu']>, ParentType, ContextType, Partial<MutationUpdateMenuArgs>>;
  updateMenuInfo?: Resolver<ResolversTypes['Menu'], ParentType, ContextType, Partial<MutationUpdateMenuInfoArgs>>;
  updateOrderDetail?: Resolver<ResolversTypes['OrderDetail'], ParentType, ContextType, RequireFields<MutationUpdateOrderDetailArgs, 'input'>>;
  updateProductByID?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationUpdateProductByIdArgs, 'input'>>;
  updateSpace?: Resolver<ResolversTypes['Space'], ParentType, ContextType, RequireFields<MutationUpdateSpaceArgs, 'input'>>;
  updateTab?: Resolver<ResolversTypes['Tab'], ParentType, ContextType, RequireFields<MutationUpdateTabArgs, 'input'>>;
  updateUserInformation?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserInformationArgs, 'input'>>;
  uploadFile?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationUploadFileArgs, 'file'>>;
};

export type OrderDetailResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OrderDetail'] = ResolversParentTypes['OrderDetail']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  subTotal?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Payment'] = ResolversParentTypes['Payment']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  discount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  paid?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  patron?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  splitType?: Resolver<Maybe<ResolversTypes['SplitType']>, ParentType, ContextType>;
  tip?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentIntentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PaymentIntent'] = ResolversParentTypes['PaymentIntent']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  clientSecret?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentIntent?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  addonsID?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createStripeAccessLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  getAddress?: Resolver<ResolversTypes['Address'], ParentType, ContextType, RequireFields<QueryGetAddressArgs, 'id'>>;
  getAllBusiness?: Resolver<Array<Maybe<ResolversTypes['Business']>>, ParentType, ContextType>;
  getAllBusinessByUser?: Resolver<Array<Maybe<ResolversTypes['Business']>>, ParentType, ContextType>;
  getAllCategoriesByBusiness?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  getAllEmployees?: Resolver<ResolversTypes['Employees'], ParentType, ContextType>;
  getAllMenus?: Resolver<Array<ResolversTypes['Menu']>, ParentType, ContextType>;
  getAllMenusByBusinessID?: Resolver<Array<ResolversTypes['Menu']>, ParentType, ContextType>;
  getAllOpenTabsByBusinessID?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tab']>>>, ParentType, ContextType>;
  getAllOrderDetailsByOrderID?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrderDetail']>>>, ParentType, ContextType, RequireFields<QueryGetAllOrderDetailsByOrderIdArgs, 'orderID'>>;
  getAllProductsByBusinessID?: Resolver<Array<Maybe<ResolversTypes['Product']>>, ParentType, ContextType>;
  getAllTabsByBusinessID?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tab']>>>, ParentType, ContextType>;
  getAllUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  getBusinessById?: Resolver<ResolversTypes['Business'], ParentType, ContextType, RequireFields<QueryGetBusinessByIdArgs, 'input'>>;
  getBusinessInformation?: Resolver<ResolversTypes['Business'], ParentType, ContextType>;
  getBusinessLocation?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  getCartItemsPerTab?: Resolver<Array<ResolversTypes['CartItem']>, ParentType, ContextType>;
  getCategoryByID?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<QueryGetCategoryByIdArgs, 'id'>>;
  getCheckoutByID?: Resolver<ResolversTypes['Checkout'], ParentType, ContextType, RequireFields<QueryGetCheckoutByIdArgs, 'input'>>;
  getCheckoutsByBusiness?: Resolver<Array<ResolversTypes['Checkout']>, ParentType, ContextType>;
  getClientInformation?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  getClientMenu?: Resolver<Maybe<ResolversTypes['Menu']>, ParentType, ContextType, RequireFields<QueryGetClientMenuArgs, 'input'>>;
  getClientSession?: Resolver<ResolversTypes['ClientSession'], ParentType, ContextType>;
  getIsConnected?: Resolver<Maybe<ResolversTypes['Balance']>, ParentType, ContextType>;
  getMenuByID?: Resolver<ResolversTypes['Menu'], ParentType, ContextType, Partial<QueryGetMenuByIdArgs>>;
  getOrderDetailByID?: Resolver<Maybe<ResolversTypes['OrderDetail']>, ParentType, ContextType, RequireFields<QueryGetOrderDetailByIdArgs, 'orderDetailID'>>;
  getOrdersByCheckout?: Resolver<ResolversTypes['Checkout'], ParentType, ContextType, RequireFields<QueryGetOrdersByCheckoutArgs, 'input'>>;
  getOrdersBySession?: Resolver<Array<ResolversTypes['OrderDetail']>, ParentType, ContextType>;
  getPendingInvitations?: Resolver<Array<ResolversTypes['Request']>, ParentType, ContextType>;
  getProductByID?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryGetProductByIdArgs, 'productID'>>;
  getSpacesFromBusiness?: Resolver<Maybe<Array<ResolversTypes['Space']>>, ParentType, ContextType>;
  getTabByID?: Resolver<ResolversTypes['Tab'], ParentType, ContextType, RequireFields<QueryGetTabByIdArgs, 'input'>>;
  getTabRequest?: Resolver<ResolversTypes['Request'], ParentType, ContextType>;
  getTabRequests?: Resolver<Array<ResolversTypes['Request']>, ParentType, ContextType, Partial<QueryGetTabRequestsArgs>>;
  getTableById?: Resolver<ResolversTypes['Table'], ParentType, ContextType, RequireFields<QueryGetTableByIdArgs, 'input'>>;
  getTablesFromSpace?: Resolver<Array<ResolversTypes['Table']>, ParentType, ContextType, RequireFields<QueryGetTablesFromSpaceArgs, 'input'>>;
  getToken?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  getUserInformation?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type RequestResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Request'] = ResolversParentTypes['Request']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  admin?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  business?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  names?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  requestor?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['RequestStatus'], ParentType, ContextType>;
  tab?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  totalGuests?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestResponseOkResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RequestResponseOK'] = ResolversParentTypes['RequestResponseOK']> = {
  ok?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Section'] = ResolversParentTypes['Section']> = {
  category?: Resolver<ResolversTypes['Category'], ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpaceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Space'] = ResolversParentTypes['Space']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  business?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tables?: Resolver<Maybe<Array<ResolversTypes['Table']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  _empty?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "_empty", ParentType, ContextType>;
  numberIncremented?: SubscriptionResolver<ResolversTypes['Int'], "numberIncremented", ParentType, ContextType>;
  onTabRequest?: SubscriptionResolver<ResolversTypes['Request'], "onTabRequest", ParentType, ContextType>;
  onTabRequestResponse?: SubscriptionResolver<ResolversTypes['Request'], "onTabRequestResponse", ParentType, ContextType>;
};

export type TabResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Tab'] = ResolversParentTypes['Tab']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  admin?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cartItems?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  checkout?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  orders?: Resolver<Array<ResolversTypes['OrderDetail']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TabStatus'], ParentType, ContextType>;
  table?: Resolver<Maybe<ResolversTypes['Table']>, ParentType, ContextType>;
  users?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TableResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Table'] = ResolversParentTypes['Table']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  space?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TableStatus'], ParentType, ContextType>;
  tab?: Resolver<Maybe<ResolversTypes['Tab']>, ParentType, ContextType>;
  tableNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  businesses?: Resolver<Array<ResolversTypes['BusinessPrivileges']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  picture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WorkingHoursResolvers<ContextType = Context, ParentType extends ResolversParentTypes['WorkingHours'] = ResolversParentTypes['WorkingHours']> = {
  hours?: Resolver<Maybe<ResolversTypes['Hours']>, ParentType, ContextType>;
  isOpen?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  AccountCreationResponse?: AccountCreationResponseResolvers<ContextType>;
  Address?: AddressResolvers<ContextType>;
  Balance?: BalanceResolvers<ContextType>;
  Business?: BusinessResolvers<ContextType>;
  BusinessPrivileges?: BusinessPrivilegesResolvers<ContextType>;
  CartItem?: CartItemResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  Checkout?: CheckoutResolvers<ContextType>;
  ClientSession?: ClientSessionResolvers<ContextType>;
  CreateBusinessPayload?: CreateBusinessPayloadResolvers<ContextType>;
  DeleteBusinessPayload?: DeleteBusinessPayloadResolvers<ContextType>;
  Employee?: EmployeeResolvers<ContextType>;
  Employees?: EmployeesResolvers<ContextType>;
  Geo?: GeoResolvers<ContextType>;
  Hours?: HoursResolvers<ContextType>;
  HoursOfOperation?: HoursOfOperationResolvers<ContextType>;
  Menu?: MenuResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  OrderDetail?: OrderDetailResolvers<ContextType>;
  Payment?: PaymentResolvers<ContextType>;
  PaymentIntent?: PaymentIntentResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Request?: RequestResolvers<ContextType>;
  RequestResponseOK?: RequestResponseOkResolvers<ContextType>;
  Section?: SectionResolvers<ContextType>;
  Space?: SpaceResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Tab?: TabResolvers<ContextType>;
  Table?: TableResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  WorkingHours?: WorkingHoursResolvers<ContextType>;
};

