const AddComment = require("../../Domains/comments/entities/AddComment")

class AddThreadUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute(useCasePayload) {
    const { thread } = useCasePayload
    await this._threadRepository.checkThreadExist(thread)
    const addComment = new AddComment(useCasePayload)
    return this._commentRepository.addComment(addComment)
  }
}

module.exports = AddThreadUseCase