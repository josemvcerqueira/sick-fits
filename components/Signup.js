import { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import Error from "./ErrorMessage";

const SIGNUP_MUTATION = gql`
	mutation SIGNUP_MUTATION(
		$email: String!
		$name: String!
		$password: String!
	) {
		signup(email: $email, name: $name, password: $password) {
			id
			email
			name
		}
	}
`;

class Signup extends Component {
	state = {
		name: "",
		password: "",
		email: ""
	};

	saveToState = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { email, name, password } = this.state;
		const { saveToState, state } = this;
		return (
			<Mutation mutation={SIGNUP_MUTATION} variables={state}>
				{(signup, { error, loading }) => {
					return (
						<Form
							method="post"
							onSubmit={async event => {
								event.preventDefault();
								await signup();
								this.setState({
									name: "",
									email: "",
									password: ""
								});
							}}
						>
							<Error error={error} />
							<fieldset disabled={loading} aria-busy={loading}>
								<h2>Sign Up for An Account </h2>
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
								<label htmlFor="name">
									Name
									<input
										type="text"
										name="name"
										placeholder="Name"
										value={name}
										onChange={saveToState}
									/>
								</label>
								<label htmlFor="name">
									Password
									<input
										type="password"
										name="password"
										placeholder="Password"
										value={password}
										onChange={saveToState}
									/>
								</label>
								<button type="submit">Sign up</button>
							</fieldset>
						</Form>
					);
				}}
			</Mutation>
		);
	}
}

export default Signup;
