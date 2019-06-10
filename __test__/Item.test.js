import ItemComponent from "../components/Item";
import formatMoney from "../lib/formatMoney";
import { shallow } from "enzyme";

const fakeItem = {
	id: "ABC",
	title: "Gucci Shades",
	price: 50000,
	description: "This item will make you super popular",
	image: "gucci.jpg",
	largeImage: "largegucci.jpg"
};

describe("<Item/>", () => {
	const wrapper = shallow(<ItemComponent item={fakeItem} />);

	it("renders the image properly", () => {
		const img = wrapper.find("img");
		expect(img.props().src).toBe(fakeItem.image);
		expect(img.props().alt).toBe(fakeItem.title);
	});

	it("renders the price tag properly", () => {
		const PriceTag = wrapper.find("PriceTag");
		const price = formatMoney(fakeItem.price);

		expect(PriceTag.children().text()).toEqual(price);
		expect(wrapper.find("Title a").text()).toEqual(fakeItem.title);
	});

	it("renders the title properly", () => {
		expect(wrapper.find("Title a").text()).toEqual(fakeItem.title);
	});

	it("renders out the buttons properly", () => {
		const buttonList = wrapper.find(".buttonList");

		expect(buttonList.children()).toHaveLength(3);
		expect(buttonList.find("Link").exists()).toBe(true);
		expect(buttonList.find("AddToCart").exists()).toBe(true);
		expect(buttonList.find("DeleteItem").exists()).toBe(true);
	});
});
