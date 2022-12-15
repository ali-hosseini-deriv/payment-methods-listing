import {cleanup, render, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    expect(screen.getByTestId('country-dropdown')).toBeInTheDocument()
  });

  it("Should render Get List button", () => {
    expect(screen.getByText('Get List')).toBeInTheDocument()
  });

  it("Should render Clear button", () => {
    expect(screen.getByText('Clear')).toBeInTheDocument()

  });

  it("Should not render payment methods table on first render", () => {
    expect(screen.getByTestId('country-dropdown')).toBeInTheDocument()
    expect(screen.queryByText('table-body')).not.toBeInTheDocument()
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
    expect(screen.getByText('Please select a country')).toBeInTheDocument()
  });

  it("Should render Clear button as disabled", () => {
    expect(screen.getByText('Clear')).toBeDisabled()
  });

  it("Should change the selected option properly", async () => {
    server.send(fake_residence_list);
    const select_placeholder_option = screen.getByRole("option", {
      name: "Zimbabwe - zw",
    }) as HTMLOptionElement;
    await userEvent.selectOptions(screen.getByTestId('country-dropdown'), select_placeholder_option)
    expect(select_placeholder_option.selected).toBe(true)
  });

  it("Should render Clear button as enabled after country selection", async () => {
    server.send(fake_residence_list);
    const clear_btn = screen.getByText('Clear') as HTMLButtonElement
    expect(clear_btn.disabled).toBe(true)
    const select_placeholder_option = screen.getByRole("option", {
      name: "Zimbabwe - zw",
    }) as HTMLOptionElement;
    await userEvent.selectOptions(screen.getByTestId('country-dropdown'), select_placeholder_option)
    expect(clear_btn.disabled).toBe(false)

  });

  it("Should render the payment methods list on Get List button Click", async () => {
    server.send(fake_residence_list);
    const clear_btn = screen.getByText('Clear') as HTMLButtonElement
    expect(clear_btn.disabled).toBe(true)
    const select_placeholder_option = screen.getByRole("option", {
      name: "Zimbabwe - zw",
    }) as HTMLOptionElement;
    await userEvent.selectOptions(screen.getByTestId('country-dropdown'), select_placeholder_option)
    const get_btn = screen.getByText('Get List')
    expect(clear_btn.disabled).toBe(false)
    await userEvent.click(get_btn)
    server.send(fake_payment_methods);
    expect(screen.getByText('Display Name')).toBeInTheDocument()
    expect(screen.getByText('Supported Currencies')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  });

  it("Should clear dropdown on Clear button Click", async () => {
    server.send(fake_residence_list);
    const clear_btn = screen.getByText('Clear') as HTMLButtonElement
    expect(clear_btn.disabled).toBe(true)
    const select_placeholder_option = screen.getByRole("option", {
      name: "Zimbabwe - zw",
    }) as HTMLOptionElement;
    const select_placeholder_option_default = screen.getByRole("option", {
      name: "Please select a country",
    }) as HTMLOptionElement;
    await userEvent.selectOptions(screen.getByTestId('country-dropdown'), select_placeholder_option)
    expect(select_placeholder_option.selected).toBe(true)
    expect(select_placeholder_option_default.selected).toBe(false)
    await userEvent.click(clear_btn)
    expect(select_placeholder_option.selected).toBe(false)
    expect(select_placeholder_option_default.selected).toBe(true)
  });
});
