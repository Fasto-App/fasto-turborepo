import { RegularInputConfig, SideBySideInputConfig } from "../../components/ControlledForm/ControlledForm";
import { businessLocationSchemaInputKeys, Privileges } from "app-helpers"
import { typedKeys } from "../../authUtilities/utils";
import { InputProps } from "../../components/ControlledForm/ControlledInput";

export const ManageLocationConfig: SideBySideInputConfig = {
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

export const ManageBusinessConfig: RegularInputConfig = {
  businessName: {
    name: "businessName",
    label: "Business Name",
  },
  description: {
    name: "description",
    label: "Description",
  },
  monday: {
    name: "monday",
    label: "Monday",
    inputType: "Date",
  },
  tuesday: {
    name: "tuesday",
    label: "Tuesday",
    inputType: "Date",
  },
  wednesday: {
    name: "wednesday",
    label: "Wednesday",
    inputType: "Date",
  },
  thursday: {
    name: "thursday",
    label: "Thursday",
    inputType: "Date",
  },
  friday: {
    name: "friday",
    label: "Friday",
    inputType: "Date",
  },
  saturday: {
    name: "saturday",
    label: "Saturday",
    inputType: "Date",
  },
  sunday: {
    name: "sunday",
    label: "Sunday",
    inputType: "Date",
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
