const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase")
const AddReplyCommentUseCase = require("../../../../Applications/use_case/AddReplyCommentUseCase")
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase")
const DeleteReplyCommentUseCase = require("../../../../Applications/use_case/DeleteReplyCommentUseCase")
const LikeUnlikeCommentUseCase = require("../../../../Applications/use_case/LikeUnlikeCommentUseCase")
 
class CommentsHandler {
  constructor(container) {
    this._container = container
 
    this.postCommentHandler = this.postCommentHandler.bind(this)
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
    this.postReplyCommentHandler = this.postReplyCommentHandler.bind(this)
    this.deleteReplyCommentHandler = this.deleteReplyCommentHandler.bind(this)
    this.putLikeUnlikeCommentHandler = this.putLikeUnlikeCommentHandler.bind(this)
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
    const { threadId, commentId } = request.params
    const { id: owner } = request.auth.credentials
    
    const useCasePayload = {
      threadId,
      commentId,
      owner 
    }
    await deleteCommentUseCase.execute(useCasePayload)
    
    return {
      status: "success",
    }
  }
  
  async postReplyCommentHandler(request, h) { 
    const addReplyCommentUseCase = this._container.getInstance(AddReplyCommentUseCase.name)
    const { id: owner } = request.auth.credentials
    const { threadId: thread, commentId: comment } = request.params
  
    const useCasePayload = {
      content: request.payload.content,
      thread,
      owner,
      comment
    }
    const addedReply = await addReplyCommentUseCase.execute(useCasePayload)
    
    return h.response({
      status: "success",
      data: {
        addedReply,
      },
    }).code(201)
  }

  async deleteReplyCommentHandler(request) {
    const deleteReplyCommentUseCase = this._container.getInstance(DeleteReplyCommentUseCase.name)
    const { threadId, commentId, replyCommentId } = request.params
    const { id: owner } = request.auth.credentials
    
    const useCasePayload = {
      threadId,
      commentId,
      replyCommentId,
      owner 
    }
    await deleteReplyCommentUseCase.execute(useCasePayload)
    
    return {
      status: "success",
    }
  }

  async putLikeUnlikeCommentHandler(request) {
    const likeUnlikeCommentUseCase = this._container.getInstance(LikeUnlikeCommentUseCase.name)
    const { threadId, commentId } = request.params
    const { id: userId } = request.auth.credentials

    const useCasePayload = {
      threadId, 
      commentId,
      userId
    }
    await likeUnlikeCommentUseCase.execute(useCasePayload)

    return {
      status: "success",
    }
  }
}

module.exports = CommentsHandler