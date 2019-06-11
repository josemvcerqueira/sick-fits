import { mount } from "enzyme";
import wait from "waait";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import Router from "next/router";

import CreateItem, { CREATE_ITEM_MUTATION } from "../components/CreateItem";
import { fakeItem } from "../lib/testUtils";

const dogImage = "https://dog.com/dog.jpg";

// mock the global fetch API
global.fetch = jest.fn().mockResolvedValue({
	json: () => ({
		secure_url: dogImage,
		eager: [{ secure_url: dogImage }]
	})
});

describe("<CreateItem/>", () => {
	it("renders and matches snapshot", async () => {
		const wrapper = mount(
			<MockedProvider>
				<CreateItem />
			</MockedProvider>
		);
		const form = wrapper.find("form[data-test='form']");
		expect(toJSON(form)).toMatchSnapshot();
	});

	it("uploads a file when changed", async () => {
		const wrapper = mount(
			<MockedProvider>
				<CreateItem />
			</MockedProvider>
		);

		const input = wrapper.find("input[type='file']");
		input.simulate("change", { target: { files: [dogImage] } });
		await wait();
		const component = wrapper.find("CreateItem").instance();
		expect(component.state.image).toEqual(dogImage);
		expect(component.state.largeImage).toEqual(dogImage);
		expect(global.fetch).toHaveBeenCalled();
		// reset the mcock funnction
		global.fetch.mockReset();
	});

	it("handles state updating", () => {
		const wrapper = mount(
			<MockedProvider>
				<CreateItem />
			</MockedProvider>
		);

		const title = wrapper.find("#title").simulate("change", {
			target: { value: "Testing", name: "title" }
		});

		const price = wrapper.find("#price").simulate("change", {
			target: { value: 50000, name: "price", type: "number" }
		});

		const description = wrapper.find("#description").simulate("change", {
			target: { value: "This is a really nice item", name: "description" }
		});

		expect(wrapper.find("CreateItem").instance().state).toMatchObject({
			title,
			price,
			description
		});
	});

	it("created an item when the form is submitted", async () => {
		const item = fakeItem();
		const { title, description, price, image, largeImage } = item;

		global.fetch = jest.fn().mockResolvedValue({
			json: () => ({
				secure_url: image,
				eager: [{ secure_url: largeImage }]
			})
		});
		const mocks = [
			{
				request: {
					query: CREATE_ITEM_MUTATION,
					variables: {
						title,
						description,
						image,
						largeImage,
						price
					}
				},
				result: {
					data: {
						createItem: {
							...item,
							id: "abc123",
							__typename: "Item"
						}
					}
				}
			}
		];

		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<CreateItem />
			</MockedProvider>
		);

		// simulate someone filling the form
		wrapper.find("#title").simulate("change", {
			target: { value: title, name: "title" }
		});

		wrapper.find("#price").simulate("change", {
			target: { value: price, name: "price", type: "number" }
		});

		wrapper.find("#description").simulate("change", {
			target: { value: description, name: "description" }
		});

		const input = wrapper.find("input[type='file']");
		input.simulate("change", { target: { files: [dogImage] } });
		await wait();

		//mock the router
		Router.router = { push: jest.fn() };
		wrapper.find("form").simulate("submit");
		await wait(50);
		expect(Router.router.push).toHaveBeenCalled();
		expect(Router.router.push).toHaveBeenCalledWith({
			pathname: "/item",
			query: {
				id: "abc123"
			}
		});
	});
});
