// import { CustomEventName, getAnalytics, logEvent, isSupported } from "firebase/analytics";

// const LogBusinessCustomEvent = <T extends BusinessEventType>
//   (eventName: CustomEventName<T>, eventParams?: BusinessEventParams[T]) => {
//   if (!analytics) return;

//   logEvent(await analytics, eventName, eventParams);
// };

type BusinessEventType =
	| "item_added"
	| "sale_completed"
	| "inventory_update"
	| "setting_changed";

interface BusinessLoginParams {
	businessId: string;
	userId: string;
}

interface BusinessItemAddedParams {
	businessId: string;
	itemId: string;
	itemName: string;
}

interface BusinessSaleCompletedParams {
	businessId: string;
	saleId: string;
	totalAmount: number;
}

interface BusinessInventoryUpdateParams {
	businessId: string;
	itemId: string;
	updatedQuantity: number;
}

interface BusinessSettingChangedParams {
	businessId: string;
	settingName: string;
	newValue: any;
}

type BusinessEventParams = {
	// business_login: BusinessLoginParams;
	item_added: BusinessItemAddedParams;
	sale_completed: BusinessSaleCompletedParams;
	inventory_update: BusinessInventoryUpdateParams;
	setting_changed: BusinessSettingChangedParams;
};

export {};
