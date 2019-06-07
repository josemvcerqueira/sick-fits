import { PureComponent } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import PropTypes from "prop-types";

import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CART_MUTATION = gql`
	mutation removeFromCart($id: ID!) {
		removeFromCart(id: $id) {
			id
		}
	}
`;

const BigButton = styled.button`
	font-size: 3rem;
	background: none;
	border: 0;
	&:hover {
		color: ${props => props.theme.red};
		cursor: pointer;
	}
`;

class RemoveFromCart extends PureComponent {
	static propTypes = {
		id: PropTypes.string.isRequired
	};
	render() {
		const { id } = this.props;
		return (
			<Mutation mutation={REMOVE_FROM_CART_MUTATION} variables={{ id }}>
				{(removeFromCart, { loading }) => {
					return (
						<BigButton
							disabled={loading}
							onClick={() => {
								removeFromCart().catch(err =>
									alert(err.message)
								);
							}}
							title="Delete Item"
						>
							&times;
						</BigButton>
					);
				}}
			</Mutation>
		);
	}
}

export default RemoveFromCart;
