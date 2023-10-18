const CommentCard = ({ comment, volumeId, user,handleDeleteComment }) => {
  return (
    <article>
      <p>{comment.commenter.name}</p>
      <p>{comment.text}</p>
      <p>{comment.rating}</p>
      <p>{comment.createdAt}</p>

      {comment.commenter._id === user.profile &&
      <>
        <button>Edit</button>
        <button onClick={() => handleDeleteComment(volumeId, comment._id)}>Delete</button>
      </>
      }
    </article>
  );
}

export default CommentCard;
