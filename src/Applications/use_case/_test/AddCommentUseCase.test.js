const AddComment = require("../../../Domains/comments/entities/AddComment")
const AddedComment = require("../../../Domains/comments/entities/AddedComment")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const CommentRepository = require("../../../Domains/comments/CommentRepository")
const AddCommentUseCase = require("../AddCommentUseCase.js")

describe("AddCommentUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "Dicoding Indonesia",
      thread: "thread-123",
      owner: "user-123",
    }
    const expectedAddedComment = new AddedComment({
      id: "comment-123",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    })

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository() 
    const mockCommentRepository = new CommentRepository() 

    /** mocking needed function */  
    mockThreadRepository.checkThreadExist = jest.fn(() => Promise.resolve())
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment))

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.thread)
    expect(addedComment).toStrictEqual(expectedAddedComment) 
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      content: useCasePayload.content, 
      thread: useCasePayload.thread,
      owner: useCasePayload.owner
    }))
  })
})