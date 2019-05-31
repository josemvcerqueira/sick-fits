import { Component } from "react";

import Header from "./Header";
import Meta from "./Meta";

class Layout extends Component {
	render() {
		return (
			<div>
				<Meta />
				<Header />
				<p>Hey I'm the page component</p>
				{this.props.children}
			</div>
		);
	}
}

export default Layout;
