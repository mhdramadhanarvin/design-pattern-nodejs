const DetailComment = require("../../Domains/comments/entities/DetailComment")

class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute(useCasePayload) {
    const { thread } = useCasePayload

    await this._threadRepository.checkThreadExist(thread)
    const detailThread = await this._threadRepository.detailThread(thread)
    const getCommentsOnThread = await this._commentRepository.getCommentsOnThread(thread)
    detailThread.comments = new DetailComment({ comments: getCommentsOnThread }).comments
    
    return {
      thread: detailThread 
    }
  }
}

module.exports = DetailThreadUseCase