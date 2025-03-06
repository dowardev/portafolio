import { FeedbackParams } from "./interfaces";
import { apiConnector } from "@/main";

export default class FeedbackService {
  async createFeedback(params: FeedbackParams): Promise<void> {
    const { userId, name, email, description, contactMe } = params;

    await apiConnector.post({
      url: `feedback/`,
      data: { userId, name, email, description, contactMe },
    });
  }
}
