const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase.js")
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase.js")
 
class CommentsHandler {
  constructor(container) {
    this._container = container
 
    this.postCommentHandler = this.postCommentHandler.bind(this)
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
  }
 
  async postCommentHandler(request, h) { 
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
    const { id: owner } = request.auth.credentials
    const { threadId: thread } = request.params

    const useCasePayload = {
      content: request.payload.content,
      thread,
      owner,
    }
    const addedComment = await addCommentUseCase.execute(useCasePayload)
    
    return h.response({
      status: "success",
      data: {
        addedComment,
      },
    }).code(201)
  }

  async deleteCommentHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
    const { commentId } = request.params
    const { id: owner } = request.auth.credentials

    const useCasePayload = {
      commentId,
      owner 
    }
    await deleteCommentUseCase.execute(useCasePayload)

    return {
      status: "success",
    }
  }
}
 
module.exports = CommentsHandler