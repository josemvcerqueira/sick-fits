import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";

import Order, { SINGLE_ORDER_QUERY } from "../components/Order";
import { fakeOrder } from "../lib/testUtils";
