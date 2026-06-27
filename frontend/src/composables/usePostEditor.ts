import PostController from "@/controllers/postController"
import SystemController from "@/controllers/systemController"
import ErrorController from "@/controllers/errorController"

export function usePostEditor() {
  const postController = new PostController()
  const systemController = new SystemController()
  const errorController = new ErrorController()

  async function uploadCover(params: { image: File }): Promise<{ id: string }> {
    const { image } = params
    try {
      const { id } = await postController.updateCover({ image })
      return { id }
    } catch (e) {
      errorController.openToastError({ error: e as Error })
      throw e
    }
  }

  async function getImageURL(params: { name: string }): Promise<string> {
    const { name } = params
    return (await systemController.getImageURL({ name })).url
  }

  function openLoader(params: { color: string }): void {
    systemController.enableLoader({ color: params.color })
  }

  function closeLoader(): void {
    systemController.disableLoader()
  }

  function validateData(params: { title: string; content: string }): boolean {
    return !(!params.title || !params.content)
  }

  return {
    postController,
    systemController,
    errorController,
    uploadCover,
    getImageURL,
    openLoader,
    closeLoader,
    validateData,
  }
}
