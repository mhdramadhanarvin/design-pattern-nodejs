const LikesCommentRepository = require("../LikesCommentRepository")

describe("LikesCommentRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const likesCommentRepository = new LikesCommentRepository()

    // Action and Assert
    await expect(likesCommentRepository.hasLikeComment({})).rejects.toThrowError("LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED") 
    await expect(likesCommentRepository.addUserComment({})).rejects.toThrowError("LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED") 
    await expect(likesCommentRepository.removeUserComment({})).rejects.toThrowError("LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED") 
  })
})