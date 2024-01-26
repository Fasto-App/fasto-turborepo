import { initializeApp } from "firebase/app";
import {
	getAnalytics,
	isSupported,
	initializeAnalytics,
} from "firebase/analytics";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

const analytics = (await isSupported())
	? initializeAnalytics(firebaseApp, {
			config: {
				send_page_view: false,
				allow_ad_personalization_signals: false,
				allow_google_signals: false,
			},
	  })
	: null;

export { analytics };
