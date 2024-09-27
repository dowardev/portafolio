import axios from "axios";
import { FeedbackParams } from "./interfaces";
import { getUserToken } from "./user";

export async function createFeedback(params: FeedbackParams): Promise<void> {
  const { userId, name, email, description, contactMe, type } = params;

  await axios.request({
    url: `http://127.0.0.1:8000/api/new-feedback/`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getUserToken(),
    },
    params: {
      userId,
      name,
      email,
      description,
      contactMe,
      type,
    },
  });
}
