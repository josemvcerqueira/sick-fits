import { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { CURRENT_USER_QUERY } from "./User";
import Form from "./styles/Form";
import Error from "./ErrorMessage";

const SIGNIN_MUTATION = gql`
	mutation SIGNIN_MUTATION($email: String!, $password: String!) {
		signin(email: $email, password: $password) {
			id
			email
			name
		}
	}
`;

class Signin extends Component {
	state = {
		password: "",
		email: ""
	};

	saveToState = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { email, password } = this.state;
		const { saveToState, state } = this;
		return (
			<Mutation
				mutation={SIGNIN_MUTATION}
				variables={state}
				refetchQueries={[{ query: CURRENT_USER_QUERY }]}
			>
				{(signup, { error, loading }) => {
					return (
						<Form
							method="post"
							onSubmit={async event => {
								event.preventDefault();
								await signup();
								this.setState({
									email: "",
									password: ""
								});
							}}
						>
							<Error error={error} />
							<fieldset disabled={loading} aria-busy={loading}>
								<h2>Sign into your account</h2>
								<label htmlFor="email">
									Email
									<input
										type="email"
										name="email"
										placeholder="Email"
										value={email}
										onChange={saveToState}
									/>
								</label>
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
								<button type="submit">Signin</button>
							</fieldset>
						</Form>
					);
				}}
			</Mutation>
		);
	}
}

export default Signin;
