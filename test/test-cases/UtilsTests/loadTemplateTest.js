import {loadTemplate} from "../../../src/Utils";
describe("Utils: loadTemplate", () => {
	beforeAll(() => {});	
	
	it("load default template", async () => {
		const template = await loadTemplate();
		expect(!!template).toBeTrue();
	});

	it("load template from url string", async () => {
		const template = await loadTemplate("/template/test/test.message.tpl.html");
		expect(!!template).toBeTrue();
	});

	it("load custom template from base template path", async () => {
		const template = await loadTemplate("${$baseTemplatePath}test.message.tpl.html");
		expect(!!template).toBeTrue();
	});

	it("load default template from custom template path", async () => {
		const template = await loadTemplate("/template/test/${$defaultTemplate}");
		expect(!!template).toBeTrue();
	});
	
	it("check if custom template different from default template", async () => {
		const template = await loadTemplate();
		const custom = await loadTemplate("/template/test/test.message.tpl.html");
		expect(template.key).not.toBe(custom.key);
	});

	it("check if load default template twice is equal", async () => {
		const a = await loadTemplate();
		const b = await loadTemplate();
		expect(a.key).toBe(b.key);
		expect(a).toBe(b);
	});
});