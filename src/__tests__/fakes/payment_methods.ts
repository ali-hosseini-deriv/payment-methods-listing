import { IPaymentMethod } from "../../Components/types"

type TFakePaymentMethods = {
  echo_req: object
  msg_type: string
  payment_methods: IPaymentMethod[]
}
export const fake_payment_methods: TFakePaymentMethods = {
  echo_req: {
    country: "zw",
    payment_methods: 1,
  },
  msg_type: "payment_methods",
  payment_methods: [
    {
      description:
        "DP2P is Deriv's peer-to-peer deposit and withdrawal service",
      display_name: "DP2P",
      id: "DP2P",
      supported_currencies: ["USD"],
    },
  ],
}
