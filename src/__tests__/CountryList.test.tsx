import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
    expect(screen.getByTestId("country-dropdown")).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    expect(screen.getByText(/Get List/)).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", () => {
    server.send(fake_payment_methods);
    expect(screen.getByTestId("table-body")).not.toBe(false);
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
    const placeholder_option = screen.getByText("Please select a country");
    const selected_option =
      screen.getByTestId<HTMLSelectElement>("country-dropdown")
        .selectedOptions[0];
    expect(selected_option).toEqual(placeholder_option);
  });

  it("Should render Clear button as disabled", () => {
    const clear_button = screen.getByText<HTMLButtonElement>(/Clear/);
    expect(clear_button.disabled).toBe(true);
  });

  it("Should change the selected option properly", async () => {
    server.send(fake_residence_list);
    const dropdown = screen.getByTestId<HTMLSelectElement>(/country-dropdown/);
    await user.selectOptions(dropdown, "in");
    expect(dropdown.selectedOptions[0].value).toBe("in");
  });

  it("Should render Clear button as enabled after country selection", async () => {
    server.send(fake_residence_list);
    const dropdown = screen.getByTestId<HTMLSelectElement>("country-dropdown");
    await user.selectOptions(dropdown, "in");
    const clear_button = screen.getByText<HTMLButtonElement>("Clear");
    expect(clear_button.disabled).toBe(false);
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    server.send(fake_payment_methods);
    const get_button = screen.getByText(/Get List/);
    await user.click(get_button);
    expect(screen.getByTestId(/table-body/)).toBeInTheDocument();
  });

  it("Should clear dropdown on Clear button Click", async () => {
    const placeholder_option = screen.getByText("Please select a country");
    const dropdown = screen.getByTestId<HTMLSelectElement>(/country-dropdown/);
    const clear_button = screen.getByText<HTMLButtonElement>("Clear");
    await user.click(clear_button);
    expect(dropdown.selectedOptions[0]).toBe(placeholder_option);
  });
});
