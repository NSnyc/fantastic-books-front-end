import CommentCard from "../CommentCard/CommentCard";

const Comments = (props) => {
  if (!props.comments.length) {
    return <h4>No Comments</h4>;
  }

  return (
    <div>
      {props.comments.map((comment) => (
        <CommentCard 
          key={comment._id} 
          comment={comment} 
          user={props.user}
          volumeId={props.volumeId}

        />

      ))}
    </div>
  );
}

export default Comments;
