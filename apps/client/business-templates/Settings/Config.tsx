import { RegularInputConfig, SideBySideInputConfig } from "../../components/ControlledForm/ControlledForm";
import { businessLocationSchemaInputKeys, Privileges, typedKeys } from "app-helpers"
import { InputProps } from "../../components/ControlledForm/ControlledInput";

export const ManageLocationConfig: SideBySideInputConfig = {
  streetAddress: {
    isRequired: true,
    name: "street_name",
    label: "Street Name",
  },
  complementAndPostal: [{
    complement: {
      name: "complement",
      label: "Complement",
    },
  }, {
    postalCode: {
      name: "zipCode",
      label: "Zip/Postal",
      isRequired: true,
    },
  }],
  city: {
    name: "city",
    label: "City",
    isRequired: true,
  },
  stateCountry: [{
    stateOrProvince: {
      name: "state",
      label: "State",
      isRequired: true,
    }
  }, {
    country: {
      name: "country",
      label: "Country",
      isRequired: true,
    }
  }],
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

// create a new config for the new form
// the forms need better validation to garantee that the config types and the schema types are the same

const privilegesArray = typedKeys(Privileges)
  .filter(privilege => privilege !== "CUSTOMER")
  .map(privilege => ({
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
  rolePrivileges: [
    {
      jobTitle: {
        name: "jobTitle",
        label: "Job Title",
        isRequired: true,
        placeholder: "Enter Role",
      }
    }, {
      privileges: {
        name: "privileges",
        label: "Privileges",
        isRequired: true,
        placeholder: "Choose a privilege",
        inputType: "Select",
        array: privilegesArray,
      }
    }
  ],
  email: {
    isRequired: true,
    name: "email",
    label: "Email",
    placeholder: "example@email.com",
  },
}
