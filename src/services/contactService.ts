import { ContactMessage } from "./interfaces";
import { apiConnector } from "@/main";

export default class ContactService {
  async createContactMessage(params: ContactMessage): Promise<void> {
    const { name, subject, email, description } = params;

    await apiConnector.post({
      url: `contact/`,
      data: { name, subject, email, description },
    });
  }
}
