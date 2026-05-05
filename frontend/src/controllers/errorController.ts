import ModalErrorReporComponent from "@/components/error/ModalErrorReporComponent.vue";
// import { ErrorReport, } from "@/services/interfaces";
import { modalController, toastController } from "@ionic/vue";
import { AxiosError } from "axios";
import { alertCircleOutline, closeOutline } from "ionicons/icons";
import { getApiConnector } from "@/apiConnector";

export default class ErrorController {
  handleError(params: { error: unknown }) {
    const { error } = params;

    if (error instanceof AxiosError) {
      if (error.response) {
        const status = error.response.status;
        const errorDetail =
          error.response.data?.message || "No se especifica el error";
        throw new CustomError("Server Error", status, errorDetail, error);
      } else if (error.request) {
        throw new CustomError(
          "No response received from server",
          undefined,
          undefined,
          error,
        );
      } else {
        throw new CustomError(
          `Axios Error: ${error.message}`,
          undefined,
          undefined,
          error,
        );
      }
    } else if (error instanceof Error) {
      throw new CustomError(`${error.message}`, undefined, undefined, error);
    } else {
      throw new CustomError("An unknown error occurred", undefined, undefined);
    }
  }

  async openToastError(params: { error: Error }) {
    const error = params.error;

    try {
      const toast = await toastController.create({
        header: "Ocurrió un error",
        message: "¿Quieres reportar el error?",
        icon: alertCircleOutline,
        position: "bottom",
        color: "danger",
        buttons: [
          {
            text: "Reportar",
            handler: () => {
              this.openModalReportError({ error });
            },
          },
          {
            icon: closeOutline,
            role: "cancel",
            handler: () => {
              // console.log("Cancel clicked");
            },
          },
        ],
      });
      await toast.present();
    } catch (error) {
      return this.handleError({ error });
    }
  }

  async openModalReportError(params: { error: Error }) {
    const { error } = params;

    const modal = await modalController.create({
      component: ModalErrorReporComponent,
      componentProps: {
        error,
      },
    });
    await modal.present();
  }

  async sendErrorReport(params: {
    message: string;
    stack: string;
    comments: string;
  }) {
    const { message, stack, comments } = params;
    try {
    await getApiConnector().post("error-report", { message, stack, comments });
    } catch (error) {
      return this.handleError({ error });
    }
  }

  getError(params: { error: unknown }): CustomError {
    const { error } = params;

    if (error instanceof AxiosError) {
      if (error.response) {
        const status = error.response.status;
        const errorDetail =
          error.response.data?.message || "No se especifica el error";
        return new CustomError("Server Error", status, errorDetail, error);
      } else if (error.request) {
        return new CustomError(
          "No response received from server",
          undefined,
          undefined,
          error,
        );
      } else {
        return new CustomError(
          `Axios Error: ${error.message}`,
          undefined,
          undefined,
          error,
        );
      }
    } else if (error instanceof Error) {
      return new CustomError(`${error.message}`, undefined, undefined, error);
    } else {
      return new CustomError("An unknown error occurred", undefined, undefined);
    }
  }
}

class CustomError extends Error {
  public status?: number;
  public errorDetail?: string;

  constructor(
    message: string,
    status?: number,
    errorDetail?: string,
    cause?: Error,
  ) {
    super(message);
    this.status = status;
    this.errorDetail = errorDetail;
    if (cause) {
      this.cause = cause;
    }
  }
}
