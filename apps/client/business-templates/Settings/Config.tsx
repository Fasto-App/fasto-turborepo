import { RegularInputConfig, SideBySideInputConfig } from "../../components/ControlledForm/ControlledForm";
import { businessInfoSchemaInputKeys, Privileges } from "app-helpers"
import { typedKeys } from "../../authUtilities/utils";

export const ManageBusinessConfig: SideBySideInputConfig = {
  name: {
    name: "business_name",
    label: "Business Name",
  },
  streetName: {
    name: "street_name",
    label: "Street Name",
  },
  street: [{
    streetNumber: {
      name: "street_number",
      label: "Street Number",
    },
  }, {
    zipCode: {
      name: "zipCode",
      label: "Zip/Postal"
    },
  }],
  city: {
    name: "city",
    label: "City"
  },
  stateCountry: [{
    state: {
      name: "state",
      label: "State"
    }
  }, {
    country: {
      name: "country",
      label: "Country"
    }
  }],
  uploadPicture: {
    name: "uploadPicture",
    label: "Upload Picture",
    inputType: "File",
    handleOnChange: (evt: any) => {
      console.log("file", evt.target.files[0])
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png")
        }, 2000)
      })
    }
  },
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
