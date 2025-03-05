import { apiConnector } from "@/main";

export default class ErrorService {
  async sendError(params: {
    message: string;
    stack: string;
    comments: string;
  }) {
    const { message, stack, comments } = params;

    await apiConnector.post({
      url: `error-report`,
      data: { message, stack, comments },
    });
  }
}
