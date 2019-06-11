import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";

import SingleItem, { SINGLE_ITEM_QUERY } from "../components/SingleItem";
import { fakeItem } from "../lib/testUtils";

describe("<SingleItem/>", () => {
	it("renders with proper data", async () => {
		const mocks = [
			{
				// when someone requests with this query and variables combo
				request: { query: SINGLE_ITEM_QUERY, variables: { id: "123" } },
				// return this fake data (mocked data)
				result: {
					data: {
						item: fakeItem()
					}
				}
			}
		];

		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<SingleItem id="123" />
			</MockedProvider>
		);

		expect(wrapper.text()).toContain("Loading...");
		await wait();
		wrapper.update();
		expect(toJSON(wrapper.find("h2"))).toMatchSnapshot();
		expect(toJSON(wrapper.find("img"))).toMatchSnapshot();
		expect(toJSON(wrapper.find("p"))).toMatchSnapshot();
	});

	it("Errors with a not found item", async () => {
		const mocks = [
			{
				// when someone requests with this query and variables combo
				request: { query: SINGLE_ITEM_QUERY, variables: { id: "123" } },
				// return this fake data (mocked data)
				result: {
					errors: [{ message: "Items Not Found" }]
				}
			}
		];

		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<SingleItem id="123" />
			</MockedProvider>
		);

		await wait();
		wrapper.update();
		const item = wrapper.find("[data-test='graphql-error']");
		expect(item.text()).toContain("Items Not Found");
		expect(toJSON(item)).toMatchSnapshot();
	});
});
