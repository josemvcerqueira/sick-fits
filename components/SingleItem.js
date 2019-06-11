import { PureComponent } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Head from "next/head";
import styled from "styled-components";

import Error from "./ErrorMessage";

const SingleItemStyles = styled.div`
	max-width: 1200px;
	margin: 2rem auto;
	box-shadow: ${props => props.theme.bs};
	display: grid;
	grid-auto-columns: 1fr;
	min-height: 800px;
	grid-auto-flow: row;
	text-align: center;
	padding: 2rem;
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	details {
		margin: 3rem;
		font-size: 2rem;
	}
`;

const SINGLE_ITEM_QUERY = gql`
	query SINGLE_ITEM_QUERY($id: ID!) {
		item(where: { id: $id }) {
			id
			title
			description
			largeImage
		}
	}
`;

class SingleItem extends PureComponent {
	render() {
		const { id } = this.props;
		return (
			<Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
				{({ error, loading, data }) => {
					if (error) return <Error error={error} />;
					if (loading) return <p>Loading...</p>;
					if (!data.item) return <p>No Item Found for {id}</p>;
					const item = data.item;
					return (
						<SingleItemStyles>
							<Head>
								<title>Sick Fits | {item.title}</title>
							</Head>
							<img src={item.largeImage} alt={item.title} />
							<div className="details">
								<h2>{item.title}</h2>
								<p>{item.description}</p>
							</div>
						</SingleItemStyles>
					);
				}}
			</Query>
		);
	}
}

export { SINGLE_ITEM_QUERY };
export default SingleItem;
