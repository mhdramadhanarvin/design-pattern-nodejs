exports.up = (pgm) => {
  pgm.createTable("replies_comment", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    thread: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    comment: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    deleted_at: {
      type: "TIMESTAMP", 
      defaultValue: null,
    }, 
  })

  pgm.addConstraint(
    "replies_comment",
    "fk_replies_comment.thread_threads.id",
    "FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE"
  )
  pgm.addConstraint(
    "replies_comment",
    "fk_replies_comment.comment_comments.id",
    "FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE"
  )
  pgm.addConstraint(
    "replies_comment",
    "fk_replies_comment.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  )
}

exports.down = (pgm) => {
  pgm.dropTable("replies_comment")
}
