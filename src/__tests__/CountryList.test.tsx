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
    const list = screen.getByTestId('table-body')
    expect(list).not.toBeInTheDocument()
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
    const option = screen.getByTestId("country-dropdown")
    expect(option).toHaveAttribute("placeholder", "Please select a country")
  });

  it("Should render Clear button as disabled", () => {
    const clearButton = screen.getByRole('button', {name: "Clear"})
    expect(clearButton).toBeDisabled()
  });

  it("Should change the selected option properly", async () => {
    fireEvent.change(screen.getByTestId('country-dropdown'),  { name:  'Afghanistan - af' })
    let options = screen.getAllByTestId('country-dropdown') as HTMLOptionElement
    expect(options[0].selected).toBeFalsy();
    expect(options[1].selected).toBeTruthy();
    expect(options[2].selected).toBeFalsy();
  });

  it("Should render Clear button as enabled after country selection", async () => {
    fireEvent.change(screen.getByTestId('country-dropdown'), { name:  'Afghanistan - af' })
    const clearButton = screen.getByRole('button', {name: "Clear"})
     expect(clearButton).toBeEnabled()
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    fireEvent.change(screen.getByTestId('country-dropdown'),  { name:  'Afghanistan - af' })
    const getListButton = screen.getByRole('button', {name: "Get List"})
    expect(getListButton).toBeEnabled()
  });

  it("Should clear dropdown on Clear button Click", async () => {
    const option = screen.getByTestId("country-dropdown")
    fireEvent.change(screen.getByTestId('country-dropdown'),  { name:  'Afghanistan - af' })
    const clearButton = screen.getByRole('button', {name: "Clear"})
    fireEvent.click(clearButton)
    expect(option).toHaveAttribute("placeholder", "Please select a country")
  });
});
