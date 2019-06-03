import { Component } from "react";
import Router from "next/router";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Error from "./ErrorMessage";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";

const CREATE_ITEM_MUTATION = gql`
	mutation CREATE_ITEM_MUTATION(
		$title: String!
		$description: String!
		$price: Int!
		$image: String
		$largeImage: String
	) {
		createItem(
			title: $title
			description: $description
			price: $price
			image: $image
			largeImage: $largeImage
		) {
			id
		}
	}
`;

class CreateItem extends Component {
	state = {
		title: "",
		description: "",
		image: "",
		largeImage: "",
		price: 0
	};

	handleChange = event => {
		const { name, type, value } = event.target;
		const val = type === "number" ? parseFloat(value) : value;
		this.setState({ [name]: val });
	};

	uploadFile = async event => {
		const files = event.target.files;
		const data = new FormData();
		data.append("file", files[0]);
		data.append("upload_preset", "sickfits");

		const res = await fetch(
			"https://api.cloudinary.com/v1_1/digcho0qy/image/upload",
			{
				method: "POST",
				body: data
			}
		);

		const file = await res.json();
		this.setState({
			image: file.secure_url,
			largeImage: file.eager[0].secure_url
		});
	};

	render() {
		const { title, description, price, image, largeImage } = this.state;
		const { handleChange, uploadFile, state } = this;

		return (
			<Mutation mutation={CREATE_ITEM_MUTATION} variables={state}>
				{(createItem, { loading, error }) => (
					<Form
						onSubmit={async event => {
							if (!image || !largeImage) return;
							// Stop the form from submitting
							event.preventDefault();
							// call the mutation
							const res = await createItem();
							Router.push({
								pathname: "/item",
								query: { id: res.data.createItem.id }
							});
						}}
					>
						<Error error={error} />
						<fieldset disabled={loading} aria-busy={loading}>
							<label htmlFor="file">
								Image
								<input
									type="file"
									id="file"
									name="file"
									placeholder="Upload an Image"
									onChange={uploadFile}
									required
								/>
								{image && (
									<img
										src={image}
										width="200"
										alt="Upload Preview"
									/>
								)}
							</label>
							<label htmlFor="title">
								Title
								<input
									type="text"
									id="title"
									name="title"
									placeholder="Title"
									value={title}
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
									value={price}
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
									value={description}
									onChange={handleChange}
									required
								/>
							</label>
							<button type="submit">Submit</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		);
	}
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
