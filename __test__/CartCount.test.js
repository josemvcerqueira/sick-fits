import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

import CartCount from "../components/CartCount";

describe("<CartCount/>", () => {
	const wrapper = shallow(<CartCount count={10} />);

	it("renders", () => {
		// test if the component renders
		shallow(<CartCount count={10} />);
	});

	it("matches the snapshot", () => {
		// you do not need to snapshot an entire component
		expect(toJSON(wrapper)).toMatchSnapshot();
	});

	it("updates via props", () => {
		expect(toJSON(wrapper)).toMatchSnapshot();
		wrapper.setProps({ count: 12 });
		expect(toJSON(wrapper)).toMatchSnapshot();
	});
});
