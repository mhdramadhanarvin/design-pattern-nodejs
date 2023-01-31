class DeleteReplyCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository 
    this._commentRepository = commentRepository 
  }

  async execute(useCasePayload) {
    const { threadId, commentId, replyCommentId, owner } = useCasePayload
    
    await this._threadRepository.checkThreadExist(threadId)
    await this._commentRepository.checkCommentExist(commentId)
    await this._commentRepository.checkCommentExist(replyCommentId)
    await this._commentRepository.verifyOwner(replyCommentId, owner)
    await this._commentRepository.deleteComment(replyCommentId)
  }
}

module.exports = DeleteReplyCommentUseCase