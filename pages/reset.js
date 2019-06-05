import Reset from "../components/Reset";

const ResetPage = ({ query }) => (
	<>
		<p>Reset Your Password</p>
		<Reset resetToken={query.resetToken} />
	</>
);

export default ResetPage;
