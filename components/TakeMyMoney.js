import { Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import PropTypes from "prop-types";
import gql from "graphql-tag";

import User, { CURRENT_USER_QUERY } from "./User";
import calcTotalPrice from "../lib/calcTotalPrice";
import Error from "./ErrorMessage";

function totalItems(cart) {
	return cart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
}

class TakeMyMoney extends Component {
	static propTypes = {
		name: PropTypes.string
	};

	onToken = response => {
		console.log("On token called!");
		console.log(response);
	};

	render() {
		const { children } = this.props;

		return (
			<User>
				{({ data: { me } }) => (
					<StripeCheckout
						amount={calcTotalPrice(me.cart)}
						name="Sick Fits"
						description={`Order of ${totalItems(me.cart)}`}
						image={me.cart[0].item && me.cart[0].item.image}
						stripeKey="pk_test_sFFpS5N2YLPOkIMvpX2FZbe600gfYLitiH"
						currency="USD"
						email={me.email}
						token={res => this.onToken(res)}
					>
						{children}
					</StripeCheckout>
				)}
			</User>
		);
	}
}

export default TakeMyMoney;
