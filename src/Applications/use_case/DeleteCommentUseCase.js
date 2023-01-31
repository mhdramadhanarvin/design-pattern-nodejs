class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository 
    this._commentRepository = commentRepository 
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload
    
    await this._threadRepository.checkThreadExist(threadId)
    await this._commentRepository.checkCommentExist(commentId)
    await this._commentRepository.verifyOwner(commentId, owner)
    await this._commentRepository.deleteComment(commentId)
  }
}

module.exports = DeleteCommentUseCase