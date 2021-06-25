import { Template } from "@default-js/defaultjs-template-language";
import ExpressionResolver from "@default-js/defaultjs-expression-language/src/ExpressionResolver";
import SETTING from "./Setting";

export const acceptMessageOnChannel = (channel, message) => {
	return new RegExp(channel, "ig").test(message.channel || "");
};

export const loadTemplate = async (source, data) => {
	let url = null;
	if (!source) url = new URL(`${SETTING.baseTemplatePath}${SETTING.messageTemplate}`, location);
	else if (source instanceof URL) url = source;
	else if (typeof source === "string") {
		let path = await ExpressionResolver.resolveText(source, {
			$baseTemplatePath : SETTING.baseTemplatePath,
			$defaultTemplate: SETTING.messageTemplate,
			data
		});
		url = new URL(path, location);
	} else return null;

	return Template.load(url);
};
