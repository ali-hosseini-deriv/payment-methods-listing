import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
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

  it("Should render Country Dropdown", async () => {
    const dropdowns = screen.getByRole("option");
    expect(dropdowns).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    const button_get_lists = screen.getByText(/Get List/i);
    expect(button_get_lists).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    const button_clear = screen.getByText(/Clear/);
    expect(button_clear).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", () => {
    const payment_method_table = screen.queryByRole("table");
    expect(payment_method_table).not.toBeInTheDocument();
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
    expect(true).toBe(false);
  });

  it("Should render Clear button as disabled", () => {
    const button_clear = screen.getByText(/Clear/);
    expect(button_clear).toBeDisabled();
  });

  it("Should change the selected option properly", async () => {
    server.send(fake_residence_list);
    await userEvent.selectOptions(screen.getByTestId("country-dropdown"), "zw");
    const selected = screen.getByRole("option", {
      name: "Zimbabwe - zw",
    }) as HTMLOptionElement;
    expect(selected.selected).toBe(true);
  });

  it("Should render Clear button as enabled after country selection", async () => {
    server.send(fake_residence_list);
    await userEvent.selectOptions(screen.getByTestId("country-dropdown"), "zw");
    const button_clear = screen.getByText(/Clear/);
    expect(button_clear).toBeEnabled();
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    server.send(fake_residence_list);
    await userEvent.selectOptions(screen.getByTestId("country-dropdown"), "zw");
    const button_get_list = screen.getByText(/Get List/);
    await userEvent.click(button_get_list);
    const table_ = screen.queryByRole("table") as HTMLElement;
    waitFor(() => expect(table_).toBeInTheDocument());
  });

  it("Should clear dropdown on Clear button Click", async () => {
    server.send(fake_residence_list);
    await userEvent.selectOptions(screen.getByTestId("country-dropdown"), "zw");
    const button_clear = screen.getByText(/Clear/);
    userEvent.click(button_clear);
    const default_text = screen.getByText(/Please select a country/);
    expect(default_text).toBeInTheDocument();
  });
});
