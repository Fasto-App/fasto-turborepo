import { RegularInputConfig, SideBySideInputConfig } from "../../components/ControlledForm/ControlledForm";
import { businessLocationSchemaInputKeys, Privileges, PrivilegesKeysArray, PrivilegesKeysArrayObj, typedKeys } from "app-helpers"
import { InputProps } from "../../components/ControlledForm/ControlledInput";

export const ManageLocationConfig: RegularInputConfig = {
  streetAddress: {
    isRequired: true,
    name: "street_name",
    label: "Street Name",
  },
  complement: {
    name: "complement",
    label: "Complement",
  },
  postalCode: {
    name: "zipCode",
    label: "Zip/Postal",
    isRequired: true,
  },
  city: {
    name: "city",
    label: "City",
    isRequired: true,
  },
  stateOrProvince: {
    name: "state",
    label: "State",
    isRequired: true,
  },
  country: {
    name: "country",
    label: "Country",
    isRequired: true,
    inputType: "Select",
    array: [{
      _id: "US",
      name: "US"
    }, {
      _id: "BR",
      name: "BR"
    }]
  },
};

export const ManageAccountConfig: RegularInputConfig = {
  name: {
    name: "name",
    label: "Name",
    placeholder: "Enter Name",
  },
  email: {
    name: "email",
    label: "Email",
    isDisabled: true,
  },
  oldPassword: {
    name: "oldPassword",
    label: "Old Password",
    type: "password",
    placeholder: "Old Password",
    autoComplete: "off",
  },
  newPassword: {
    name: "newPassword",
    label: "New Password",
    type: "password",
    placeholder: "New Password",
  },
  newPasswordConfirmation: {
    name: "newPasswordConfirmation",
    label: "Confirm Password",
    type: "password",
    placeholder: "New Password Confirmation",
  },
}

export const ManageBusinessConfig: RegularInputConfig = {
  name: {
    name: "name",
    label: "Business Name",
    isRequired: true,
    placeholder: "Enter Business Name",
  },
  description: {
    name: "description",
    label: "Description",
    inputType: "TextArea",
    placeholder: "Enter Description",
  },
}

export const uploadPicture: InputProps = {
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
}

export const ManageEmployeeConfig: RegularInputConfig = {
  name: {
    isRequired: true,
    name: "name",
    label: "Name",
    placeholder: "Enter Name"
  },
  jobTitle: {
    name: "jobTitle",
    label: "Job Title",
    isRequired: true,
    placeholder: "Enter Role",
  },
  // }, {
  privilege: {
    name: "privilege",
    label: "Privilege",
    isRequired: true,
    placeholder: "Choose a privilege",
    inputType: "Select",
    array: PrivilegesKeysArrayObj,
  },
  email: {
    isRequired: true,
    name: "email",
    label: "Email",
    placeholder: "example@email.com",
  },
}
