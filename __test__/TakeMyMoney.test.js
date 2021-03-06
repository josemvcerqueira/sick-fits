import { mount } from "enzyme";
import wait from "waait";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import Router from "next/router";
import NProgress from "nprogress";

import { CURRENT_USER_QUERY } from "../components/User";
import TakeMyMoney from "../components/TakeMyMoney";
import { fakeUser, fakeCartItem } from "../lib/testUtils";

Router.router = { push() {} };

const mocks = [
	{
		request: { query: CURRENT_USER_QUERY },
		result: {
			data: {
				me: {
					...fakeUser(),
					cart: [fakeCartItem()]
				}
			}
		}
	}
];

describe("<TakeMyMoney/>", async () => {
	it("renders and matches snapshot", async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<TakeMyMoney />
			</MockedProvider>
		);
		await wait(10);
		wrapper.update();
		const checkoutButton = wrapper.find("ReactStripeCheckout");
		expect(toJSON(checkoutButton)).toMatchSnapshot();
	});

	it("creates an order ontoken", async () => {
		const createOrderMock = jest.fn().mockResolvedValue({
			data: { createOrder: { id: "xyz789" } }
		});

		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<TakeMyMoney />
			</MockedProvider>
		);

		const component = wrapper.find("TakeMyMoney").instance();

		// manually call the onToken method
		component.onToken({ id: "abc123" }, createOrderMock);
		await wait(10);
		expect(createOrderMock).toHaveBeenCalled();
		expect(createOrderMock).toHaveBeenCalledWith({
			variables: {
				token: "abc123"
			}
		});
	});

	it("turns the progress bar on", async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<TakeMyMoney />
			</MockedProvider>
		);
		const createOrderMock = jest.fn().mockResolvedValue({
			data: { createOrder: { id: "xyz789" } }
		});
		NProgress.start = jest.fn();
		await wait(10);
		wrapper.update();

		const component = wrapper.find("TakeMyMoney").instance();

		// manually call the onToken method
		component.onToken({ id: "abc123" }, createOrderMock);
		await wait(10);
		expect(NProgress.start).toHaveBeenCalled();
	});

	it("routes to the order page when completed", async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<TakeMyMoney />
			</MockedProvider>
		);
		const createOrderMock = jest.fn().mockResolvedValue({
			data: { createOrder: { id: "xyz789" } }
		});
		NProgress.start = jest.fn();
		await wait(10);
		wrapper.update();

		const component = wrapper.find("TakeMyMoney").instance();
		Router.router.push = jest.fn();
		// manually call the onToken method
		component.onToken({ id: "abc123" }, createOrderMock);
		await wait(10);
		expect(Router.router.push).toHaveBeenCalled();
		expect(Router.router.push).toHaveBeenCalledWith({
			pathname: "/order",
			query: {
				id: "xyz789"
			}
		});
	});
});
