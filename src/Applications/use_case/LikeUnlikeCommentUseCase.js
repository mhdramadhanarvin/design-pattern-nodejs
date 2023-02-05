class LikeUnlikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likesCommentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._likesCommentRepository = likesCommentRepository
  }

  async execute({ threadId, commentId, userId }) {
    await this._threadRepository.checkThreadExist(threadId)
    await this._commentRepository.checkCommentExist(commentId)

    const hasLikeComment = await this._likesCommentRepository.hasLikeComment(commentId, userId)

    if (hasLikeComment) { 
      // jika sudah pernah like komentar
      // maka actionnya jadi unlike
      await this._likesCommentRepository.removeUserComment(commentId, userId)
      await this._commentRepository.decrementCommentLike(commentId)
    } else {
      await this._likesCommentRepository.addUserComment(commentId, userId)
      await this._commentRepository.incrementCommentLike(commentId)
    }
  }
}

module.exports = LikeUnlikeCommentUseCase
