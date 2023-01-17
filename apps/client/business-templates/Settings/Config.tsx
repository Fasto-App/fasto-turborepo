import { RegularInputConfig, SideBySideInputConfig } from "../../components/ControlledForm/ControlledForm";
import { Privileges } from "app-helpers"
import { typedKeys } from "../../authUtilities/utils";

export const ManageBusinessConfig: RegularInputConfig = {
  businessName: {
    name: "business_name",
    label: "Business Name",
  },
  addressLine1: {
    name: "addressLine1",
    label: "Street Name"
  },

  zipCode: {
    name: "zipCode",
    label: "Zip/Postal"
  },
  city: {
    name: "city",
    label: "City"
  },
  state: {
    name: "state",
    label: "State"
  },
  country: {
    name: "country",
    label: "Country"
  },
  hours: {
    name: "hours",
    label: "Hours"
  },
  days: {
    name: "days",
    label: "Days",
  }
};

export const ManageAccountConfig: RegularInputConfig = {
  name: {
    name: "name",
    label: "Name",
  },
  email: {
    name: "email",
    label: "Email",
  },
  password: {
    name: "password",
    label: "Password",
  },
  confirmPassword: {
    name: "confirm_password",
    label: "Confirm Password",
  },
}

const privilegesArray = typedKeys(Privileges).map(privilege => ({
  name: privilege,
  _id: privilege,
}))

export const ManageEmployeeConfig: SideBySideInputConfig = {
  name: {
    isRequired: true,
    name: "name",
    label: "Name",
    placeholder: "Enter Name"
  },
  role: {
    isRequired: true,
    name: "role",
    label: "Job Role",
    placeholder: "Enter Role",
    inputType: "Select",
    array: privilegesArray,
  },
  email: {
    name: "email",
    label: "Email",
    placeholder: "example@email.com",
  },
  phonePic: [{
    phone: {
      name: "phone",
      label: "Phone",
      placeholder: "Enter Phone"
    },
  }, {
    picture: {
      name: "picture",
      label: "Picture",
    },
  }]
}
