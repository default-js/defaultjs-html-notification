import Component from "@default-js/defaultjs-html-components/src/Component";
import { define } from "@default-js/defaultjs-html-components/src/utils/DefineComponentHelper";
import { Renderer, Template } from "@default-js/defaultjs-template-language";
import { privateProperty } from "@default-js/defaultjs-common-utils/src/PrivateProperty";
import SETTING from "./Setting";
import { NODENAME_DISPLAY, NODENAME_MESSAGE } from "./Constants";
import { EVENT_SHOW_MESSAGE, EVENT_DISPLAY_REMOVE_MESSAGE, EVENT_CLOSE_MESSAGE, EVENT_DISPLAY_MESSAGE_REMOVED } from "./Events";
import Message from "./Message";
import { acceptMessageOnChannel, loadTemplate} from "./Utils";

const body = document.body;

const ATTRIBUTE_CHANNEL = "channel";
const ATTRIBUTE_TEMPLATE = "template";
const ATTRIBUTE_MESSAGE_TEMPLATE = "message-template";
const ATTRIBUTE_MODE = "mode"; //append, prepend | default: append
const ATTRIBUTE_MESSAGE_TTL = "message-ttl";
const ATTRIBUTE_MESSAGE_TTL_MODE = "message-ttl-mode"; //remove, close | default: close
const ATTRIBUTES = [];

const MARKER_CONTENT = "content";
const SELECTOR_MARKER_CONTENT = `[${MARKER_CONTENT}]`;

const PRIVATE_MESSAGETEMPLATE = "messageTemplate";

const TIMEOUTS_MESSAGE_TTL = new WeakMap();

const buildMessage = async (display, message) => {
	const element = new Message(message);

	const template = await messageTemplate(display);

	element.ready.then(() => {
		Renderer.render({ container: element.root, data: message, template });
	});

	const setting = message.setting || {};
	if (typeof setting.click === "function") element.on("click", setting.click);

	if (typeof setting.close === "function") element.on(EVENT_CLOSE_MESSAGE, setting.close);

	return element;
};

const messageTemplate = async (display) => {
	//@TODO dynamic template selection by message data
	let template = privateProperty(display, PRIVATE_MESSAGETEMPLATE);
	if (!template) {
		template = await loadTemplate(display.attr(ATTRIBUTE_TEMPLATE));
		privateProperty(display, PRIVATE_MESSAGETEMPLATE, template);
	}
	return template;
};

const messageTTLHandle = (display, messageId, ttlMode) => {
	const mode = ttlMode || display.attr(ATTRIBUTE_MESSAGE_TTL_MODE) || "close";
	display.removeMessage(messageId, mode == "close");
};

const startMessageTTL = (display, message) => {
	if (display.hasAttribute(ATTRIBUTE_MESSAGE_TTL) || message.ttl) {
		const time = message.ttl || parseInt(display.attr(ATTRIBUTE_MESSAGE_TTL) || SETTING.messageTTL);
		const timeout = setTimeout(messageTTLHandle, time, display, message.messageId, message.ttlMode);
		TIMEOUTS_MESSAGE_TTL.set(message, timeout);
	}
};

const clearMessageTTLTimeout = (message) => {
	const timeout = TIMEOUTS_MESSAGE_TTL.get(message);
	if (timeout) clearTimeout(timeout);
};

class Display extends Component {
	static get NODENAME() {
		return NODENAME_DISPLAY;
	}

	static get observedAttributes() {
		return ATTRIBUTES;
	}

	constructor() {
		super();
	}

	async init() {
		await super.init();
		const { root, ready } = this;

		if (!ready.resolved) {
			this.content = root.find(SELECTOR_MARKER_CONTENT).first() || root;

			body.on(EVENT_SHOW_MESSAGE, (event) => {
				const message = event.detail;
				if (acceptMessageOnChannel(this.channel, message)) this.addMessage(message);
			});

			body.on(EVENT_DISPLAY_REMOVE_MESSAGE, (event) => {
				const { target, detail } = event;
				this.removeMessage(target instanceof Message ? target : detail, false);
			});
		}
	}

	async destroy() {
		await super.destroy();
	}

	get channel() {
		return this.attr(ATTRIBUTE_CHANNEL) || ".*";
	}

	async getMessage(messageId) {
		const { ready, content } = this;
		await ready;
		return content.find(`${NODENAME_MESSAGE}[message-id="${messageId}"]`).first();
	}

	/**
	 * @param message object|html element
	 */
	async addMessage(message) {
		const { ready, content } = this;
		await ready;

		if (!(message instanceof Message)) message = await buildMessage(this, message);

		const current = await this.getMessage(message.messageId);
		if (current) {
			clearMessageTTLTimeout(current);
			startMessageTTL(this, current);
			return;
		}

		if (this.attr(ATTRIBUTE_MODE) == "prepend") content.prepend(message);
		else content.append(message);

		startMessageTTL(this, message);
	}

	/**
	 * @param message string|object|html element
	 * @param triggerClose boolean | default: true
	 */
	async removeMessage(message, triggerClose = true) {
		await this.ready;

		if (message instanceof Message) message = message.messageId;
		else if (typeof message !== "string") message = message.id;

		message = await this.getMessage(message);
		if (message) {
			clearMessageTTLTimeout(message);

			if (triggerClose) message.trigger(EVENT_CLOSE_MESSAGE);
			else {
				message.remove();
				this.trigger(EVENT_DISPLAY_MESSAGE_REMOVED, message.messageData);
			}
		}
	}
}

define(Display);

export default Display;
