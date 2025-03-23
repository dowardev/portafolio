import { ContactMessage } from "../utils/interfaces";
import { apiConnector } from "@/main";

// controllers
import ErrorController from "./errorController";

export default class ContactController {
  private errorController = new ErrorController();

  async createContactMessage(params: ContactMessage): Promise<void> {
    const { name, subject, email, description } = params;

    try {
      await apiConnector.post({
        url: `contact/`,
        data: { name, subject, email, description },
      });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }
}
