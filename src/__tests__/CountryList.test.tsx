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
    const dropdown = screen.getByTestId("country-dropdown");
    expect(dropdown).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    const button = screen.getByText("Get List");
    expect(button).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    const button = screen.getByText("Clear");
    expect(button).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", () => {
    const table = screen.queryByTestId("table-body");
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
    const country_dropdown = screen.getByTestId("country-dropdown");
    const select_placeholder_option = screen.getByRole("option", {
      name: "Please select a country",
    }) as HTMLOptionElement;
    userEvent.selectOptions(country_dropdown, select_placeholder_option);
    expect(select_placeholder_option.selected).toBeTruthy();
  });

  it("Should render Clear button as disabled", () => {
    const clear_button = screen.getByRole("button", { name: /clear/i });
    expect(clear_button).toBeDisabled();
  });

  it("Should render Clear button as disabled", () => {
    const button = screen.getByText("Clear");
    expect(button).toBeDisabled();
  });

  it("Should change the selected option properly", async () => {
    server.send(fake_residence_list);
    const dropdown = screen.getByTestId(
      "country-dropdown"
    ) as HTMLOptionElement;

    await userEvent.selectOptions(dropdown, "zw");

    const placeholder = screen.getByRole("option", {
      name: "Zimbabwe - zw",
    }) as HTMLOptionElement;

    expect(placeholder.selected).toBe(true);
  });

  it("Should render Clear button as enabled after country selection", async () => {});

  it("Should render the payment methods list on Get List button Click", async () => {
    fireEvent.change(screen.getByTestId("country-dropdown"), {
      name: "Afghanistan - af",
    });
    const getListButton = screen.getByRole("button", { name: "Get List" });
    expect(getListButton).toBeEnabled();
  });

  it("Should clear dropdown on Clear button Click", async () => {});
});
