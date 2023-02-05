import { CourierClient } from "@trycourier/courier";
import { ABSOLUTE_URL } from "../graphql/resolvers/utils";

const courier = CourierClient({ authorizationToken: "pk_prod_9AMCPRZA2MM1GKGAX8NPA99CKXPV" });

const resetPassword = async ({ token, email, _id }: CourierTemplateArguments) => `${ABSOLUTE_URL}/business/reset-password?token=${token}&email=${email}&_id=${_id}`

const requestAccountCreation = ({ token, email }: CourierTemplateArguments) => `${ABSOLUTE_URL}/business/create-account?token=${token}&email=${email}`

const templates = {
  "add-new-emlployee": {
    templateId: "PYWVC60XX742QGJW47PSG58X8T0W",
    getUrl: resetPassword,
  },
  "reset-password": {
    templateId: "DWCK46XWTH4GHYG03D1NFZAMYN6J",
    getUrl: resetPassword,
  },
  "request-account-creation": {
    templateId: "8ETVZCQK0KM7S5KK5YMEBXCDYH3T",
    getUrl: requestAccountCreation
  },
  "add-new-business": {
    templateId: "2TEH08V5Z14J04K7N3SA3VMT38WN",
    getUrl: () => ''
  },
} as const


type CourierTemplate = keyof typeof templates

type CourierTemplateArguments = {
  template: CourierTemplate;
  email: string;
  token: string,
  _id: string;
  name: string;
}

export async function sendCourierEmail({
  template,
  email,
  _id,
  token,
  name
}: CourierTemplateArguments) {

  const url = templates[template].getUrl({
    _id,
    email,
    token,
    template,
    name
  })

  const { requestId } = await courier.send({
    message: {
      to: {
        email,
        data: {
          name,
          url,
        },
      },
      template,
      routing: {
        method: "single",
        channels: ["email"],
      },
    },
  });

  return { ok: !!requestId, url }
}