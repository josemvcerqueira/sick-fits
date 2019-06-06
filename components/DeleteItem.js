import { Component, Fragment } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { ALL_ITEMS_QUERY } from "./Items";
import Error from "./ErrorMessage";

const DELETE_ITEM_MUTATION = gql`
	mutation DELETE_ITEM_MUTATION($id: ID!) {
		deleteItem(id: $id) {
			id
		}
	}
`;

class DeleteItem extends Component {
	update = (cache, payload) => {
		// manually update the cache on the client to match the server
		// 1. Read the cache for the items we want
		const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
		// 2. Filter the deleted item out of the page
		data.items = data.items.filter(
			item => item.id !== payload.data.deleteItem.id
		);
		// 3. Put the items back to the cache
		cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
	};

	render() {
		const { update } = this;
		return (
			<Mutation
				mutation={DELETE_ITEM_MUTATION}
				variables={{
					id: this.props.id
				}}
				update={update}
			>
				{(deleteItemMutation, { error }) => (
					<Fragment>
						<Error error={error} />
						<button
							onClick={() => {
								if (
									confirm(
										"Are you sure you want to delete this item?"
									)
								) {
									deleteItemMutation().catch(error => {
										alert(error.message);
									});
								}
							}}
						>
							{this.props.children}
						</button>
					</Fragment>
				)}
			</Mutation>
		);
	}
}

export default DeleteItem;
