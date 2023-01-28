const AddComment = require("../../../Domains/comments/entities/AddComment")
const AddedComment = require("../../../Domains/comments/entities/AddedComment")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const CommentRepository = require("../../../Domains/comments/CommentRepository")
const AddReplyCommentUseCase = require("../AddReplyCommentUseCase")

describe("AddReplyCommentUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "Dicoding Indonesia",
      thread: "thread-123",
      owner: "user-123",
      comment: "comment-123"
    }
    const expectedAddedReplyComment = new AddedComment({
      id: "replycomment-123",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    })

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository() 
    const mockCommentRepository = new CommentRepository() 

    /** mocking needed function */  
    mockThreadRepository.checkThreadExist = jest.fn(() => Promise.resolve())
    mockCommentRepository.checkCommentExist = jest.fn(() => Promise.resolve())
    mockCommentRepository.addReplyComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReplyComment))

    /** creating use case instance */
    const getReplyCommentUseCase = new AddReplyCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    const addedReplyComment = await getReplyCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.thread)
    expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.comment)
    expect(addedReplyComment).toStrictEqual(expectedAddedReplyComment) 
    expect(mockCommentRepository.addReplyComment).toBeCalledWith(new AddComment({
      content: useCasePayload.content, 
      thread: useCasePayload.thread,
      owner: useCasePayload.owner
    }))
  })
})