import axios from "axios";
import { FeedbackParams } from "./interfaces";
import { getUserToken } from "./user";
import { apiConnector } from "@/main";

export async function createFeedback(params: FeedbackParams): Promise<void> {
  const { userId, name, email, description, contactMe, type } = params;

  await apiConnector.post({ url: `feedback/` });
}
