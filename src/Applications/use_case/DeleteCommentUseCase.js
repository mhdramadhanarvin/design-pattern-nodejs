class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository 
  }

  async execute(useCasePayload) {
    const { id, owner } = useCasePayload
    
    await this._commentRepository.checkCommentExist(id)
    await this._commentRepository.verifyOwner(id, owner)
    await this._commentRepository.deleteComment(id)
  }
}

module.exports = AddCommentUseCase