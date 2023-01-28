const AddReplyComment = require("../../Domains/comments/entities/AddReplyComment")

class AddReplyCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute(useCasePayload) {
    const { thread, comment } = useCasePayload
    await this._threadRepository.checkThreadExist(thread)
    await this._commentRepository.checkCommentExist(comment)
    const addReplyComment = new AddReplyComment(useCasePayload)
    return this._commentRepository.addReplyComment(addReplyComment)
  }
}

module.exports = AddReplyCommentUseCase