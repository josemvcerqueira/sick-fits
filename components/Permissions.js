import { PureComponent } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Table from "./styles/Table";
import SickButton from "./styles/SickButton";
import Error from "./ErrorMessage";

const possiblePermissions = [
	"ADMIN",
	"USER",
	"ITEMCREATE",
	"ITEMUPDATE",
	"ITEMDELETE",
	"PERMISSIONUPDATE"
];

const ALL_USERS_QUERY = gql`
	query {
		users {
			id
			name
			email
			permissions
		}
	}
`;

const Permissions = props => (
	<Query query={ALL_USERS_QUERY}>
		{({ data, loading, error }) =>
			console.log(data) || (
				<div>
					<Error error={error} />
					<div>
						<h2>Manage Permissions</h2>
						<Table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									{possiblePermissions.map(permission => (
										<th key={permission}>{permission}</th>
									))}
									<th>👇</th>
								</tr>
							</thead>
							<tbody>
								{data.users.map(user => (
									<User key={user.id} user={user} />
								))}
							</tbody>
						</Table>
					</div>
				</div>
			)
		}
	</Query>
);

class User extends PureComponent {
	render() {
		const { user } = this.props;
		return (
			<tr>
				<td>{user.name}</td>
				<td>{user.email}</td>
				{possiblePermissions.map(permission => (
					<td key={permission}>
						<label htmlFor={`${user.id}-permission-${permission}`}>
							<input type="checkbox" />
						</label>
					</td>
				))}
				<td>
					<SickButton>UPDATE</SickButton>
				</td>
			</tr>
		);
	}
}

export default Permissions;
