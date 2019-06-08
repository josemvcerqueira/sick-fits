import PleaseSignIn from "../components/PleaseSignin";

import Order from "../components/Order";

const OrderPage = ({ query }) => (
	<PleaseSignIn>
		<Order id={query.id} />
	</PleaseSignIn>
);

export default OrderPage;
