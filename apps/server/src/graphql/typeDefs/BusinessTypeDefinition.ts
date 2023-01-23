import { gql } from "apollo-server-express";

export const BusinessTypeDefinition = gql`
  extend type Query {
    getBusiness: Business!
    getAllBusinessByUser: [Business]
    getAllBusiness: [Business]
  }

  extend type Mutation {
    createBusiness(input: BusinessInput): CreateBusinessPayload
    updateBusiness(input: UpdateBusinessInput): Business
    deleteBusiness(businessID: ID!): DeleteBusinessPayload
    updateBusinessToken(input: String): String
    updateBusinessLocation(input: BusinessInfoInput): Business
  }

  input BusinessInput {
    name: String!
    phone: String!
    website: String
    address: AddressInput
  }

  input BusinessInfoInput {
    name: String!
    streetName: String!
    streetNumber: String!
    zipCode: String!
    city: String!
    state: String!
    country: String!
    # hoursOfOperation: HoursOfOperationInput!
  }

  input WorkingHoursInput {
    open: String!
    close: String!
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
    MONDAY
    TUESDAY
    WEDNESDAY
    THURSDAY
    FRIDAY
    SATURDAY
    SUNDAY
  }

    type CreateBusinessPayload {
    business: Business!
    token: String
  }

  type Business {
    _id: ID!
    user: ID
    name: String!
    email: String!
    website: String!
    price_range: String
    cuisine: [String!]
    menus: [Menu!]
    address: Address
    categories: [Category!]!
    products: [Product!]!
    employees: [String]!
    hoursOfOperation: HoursOfOperation
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
  type WorkingHours {
    open: String!
    close: String!
  }

  type DeleteBusinessPayload {
    success: Boolean!
    message: String
  }

  input UpdateBusinessInput {
  _id: ID!
  business: BusinessInput!
}

`