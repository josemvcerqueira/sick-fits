import { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

import { CURRENT_USER_QUERY } from "./User";
import Form from "./styles/Form";
import Error from "./ErrorMessage";

const RESET_MUTATION = gql`
	mutation RESET_MUTATION(
		$resetToken: String!
		$password: String!
		$confirmPassword: String!
	) {
		resetPassword(
			resetToken: $resetToken
			password: $password
			confirmPassword: $confirmPassword
		) {
			id
			email
			name
		}
	}
`;

class Reset extends Component {
	static propTypes = {
		resetToken: PropTypes.string.isRequired
	};

	state = {
		password: "",
		confirmPassword: ""
	};

	saveToState = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { password, confirmPassword } = this.state;
		const { saveToState } = this;
		return (
			<Mutation
				mutation={RESET_MUTATION}
				variables={{
					resetToken: this.props.resetToken,
					password: this.state.password,
					confirmPassword: this.state.confirmPassword
				}}
				refetchQueries={[{ query: CURRENT_USER_QUERY }]}
			>
				{(reset, { error, loading }) => {
					return (
						<Form
							method="post"
							onSubmit={async event => {
								event.preventDefault();
								await reset();
								this.setState({
									password: "",
									confirmPassword: ""
								});
							}}
						>
							<fieldset disabled={loading} aria-busy={loading}>
								<h2>Reset Your Password</h2>
								<Error error={error} />
								<label htmlFor="password">
									Password
									<input
										type="password"
										name="password"
										placeholder="Password"
										value={password}
										onChange={saveToState}
									/>
								</label>
								<label htmlFor="confirmPassword">
									Password
									<input
										type="password"
										name="confirmPassword"
										placeholder="Confirm your password"
										value={confirmPassword}
										onChange={saveToState}
									/>
								</label>
								<button type="submit">
									Reset Your Password!
								</button>
							</fieldset>
						</Form>
					);
				}}
			</Mutation>
		);
	}
}

export default Reset;
