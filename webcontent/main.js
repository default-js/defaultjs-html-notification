const ipsum = new LoremIpsum();
const CHANNEL = ["A","B", "C"];

const messageId = find("#message-id").first();
const title = find("#message-title").first();
const content = find("#message-content").first();
const channel = find("#message-channel").first();
const API = defaultjs.html.notification.API;

function notify() {
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
		channel : "test",	
		title: `Test Titel - ${i}`,
		content: `Test Content - ${i}`,
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

let randomIntervalId = null;
function toggleRandomAuto(button) {
	if (randomIntervalId) {
		clearInterval(randomIntervalId);
		intervalId = null;
		button.textContent = "start auto random messaging";
	} else {
		button.textContent = "stop auto random messaging";
		randomIntervalId = setInterval(() => {				
				API.notify({
					channel: CHANNEL[Math.floor(Math.random() * CHANNEL.length)],
					title: ipsum.sentence(3,7),
					content: ipsum.paragraph(10,30)
				});
		}, 3000);
	}
};


