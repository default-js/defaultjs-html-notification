import { Component, defineComponent, privateProperty, Renderer, Template } from "./Imports";
import { NODENAME_MESSAGE, BASE_TEMPLATE_PATH } from "./Constants";
import { EVENT_SHOW_MESSAGE, EVENT_CLOSE_MESSAGE } from "./Events";
import { closeNotify } from "./API";


const ATTRIBUTE_MESSAGEID = "message-id";
const ATTRIBUTES = [];

const PRIVATE_MESSAGEDATA = "messageData";

class Message extends Component {

	static get NODENAME() { return NODENAME_MESSAGE; }

	static get observedAttributes() { return ATTRIBUTES; }

	constructor(messageData = {}) {
		super();
		this.messageData = messageData;
	}

	async init() {
		await super.init();

		const { root, ready } = this;
		if (!ready.resolved) {
			root.on(EVENT_CLOSE_MESSAGE, (event) => {
				event.stopPropagation();
				event.preventDefault();

				closeNotify(this.messageId);
			});
		}
	}

	get messageId() {
		return this.attr(ATTRIBUTE_MESSAGEID);
	}

	set messageId(messageId) {
		return this.attr(ATTRIBUTE_MESSAGEID, messageId);
	}

	get messageData() {
		return privateProperty(this, PRIVATE_MESSAGEDATA);
	}

	set messageData(messageData) {
		privateProperty(this, PRIVATE_MESSAGEDATA, messageData);
		this.messageId = messageData.id;
	}
	
	get channel(){
		return this.messageData.channel;
	}
	
	get messageTTL(){
		return this.messageData.setting.ttl;
	}
	
	get messageTTLMode(){
		return this.messageData.setting.ttlMode;
	}


}

defineComponent(Message);

export default Message;