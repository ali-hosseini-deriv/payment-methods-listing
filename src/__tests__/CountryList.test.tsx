import {
  cleanup,
  fireEvent,
  render,
  screen,
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

  it("Should render Country Dropdown", () => {
    const dropdown = screen.getByTestId(/country-dropdown/i);
    expect(dropdown).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    const button = screen.getByRole("button", { name: /get list/i });
    expect(button).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    const button = screen.getByRole("button", { name: /clear/i });
    expect(button).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", () => {
    const table = screen.queryByRole("table");
    expect(table).not.toBeInTheDocument();
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
    server.send(fake_residence_list);
    const dropdown = screen.getByTestId(/country-dropdown/i);
    const option = screen.getByRole("option", {
      name: /please select a country/i,
    }) as HTMLOptionElement;
    userEvent.selectOptions(dropdown, option);
    expect(option.selected).toBeTruthy();
  });

  it("Should render Clear button as disabled", () => {
    const button = screen.getByRole("button", { name: /clear/i });
    expect(button).toBeDisabled();
  });

  it("Should change the selected option properly", async () => {
    server.send(fake_residence_list);
    const dropdown = screen.getByTestId(/country-dropdown/i);
    const option = screen.getByText(
      /please select a country/i
    ) as HTMLOptionElement;
    userEvent.selectOptions(dropdown, option);
    expect(option.selected).toBeTruthy();
  });

  // it("Should render Clear button as enabled after country selection", async () => {
  //   //
  // });

  // it("Should render the payment methods list on Get List button Click", async () => {
  //   const button = screen.getByRole("button", { name: /get list/i });
  //   fireEvent.click(button);
  //   await server.send(fake_payment_methods);
  //   expect(screen.getByTestId(/table-body/i)).toBeInTheDocument();
  // });

  // it("Should clear dropdown on Clear button Click", async () => {
  //   const button = screen.getByRole("button", { name: /clear/i });
  //   fireEvent.click(button);
  //   const dropdown = screen.getByRole(/country-dropdown/i);
  // });
});
