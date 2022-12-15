import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import WS from "jest-websocket-mock";
import CountryList from "../Components/CountryList";
import { fake_payment_methods } from "./fakes/payment_methods";
import { fake_residence_list } from "./fakes/residence_list";

describe("Payment Method", () => {
  let server: WS;
  let user: UserEvent;
  let client: WebSocket;

  beforeEach(async () => {
    user = userEvent.setup();
    server = new WS("wss://ws.binaryws.com/websockets/v3?app_id=1089", {
      jsonProtocol: true,
    });
    client = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
    render(<CountryList websocket={{ current: client }} />);
  });

  afterEach(() => {
    WS.clean();
    cleanup();
  });

  it("Should render Country Dropdown", () => {
    const countryList = screen.getByTestId("country-dropdown");
    expect(countryList).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    const btn = screen.getByTestId("get-list-btn");
    expect(btn).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    const btn = screen.getByTestId("clear-btn");
    expect(btn).toBeInTheDocument();
  });

  // it("Should not render payment methods table on first render", () => {
  //   const table = screen.getByRole("table");
  //   expect(table).not.toBeInTheDocument();
  // });

  // it("Should get residence list on first render from websocket server", async () => {
  //   await expect(server).toReceiveMessage({ residence_list: 1 });
  // });

  // it("Should render the options list properly", async () => {
  //   server.send(fake_residence_list);
  //   const options = screen.getAllByRole("option");
  //   expect(options.length).toBe(fake_residence_list.residence_list.length + 1);
  // });

  // it("Should have placeholder option as selected", () => {
  //   expect(true).toBe(false)
  // });

  // it("Should render Clear button as disabled", () => {
  //   expect(true).toBe(false)
  // });

  // it("Should change the selected option properly", async () => {
  //   expect(true).toBe(false)
  // });

  // it("Should render Clear button as enabled after country selection", async () => {
  //   expect(true).toBe(false)
  // });

  // it("Should render the payment methods list on Get List button Click", async () => {
  //   expect(true).toBe(false)
  // });

  // it("Should clear dropdown on Clear button Click", async () => {
  //   expect(true).toBe(false)
  // });
});
