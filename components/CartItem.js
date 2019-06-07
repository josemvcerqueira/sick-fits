import styled from "styled-components";
import PropTypes from "prop-types";

import formartMoney from "../lib/formatMoney";

const CartItemStyles = styled.li`
	padding: 1rem 0;
	border-bottom: 1px solid ${props => props.theme.lightGrey};
	display: grid;
	align-items: center;
	grid-template-columns: auto 1fr auto;
	img {
		margin-right: 10px;
	}
	h3,
	p {
		margin: 0px;
	}
`;

const CartItem = ({ cartItem }) => {
	return (
		<CartItemStyles>
			<img
				src={cartItem.item.image}
				width="100"
				alt={cartItem.item.title}
			/>
			<div className="cart-item-details">
				<h3>{cartItem.item.title}</h3>
				<p>
					{formartMoney(cartItem.item.price * cartItem.quantity)}
					{" - "}
					<em>
						{cartItem.quantity} &times;{" "}
						{formartMoney(cartItem.item.price)} each
					</em>
				</p>
			</div>
		</CartItemStyles>
	);
};

CartItem.propTypes = {
	cartItem: PropTypes.object.isRequired
};

export default CartItem;
