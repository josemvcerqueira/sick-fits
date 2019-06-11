import { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import Error from "./ErrorMessage";

const REQUEST_RESET_MUTATION = gql`
	mutation REQUEST_RESET_MUTATION($email: String!) {
		requestReset(email: $email) {
			message
		}
	}
`;

class RequestReset extends Component {
	state = {
		email: ""
	};

	saveToState = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { email } = this.state;
		const { saveToState, state } = this;
		return (
			<Mutation mutation={REQUEST_RESET_MUTATION} variables={state}>
				{(reset, { error, loading, called }) => {
					return (
						<Form
							method="post"
							data-test="form"
							onSubmit={async event => {
								event.preventDefault();
								await reset();
								this.setState({
									email: ""
								});
							}}
						>
							<Error error={error} />
							{!error && !loading && called && (
								<p>
									Success! Check your email for a reset link!
								</p>
							)}
							<fieldset disabled={loading} aria-busy={loading}>
								<h2>Request a password reset</h2>
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
								<button type="submit">Request Reset!</button>
							</fieldset>
						</Form>
					);
				}}
			</Mutation>
		);
	}
}

export { REQUEST_RESET_MUTATION };
export default RequestReset;
