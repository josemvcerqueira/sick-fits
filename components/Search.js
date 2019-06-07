import { Component } from "react";
import DownShift from "downshift";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import debounce from "lodash.debounce";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const SEARCH_ITEMS_QUERY = gql`
	query SEARCH_ITEMS_QUERY($searchTerm: String!) {
		items(
			where: {
				OR: [
					{ title_contains: $searchTerm }
					{ description_contains: $searchTerm }
				]
			}
		) {
			id
			image
			title
		}
	}
`;

class AutoComplete extends Component {
	state = {
		items: [],
		loading: false
	};
	onChange = debounce(async (event, client) => {
		console.log("searching...");
		// turn loading on
		this.setState({ loading: true });
		// Manually query apollo client
		const res = await client.query({
			query: SEARCH_ITEMS_QUERY,
			variables: { searchTerm: event.target.value }
		});
		this.setState({
			items: res.data.items,
			loading: false
		});
	}, 400);
	render() {
		const { items, loading } = this.state;
		return (
			<SearchStyles>
				<div>
					<ApolloConsumer>
						{client => (
							<input
								type="search"
								onChange={event => {
									event.persist();
									this.onChange(event, client);
								}}
							/>
						)}
					</ApolloConsumer>
					<DropDown>
						{items.map(item => (
							<DropDownItem key={item.id}>
								<img
									width="50"
									src={item.image}
									alt={item.title}
								/>
								{item.title}
							</DropDownItem>
						))}
					</DropDown>
				</div>
			</SearchStyles>
		);
	}
}

export default AutoComplete;
