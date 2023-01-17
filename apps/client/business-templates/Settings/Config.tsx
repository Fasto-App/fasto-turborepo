import { RegularInputConfig, SideBySideInputConfig } from "../../components/ControlledForm/ControlledForm";

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

export const ManageEmployeeConfig: SideBySideInputConfig = {
  name: {
    name: "name",
    label: "Name",
    placeholder: "Enter Name"
  },
  role: {
    name: "role",
    label: "Job Role",
    placeholder: "Enter Role"
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
