import { FeedbackParams } from "@/utils/interfaces";
import { getApiConnector } from "@/apiConnector";

import ErrorController from "./errorController";

export default class FeedbackController {
  private errorController = new ErrorController();

  async createFeedback(params: FeedbackParams): Promise<void> {
    const { userId, name, email, description, contactMe } = params;

    try {
      await getApiConnector().post("feedback/", { userId, name, email, description, contactMe });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }
}
