import axios from "axios";
import { FeedbackParams } from "./interfaces";
import { apiConnector } from "@/main";

export default class FeedbackService {
  async createFeedback(params: FeedbackParams): Promise<void> {
    const { userId, name, email, description, contactMe, type } = params;

    await apiConnector.post({ url: `feedback/` });
  }
}
