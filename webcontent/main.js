const messageId = find("#message-id").first();
const title = find("#message-title").first();
const content = find("#message-content").first();
const channel = find("#message-channel").first();
const API = defaultjs.html.notification.API;

function notify() {
	console.log("publish message");

	API.notify({
		id: messageId.value.length > 0 ? messageId.value : null,
		title: `${title.value} [channel: ${channel.value}]`,
		content: content.value,
		channel: channel.value
	});
};

const messages = [];
for(let i = 0; i < 10; i++){
	messages.push({
		id : `id-${i}`,
		title: `Test Titel - ${i}`,
		content: `Test Content - ${i}`,
		channel : "test"		
	});
}


let intervalId = null;
function toggleAuto(button) {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
		button.textContent = "start auto messaging";
	} else {
		button.textContent = "stop auto messaging";
		intervalId = setInterval(() => {				
				API.notify(messages[Math.floor( messages.length * Math.random())]);
		}, 3000);
	}
};


