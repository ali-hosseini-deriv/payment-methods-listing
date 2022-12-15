import { IResidenceItem } from "../../Components/types"

type TFakeResidenceList = {
  echo_req: object
  msg_type: string
  residence_list: IResidenceItem[]
}

export const fake_residence_list: TFakeResidenceList = {
  echo_req: { residence_list: 1 },
  msg_type: "residence_list",
  residence_list: [
    {
      phone_idd: "91",
      text: "India",
      value: "in",
    },
    {
      phone_idd: "263",
      text: "Zimbabwe",
      value: "zw",
    },
    {
      phone_idd: "62",
      text: "Indonesia",
      value: "id",
    },
    {
      phone_idd: "49",
      text: "Germany",
      value: "de",
    },
    {
      phone_idd: "31",
      text: "Netherlands",
      value: "nl",
    },
  ],
}
