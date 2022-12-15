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
    const dropdown_el = screen.getByTestId("country-dropdown");

    expect(dropdown_el).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    const get_list_btn_el = screen.getByRole("button", { name: "Get List" });

    expect(get_list_btn_el).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    const clr_list_btn_el = screen.getByRole("button", { name: "Clear" });

    expect(clr_list_btn_el).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", () => {
    const payment_methods_table_el = screen.queryByTestId("table-body");

    expect(payment_methods_table_el).not.toBeInTheDocument();
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
    expect(screen.getByText("Please select a country")).toBeInTheDocument();
  });

  it("Should render Clear button as disabled", () => {
    const clr_list_btn_el = screen.getByRole("button", { name: "Clear" });

    expect(clr_list_btn_el).toBeDisabled();
  });

  it("Should change the selected option properly", async () => {
    server.send(fake_residence_list);

    const select_placeholder_option = screen.getByRole("option", {
      name: "Indonesia - id",
    }) as HTMLOptionElement;

    await user.selectOptions(
      screen.getByTestId("country-dropdown"),
      select_placeholder_option
    );

    expect(select_placeholder_option.selected).toBe(true);
  });

  it("Should render Clear button as enabled after country selection", async () => {
    server.send(fake_residence_list);

    const select_placeholder_option = screen.getByRole("option", {
      name: "Indonesia - id",
    }) as HTMLOptionElement;

    await user.selectOptions(
      screen.getByTestId("country-dropdown"),
      select_placeholder_option
    );

    const clr_list_btn_el = screen.getByRole("button", { name: "Clear" });

    expect(clr_list_btn_el).toBeEnabled();
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    server.send(fake_residence_list);

    const clr_list_btn_el = screen.getByRole("button", {
      name: "Clear",
    }) as HTMLButtonElement;

    expect(clr_list_btn_el.disabled).toBe(true);

    const select_placeholder_option = screen.getByRole("option", {
      name: "Indonesia - id",
    }) as HTMLOptionElement;

    await user.selectOptions(
      screen.getByTestId("country-dropdown"),
      select_placeholder_option
    );

    const get_list_btn_el = screen.getByText("Get List");

    expect(clr_list_btn_el.disabled).toBe(false);

    await user.click(get_list_btn_el);

    server.send(fake_payment_methods);

    expect(screen.getByText("Display Name")).toBeInTheDocument();
    expect(screen.getByText("Supported Currencies")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("Should clear dropdown on Clear button Click", async () => {
    server.send(fake_residence_list);

    const select_placeholder_option = screen.getByRole("option", {
      name: "Indonesia - id",
    }) as HTMLOptionElement;

    await user.selectOptions(
      screen.getByTestId("country-dropdown"),
      select_placeholder_option
    );

    expect(select_placeholder_option.selected).toBe(true);

    const clr_list_btn_el = screen.getByRole("button", { name: "Clear" });

    await userEvent.click(clr_list_btn_el);

    expect(select_placeholder_option.selected).toBe(false);
  });
});
