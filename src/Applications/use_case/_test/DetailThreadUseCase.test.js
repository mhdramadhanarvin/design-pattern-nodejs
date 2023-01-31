const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const CommentRepository = require("../../../Domains/comments/CommentRepository")
const DetailThreadUseCase = require("../DetailThreadUseCase")

describe("DetailThreadUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      thread: "thread-123"
    }
    const expectedThread = {
      id: useCasePayload.thread,
      title: "title thread",
      body: "body thread",
      username: "user-123",
      date: "2021-08-08T07:19:09.775Z",
    }
    const expectedComments = [
      {
        id: "comment-123",
        content: "comment-1",
        username: "user-123",
        date: "2021-08-08T07:22:33.555Z",
        deleted_at: "2021-08-08T07:23:33.555Z",
      },
      {
        id: "comment-12345",
        content: "comment-2",
        username: "user-123",
        date: "2021-08-08T07:25:33.555Z"
      }
    ]

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository() 
    const mockCommentRepository = new CommentRepository() 

    /** mocking needed function */  
    mockThreadRepository.checkThreadExist = jest.fn(() => Promise.resolve())
    mockThreadRepository.detailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread))
    mockCommentRepository.getCommentsOnThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments))

    /** creating use case instance */
    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    })

    // Action
    const detailThread = await detailThreadUseCase.execute(useCasePayload)

    // Assert
    expect(detailThread).toStrictEqual({
      thread: {
        id: useCasePayload.thread,
        title: expectedThread.title,
        body: expectedThread.body,
        username: expectedThread.username,
        date: expectedThread.date,
        comments: [
          {
            id: expectedComments[0].id,
            content: "**komentar telah dihapus**",
            username: expectedComments[0].username,
            date: expectedComments[0].date,
            replies: []
          },
          {
            id: expectedComments[1].id,
            content: expectedComments[1].content,
            username: expectedComments[1].username,
            date: expectedComments[1].date,
            replies: []
          },
        ]
      }
    }) 
    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.thread)
    expect(mockThreadRepository.detailThread).toBeCalledWith(useCasePayload.thread)
    expect(mockCommentRepository.getCommentsOnThread).toBeCalledWith(useCasePayload.thread) 
  })
})