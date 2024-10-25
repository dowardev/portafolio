import { ContactMessage } from "./interfaces";

import axios from "axios";
import { getUserToken } from "./user";

export async function createContactMessage(params: {
  data: ContactMessage;
}): Promise<void> {
  const { name, subject, email, description } = params.data;

  await axios.request({
    url: `http://127.0.0.1:8000/api/contact/`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getUserToken(),
    },
    params: {
      name,
      subject,
      email,
      description,
    },
  });
}
