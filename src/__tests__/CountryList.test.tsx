import { cleanup, render, screen, TestStore, within, act } from "../test-utils";
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
    TestStore.clear();
  });

  it("Should render Country Dropdown", () => {
    const country_dropdown = screen.getByTestId("country-dropdown");
    expect(country_dropdown).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    const find_button = screen.getByRole("button", { name: "Get List" });
    expect(find_button).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    const clear_button = screen.getByRole("button", { name: "Clear" });
    expect(clear_button).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", () => {
    const table = screen.queryByRole("table");
    expect(table).not.toBeInTheDocument();
  });

  it("Should get residence list on first render from websocket server", async () => {
    act(() => {
      expect(server).toReceiveMessage({ residence_list: 1 });
    });
  });

  it("Should render the options list properly", async () => {
    server.send(fake_residence_list);
    const options = screen.getAllByRole("option");
    expect(options.length).toBe(fake_residence_list.residence_list.length + 1);
  });

  it("Should have placeholder option as selected", () => {
    const select_placeholder_option = screen.getByRole("option", {
      name: "Please select a country",
    }) as HTMLOptionElement;

    expect(select_placeholder_option.selected).toBe(true);
  });

  it("Should render Clear button as disabled", () => {
    const clear_button = screen.getByRole("button", { name: "Clear" });
    expect(clear_button).toBeDisabled();
  });

  it("Should change the selected option properly", async () => {
    server.send(fake_residence_list);

    const selectelement = screen.getByTestId("country-dropdown");
    await userEvent.selectOptions(selectelement, "zw");

    const item = screen.getByRole("option", {
      name: `Zimbabwe - zw`,
    }) as HTMLOptionElement;

    expect(item.selected).toBe(true);
  });

  it("Should render Clear button as enabled after country selection", async () => {
    server.send(fake_residence_list);
    const selectelement = screen.getByTestId("country-dropdown");
    await userEvent.selectOptions(selectelement, "zw");
    const clear_button = screen.getByRole("button", { name: "Clear" });
    expect(clear_button).toBeEnabled();
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    server.send(fake_residence_list);

    const selectelement = screen.getByTestId("country-dropdown");
    await userEvent.selectOptions(selectelement, "zw");

    const find_button = screen.getByRole("button", { name: "Get List" });
    await userEvent.click(find_button);
    server.send(fake_payment_methods);

    const table_body = screen.getByTestId("table-body");
    expect(table_body.childElementCount).toBe(
      fake_payment_methods.payment_methods.length
    );

    const within_table_body = within(table_body);

    const id_cell = within_table_body.getByRole("cell", {
      name: "DP2P is Deriv's peer-to-peer deposit and withdrawal service",
    });
    expect(id_cell).toBeInTheDocument();

    const display_name_cell = within_table_body.getByRole("cell", {
      name: /^DP2P$/,
    });
    expect(display_name_cell).toBeInTheDocument();

    const currencies_cell = within_table_body.getByRole("cell", {
      name: fake_payment_methods.payment_methods[0].supported_currencies.join(
        ","
      ),
    });
    expect(currencies_cell).toBeInTheDocument();
  });

  it("Should clear dropdown on Clear button Click", async () => {
    server.send(fake_residence_list);

    const clear_button = screen.getByRole("button", { name: "Clear" });

    expect(clear_button).toBeDisabled();

    const selectelement = screen.getByTestId("country-dropdown");
    await userEvent.selectOptions(selectelement, "zw");

    const item = screen.getByRole("option", {
      name: `Zimbabwe - zw`,
    }) as HTMLOptionElement;

    expect(item.selected).toBe(true);

    await userEvent.click(clear_button);
    const select_placeholder_option = screen.getByRole("option", {
      name: "Please select a country",
    }) as HTMLOptionElement;

    expect(clear_button).toBeDisabled();

    expect(select_placeholder_option.selected).toBe(true);
    const table = screen.queryByRole("table");
    expect(table).not.toBeInTheDocument();
  });
});
