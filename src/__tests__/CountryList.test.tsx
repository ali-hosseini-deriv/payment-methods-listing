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
    const element = screen.getByTestId("country-dropdown");
    expect(element).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    const element = screen.getByTestId("get-list-button");
    expect(element).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    const element = screen.getByTestId("clear-button");
    expect(element).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", async () => {
    const element = await screen.queryByTestId("table-body");
    expect(element).not.toBeInTheDocument();
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
    const options = screen.getAllByRole<HTMLOptionElement>("option");

    expect(options[0].selected).toBe(true);
  });

  it("Should render Clear button as disabled", () => {
    const element = screen.getByTestId("clear-button");
    expect(element).toBeDisabled();
  });

  it("Should change the selected option properly", async () => {
    server.send(fake_residence_list);
    const element = screen.getByTestId("country-dropdown");
    const options = screen.getAllByRole<HTMLOptionElement>("option");

    await userEvent.selectOptions(
      element,
      fake_residence_list.residence_list[2].value
    );
    expect(options[3].selected).toBe(true);
  });

  it("Should render Clear button as enabled after country selection", async () => {
    server.send(fake_residence_list);

    const element = screen.getByTestId("country-dropdown");
    const button = screen.getByTestId("clear-button");

    await userEvent.selectOptions(
      element,
      fake_residence_list.residence_list[2].value
    );

    expect(button).toBeEnabled();
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    server.send(fake_residence_list);

    const element = screen.getByTestId("country-dropdown");
    const button = screen.getByTestId("get-list-button");

    await userEvent.selectOptions(
      element,
      fake_residence_list.residence_list[2].value
    );
    userEvent.click(button);
    server.send(fake_payment_methods)
    const table = screen.queryByTestId('table-body');
    expect(table).toBeInTheDocument();
  });

  it("Should clear dropdown on Clear button Click", async () => {
    server.send(fake_residence_list);

    const element = screen.getByTestId("country-dropdown");
    const button = screen.getByTestId("clear-button");

    await userEvent.selectOptions(
      element,
      fake_residence_list.residence_list[2].value
    );
    expect (button).toBeEnabled();
    await userEvent.click(button);
    expect (button).toBeDisabled();
    expect(fake_residence_list.residence_list[0])

  });
});
