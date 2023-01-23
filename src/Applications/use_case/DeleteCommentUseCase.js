class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository 
  }

  async execute(useCasePayload) {
    const { commentId, owner } = useCasePayload
    
    await this._commentRepository.checkCommentExist(commentId)
    await this._commentRepository.verifyOwner(commentId, owner)
    await this._commentRepository.deleteComment(commentId)
  }
}

module.exports = DeleteCommentUseCase