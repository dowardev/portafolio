import { ContactMessage } from "./interfaces";
import { apiConnector } from "@/main";

import axios from "axios";
import { getUserToken } from "./user";

export default class ContactService {
  async createContactMessage(params: { data: ContactMessage }): Promise<void> {
    const { name, subject, email, description } = params.data;

    await apiConnector.post({ url: `contact/` });
  }
}
