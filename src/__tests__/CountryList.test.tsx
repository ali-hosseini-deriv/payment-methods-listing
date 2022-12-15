import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
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
    const dropdown = screen.getByTestId('country-dropdown')
    expect(dropdown).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    const list_button = screen.getByRole('button', {
      name: /get-list/i
    })
    expect(list_button).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    const clear_list_button = screen.getByRole('button', {
      name: /clear-list/i
    })
    expect(clear_list_button).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", () => {
    const table_body = screen.queryByTestId('table-body')
    expect(table_body).toBeNull();
  });

  it("Should get residence list on first render from websocket server", async () => {
    await expect(server).toReceiveMessage({ residence_list: 1 });
  });

  it("Should render the options list properly", async () => {
    server.send(fake_residence_list);
    const options = screen.getAllByRole("option");
    expect(options.length).toBe(fake_residence_list.residence_list.length + 1);
  });

  it("Should have placeholder option as selected", () => {
    const dropdown = screen.getByTestId('country-dropdown');
    const placeholder = screen.queryByRole('option', {name: /placeholder/i})
    expect(dropdown).toBeInTheDocument();
    expect(placeholder).toBeVisible();
  });

  it("Should render Clear button as disabled", () => {
    const clear_list_button = screen.getByRole('button', {
      name: /clear-list/i
    })
    expect(clear_list_button).toBeDisabled();
  });

  it.only("Should change the selected option properly", async () => {
    const dropdown = screen.getByTestId('country-dropdown');
    const placeholder = screen.queryByRole('option', {name: /placeholder/i})
    expect(dropdown).toBeInTheDocument();
    expect(placeholder).toBeVisible();

    // How do I wait for the options to be loaded first?
    
    // userEvent.selectOptions(dropdown, 'br');
    // expect(placeholder).not.toBeVisible();
  });

  it("Should render Clear button as enabled after country selection", async () => {
    expect(true).toBe(false)
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    expect(true).toBe(false)
  });

  it("Should clear dropdown on Clear button Click", async () => {
    expect(true).toBe(false)
  });
});
