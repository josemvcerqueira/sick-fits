import { Component } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { format } from "date-fns";
import Head from "next/head";
import gql from "graphql-tag";

import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

class Order extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired
	};

	render() {
		const { id } = this.props;
		return <p>{id}</p>;
	}
}

export default Order;
