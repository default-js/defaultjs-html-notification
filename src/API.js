import { uuid } from "./Imports";
import { } from "./Constants";
import { EVENT_SHOW_MESSAGE, EVENT_DISPLAY_REMOVE_MESSAGE } from "./Events";


const body = document.body;
/**
	{ 		
		id: [string - optionl | auto created]
		channel:  [string - required] 
		title: [string - required]
		content: [string|html-string - optional]
		actions: [array | optional] -> {
								title: [string - optional]
								link: [url-string]
							}		
		setting : [object | optional] {
			ttl: [time],
			ttlMode: [remove, close]
			closeAll:[boolean - optional | default: true]
			click: [function - optional]
			close: [function - optional]
		} 
	}

 */
export const notify = async (message) => {
	if (!message.id)
		message.id = `message-id-${uuid()}`;

	body.trigger(EVENT_SHOW_MESSAGE, message);
	return message.id;
};

export const closeNotify = async (id) => {
	body.trigger(EVENT_DISPLAY_REMOVE_MESSAGE, id);
};











