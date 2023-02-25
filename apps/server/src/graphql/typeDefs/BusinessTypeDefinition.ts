import { gql } from "apollo-server-express";

export const BusinessTypeDefinition = gql`
  extend type Query {
    getBusinessInformation: Business!
    getAllBusinessByUser: [Business]!
    getAllBusiness: [Business]!
    getBusinessLocation: Address
    getAllEmployees: Employees!
  }

  extend type Mutation {
    createBusiness(input: BusinessInput!): CreateBusinessPayload
    updateBusinessInformation(input: UpdateBusinessInfoInput!): Business!
    deleteBusiness(businessID: ID!): DeleteBusinessPayload
    updateBusinessToken(input: String): String
    updateBusinessLocation(input: AddressInput!): Business
    manageBusinessEmployees(input: ManageBusinessEmployeesInput!): Employee!
    deleteBusinessEmployee(input: DeleteEmployee!): ID!
  }

  type Employees {
    employees: [Employee!]!
    employeesPending: [Employee!]!
  }

  type Employee {
    _id: ID!
    name: String!
    email: String!
    privilege: UserPrivileges!
    picture: String
    isPending: Boolean!
    jobTitle: String!
  }

  input ManageBusinessEmployeesInput {
    _id: ID
    name: String!
    email: String!
    jobTitle: String!
    privilege: UserPrivileges!
  }

  input BusinessInput {
    name: String!
    phone: String!
    website: String
    address: AddressInput
  }

  input DeleteEmployee {
    _id: ID!
  }

  input HoursInput {
    open: String!
    close: String!
  }

  input WorkingHoursInput {
    isOpen: Boolean!
    hours: HoursInput
  }

  input HoursOfOperationInput {
    Monday: WorkingHoursInput
    Tuesday: WorkingHoursInput
    Wednesday: WorkingHoursInput
    Thursday: WorkingHoursInput
    Friday: WorkingHoursInput
    Saturday: WorkingHoursInput
    Sunday: WorkingHoursInput
  }

  enum DaysOfWeek {
    Monday
    Tuesday
    Wednesday
    Thursday
    Friday
    Saturday
    Sunday
  }

  type CreateBusinessPayload {
    business: Business!
    token: String
  }

  type Business {
    _id: ID!
    user: ID
    name: String!
    description: String
    email: String!
    website: String!
    price_range: String
    cuisine: [String!]
    menus: [Menu!]
    address: Address
    categories: [Category!]!
    products: [Product!]!
    employees: [String]!
    picture: String
    hoursOfOperation: HoursOfOperation
  }

  type Hours {
    open: String!
    close: String!
  }

  type WorkingHours {
    isOpen: Boolean!
    hours: Hours
  }

  type HoursOfOperation {
    Monday: WorkingHours
    Tuesday: WorkingHours
    Wednesday: WorkingHours
    Thursday: WorkingHours
    Friday: WorkingHours
    Saturday: WorkingHours
    Sunday: WorkingHours
  }

  type DeleteBusinessPayload {
    success: Boolean!
    message: String
  }

  input UpdateBusinessInfoInput {
    name: String!
    description: String
    picture: Upload
    hoursOfOperation: HoursOfOperationInput
  }

`