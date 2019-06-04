import { Component } from "react";
import Router from "next/router";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";

import Error from "./ErrorMessage";
import Form from "./styles/Form";

const SINGLE_ITEM_QUERY = gql`
	query SINGLE_ITEM_QUERY($id: ID!) {
		item(where: { id: $id }) {
			id
			title
			description
			price
		}
	}
`;

const UPDATE_ITEM_MUTATION = gql`
	mutation UPDATE_ITEM_MUTATION(
		$id: ID!
		$title: String
		$description: String
		$price: Int
	) {
		updateItem(
			id: $id
			title: $title
			description: $description
			price: $price
		) {
			id
			title
			description
			price
		}
	}
`;

class UpdateItem extends Component {
	state = {};

	handleChange = event => {
		const { name, type, value } = event.target;
		const val = type === "number" ? parseFloat(value) : value;
		this.setState({ [name]: val });
	};

	updateItem = async (event, updateItemMutation) => {
		event.preventDefault();
		await updateItemMutation({
			variables: {
				id: this.props.id,
				...this.state
			}
		});
		Router.push({
			pathname: "/"
		});
	};

	render() {
		const { id } = this.props;
		const { handleChange, updateItem } = this;

		return (
			<Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
				{({ data, loading }) => {
					if (loading) return <p>Loading...</p>;
					if (!data.item) return <p>No Item Found for ID:{id}</p>;
					return (
						<Mutation mutation={UPDATE_ITEM_MUTATION}>
							{(updateItemMutation, { loading, error }) => (
								<Form
									onSubmit={event =>
										updateItem(event, updateItemMutation)
									}
								>
									<Error error={error} />
									<fieldset
										disabled={loading}
										aria-busy={loading}
									>
										<label htmlFor="title">
											Title
											<input
												type="text"
												id="title"
												name="title"
												placeholder="Title"
												defaultValue={data.item.title}
												onChange={handleChange}
												required
											/>
										</label>
										<label htmlFor="price">
											Price
											<input
												type="number"
												id="price"
												name="price"
												placeholder="Price"
												defaultValue={data.item.price}
												onChange={handleChange}
												required
											/>
										</label>
										<label htmlFor="description">
											Description
											<textarea
												type="text"
												id="description"
												name="description"
												placeholder="Enter A Description"
												defaultValue={
													data.item.description
												}
												onChange={handleChange}
												required
											/>
										</label>
										<button type="submit">
											Sav{loading ? "ing" : "e"} Changes
										</button>
									</fieldset>
								</Form>
							)}
						</Mutation>
					);
				}}
			</Query>
		);
	}
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
