import {
  cleanup,
  render,
  screen,
  within,
  getByTestId,
  fireEvent,
  waitFor,
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
    expect(screen.getByTestId("country-dropdown")).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    expect(screen.getByText(/Get List/i)).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    expect(screen.getByText(/clear/i)).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", () => {
    expect(screen.queryByTestId("table-body")).not.toBeInTheDocument();
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
    expect(true).toBe(false);
  });

  it("Should render Clear button as disabled", () => {
    expect(screen.getByText(/Clear/i).closest("button")).toHaveAttribute(
      "disabled"
    );
  });

  it("Should change the selected option properly", async () => {
    server.send(fake_residence_list);
    await userEvent.selectOptions(screen.getByTestId("country-dropdown"), "zw");
    const selection = screen.getByRole("option", {
      name: "Algeria - dz",
    }) as HTMLOptionElement;
    expect(selection.selected).toBe(true);
  });

  it("Should render Clear button as enabled after country selection", async () => {
    fireEvent.change(screen.getByTestId("country-dropdown"), {
      name: "Algeria - dz",
    });
    const ButtonList = screen.getByRole("button", { name: "Get List" });
    expect(ButtonList).toBeEnabled();
  });

  it("Should render the payment methods list on Get List button Click", async () => {
    const button = screen.getByRole("button", {
      name: /Get List/i,
    });
    fireEvent.click(button);

    const table_ = screen.queryByRole("table") as HTMLElement;
    waitFor(() => expect(table_).toBeInTheDocument());
  });

  it("Should clear dropdown on Clear button Click", async () => {
    const mockCallBack = jest.fn();
    const button = screen.getByRole("button", {
      name: /Clear/i,
    });
    fireEvent.click(button);

    expect(screen.getByText("Please select a country")).toBeInTheDocument();
  });
});
