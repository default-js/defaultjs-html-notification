export const acceptMessageOnChannel = (channel, message) => {
	return new RegExp(channel, "ig").test(message.channel || "");
};
