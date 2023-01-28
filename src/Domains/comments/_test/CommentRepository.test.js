const CommentRepository = require("../CommentRepository")

describe("CommentRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const commentRepository = new CommentRepository()

    // Action and Assert
    await expect(commentRepository.addComment({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED") 
    await expect(commentRepository.deleteComment({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED") 
    await expect(commentRepository.verifyOwner({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED") 
    await expect(commentRepository.checkCommentExist({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED") 
    await expect(commentRepository.getCommentsOnThread({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED") 
    await expect(commentRepository.addReplyComment({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED") 
  })
})