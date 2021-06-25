import {acceptMessageOnChannel} from "../../../src/Utils";
describe("Utils: acceptMessageOnChannel", () => {
	beforeAll(() => {});	
	
	it(".* accept messages", async () => {
        expect(acceptMessageOnChannel(".*", {channel: "test"})).toBeTrue();
        expect(acceptMessageOnChannel(".*", {channel: "tset"})).toBeTrue();
        expect(acceptMessageOnChannel(".*", {channel: "a"})).toBeTrue();
        expect(acceptMessageOnChannel(".*", {channel: "b"})).toBeTrue();
        expect(acceptMessageOnChannel(".*", {channel: "*"})).toBeTrue();
	});
});