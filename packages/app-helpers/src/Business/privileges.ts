export const Privileges = {
  "VIEW_ONLY": "This privilege allows users to view data, but not make any changes.",
  "STAFF": "This privilege allows users to manage the business's menu, process orders, and track inventory.",
  "MANAGER": "This privilege allows managers to view and edit data for their team or department.",
  "ADMIN": "This privilege allows users to have full access to all features and data in the app.",
  "CUSTOMER": "This privilege allows users to view and edit customer information, such as contact details and purchase history."
} as const;


export type PrivilegesKeys = keyof typeof Privileges;
export type PrivilegesDescription = typeof Privileges[keyof typeof Privileges];
export const PrivilegesKeysArray = ["ADMIN", "VIEW_ONLY", "MANAGER", "CUSTOMER", "STAFF"] as const