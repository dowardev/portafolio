import { ContactMessage } from "../utils/interfaces";
import { getApiConnector } from "@/apiConnector";

import ErrorController from "./errorController";

export default class ContactController {
  private errorController = new ErrorController();

  async createContactMessage(params: ContactMessage): Promise<void> {
    const { name, subject, email, description } = params;

    try {
      await getApiConnector().post("contact/", { name, subject, email, description });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }
}
