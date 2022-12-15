import { cleanup, render, screen, fireEvent } from "@testing-library/react";
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
    expect(screen.getByTestId('country-dropdown')).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    expect(screen.getByRole('button', { name: /get list/i })).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", () => {
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.queryByTestId('table-body')).toBeNull();
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
    expect((screen.getByRole('option', { name: /please select a country/i }) as HTMLOptionElement).selected).toBe(true);
  });

  it("Should render Clear button as disabled", () => {
    expect(screen.getByRole('button', { name: /clear/i })).toBeDisabled();
  });

  it("Should change the selected option properly", async () => {
    server.send(fake_residence_list);
    fireEvent.change(screen.getByTestId('country-dropdown'), { target: { value: 'in' } });
    expect((screen.getByRole('option', { name: /india - in/i }) as HTMLOptionElement).selected).toBe(true);
  });

  it("Should render Clear button as enabled after country selection", async () => {
    expect(screen.getByRole('button', { name: /clear/i })).toBeDisabled();
    server.send(fake_residence_list);
    fireEvent.change(screen.getByTestId('country-dropdown'), { target: { value: 'in' } });
    expect((screen.getByRole('option', { name: /india - in/i }) as HTMLOptionElement).selected).toBe(true);
    expect(screen.getByRole('button', { name: /clear/i })).toBeEnabled();
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    server.send(fake_residence_list);
    fireEvent.change(screen.getByTestId('country-dropdown'), { target: { value: 'id' } });
    expect((screen.getByRole('option', { name: 'Indonesia - id' }) as HTMLOptionElement).selected).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /get list/i }));
    server.send(fake_payment_methods);
    expect(screen.getByTestId('table-body')).toBeInTheDocument();
  });

  it("Should clear dropdown on Clear button Click", async () => {
    expect(screen.getByRole('button', { name: /clear/i })).toBeDisabled();
    server.send(fake_residence_list);
    fireEvent.change(screen.getByTestId('country-dropdown'), { target: { value: 'in' } });
    expect((screen.getByRole('option', { name: /india - in/i }) as HTMLOptionElement).selected).toBe(true);
    expect(screen.getByRole('button', { name: /clear/i })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect((screen.getByRole('option', { name: /please select a country/i }) as HTMLOptionElement).selected).toBe(true);
  });
});
