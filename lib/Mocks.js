import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser, fakeCartItem } from "./testUtils";

export const notSignedInMocks = [
	{
		request: { query: CURRENT_USER_QUERY },
		result: {
			data: {
				me: null
			}
		}
	}
];

export const signedInMocks = [
	{
		request: { query: CURRENT_USER_QUERY },
		result: { data: { me: fakeUser() } }
	}
];

export const signedInMocksWithCartItems = [
	{
		request: { query: CURRENT_USER_QUERY },
		result: {
			data: {
				me: {
					...fakeUser(),
					cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()]
				}
			}
		}
	}
];
