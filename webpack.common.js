const entries = {};
entries["module-bundle"] = "./index.js";
entries["browser-bundle"] = "./browser.js";

module.exports = {
	entry: entries,
	target: "web",
};
