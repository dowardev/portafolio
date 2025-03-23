import { FeedbackParams } from "../services/interfaces";
import { apiConnector } from "@/main";

// controllers
import ErrorController from "./errorController";

export default class FeedbackController {
  private errorController = new ErrorController();

  async createFeedback(params: FeedbackParams): Promise<void> {
    const { userId, name, email, description, contactMe } = params;

    try {
      await apiConnector.post({
        url: `feedback/`,
        data: { userId, name, email, description, contactMe },
      });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }
}
