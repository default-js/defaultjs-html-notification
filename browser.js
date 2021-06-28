import SETTING from "./src/Setting";
import Message from "./src/Message";
import Display from "./src/Display";
import { notify, closeNotify } from "./src/API";

window.defaultjs = window.defaultjs || {};
window.defaultjs.html = window.defaultjs.html || {};
window.defaultjs.html.notification = defaultjs.html.notification || {
	API: {
		notify,
		closeNotify,
	},
	SETTING,
	Message,
	Display
};
