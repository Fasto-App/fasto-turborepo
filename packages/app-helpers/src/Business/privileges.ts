export const Privileges = {
	Admin:
		"This privilege allows users to have full access to all features and data in the app.",
	Customer:
		"This privilege allows users to view and edit customer information, such as contact details and purchase history.",
	Manager:
		"This privilege allows managers to view and edit data for their team or department.",
	View: "This privilege allows users to view data, but not make any changes.",
	Staff:
		"This privilege allows users to manage the business's menu, process orders, and track inventory.",
} as const;

export type PrivilegesKeys = keyof typeof Privileges;
export type PrivilegesDescription =
	(typeof Privileges)[keyof typeof Privileges];

export const PrivilegesKeysArray = [
	"Admin",
	"View",
	"Manager",
	"Staff",
] as const;
export const PrivilegesKeysArrayObj = PrivilegesKeysArray.map((privilege) => ({
	name: privilege,
	_id: privilege,
}));
