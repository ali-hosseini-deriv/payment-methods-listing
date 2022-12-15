import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
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
    expect(dropdown).toBeInTheDocument()
  });

  it("Should render Get List button", () => {
    const getListButton = screen.getByRole('button', {name: "Get List"})
    expect(getListButton).toBeInTheDocument()
  });

  it("Should render Clear button", () => {
    const clearButton = screen.getByRole('button', {name: "Clear"})
    expect(clearButton).toBeInTheDocument()
  });

  it("Should not render payment methods table on first render", () => {
   const table =  screen.queryByTestId('table-body')
    expect(table).not.toBeInTheDocument()
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
    const placeholder = screen.getByRole("option", {
      name: "Please select a country",
    }) as HTMLOptionElement;
    expect(placeholder.selected).toBeTruthy();
  });

  it("Should render Clear button as disabled", () => {
    const clearButton = screen.getByRole('button', {name: "Clear"})
    expect(clearButton).toBeDisabled()
  });

  it("Should change the selected option properly", async () => {
    await userEvent.selectOptions(screen.getByTestId('country-dropdown'),  fake_residence_list.residence_list[0].value)
    const options = screen.getAllByRole<HTMLOptionElement>('country-dropdown')
    expect(options[103].selected).toBe(true);
  });

  it("Should render Clear button as enabled after country selection", async () => {
    const dropdown = screen.getByTestId('country-dropdown')
    await userEvent.selectOptions(dropdown, 'Afghanistan - af')
    const clearButton = screen.getByRole('button', {name: "Clear"})
    expect(clearButton).toBeEnabled()
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    const dropdown = screen.getByTestId('country-dropdown')
    await userEvent.selectOptions(dropdown, 'Afghanistan - af')
    const getListButton = screen.getByRole('button', {name: "Get List"})
    fireEvent.click(getListButton)
    const table =  screen.queryByTestId('table-body')
    expect(table).toBeInTheDocument()
  });

  it("Should clear dropdown on Clear button Click", async () => {
    const clearButton = screen.getByRole('button', {name: "Clear"})
    fireEvent.click(clearButton)
    const placeholder = screen.getByRole("option", {
      name: "Please select a country",
    }) as HTMLOptionElement;
    expect(placeholder.selected).toBeTruthy();
  });
});
