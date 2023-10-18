import { useState } from "react";

import CommentCard from "../CommentCard/CommentCard";
import EditComment from "../EditComment/EditComment"
import NewComment from "../NewComment/NewComment";
const Comments = (props) => {

  const [isEditingComment, setIsEditingComment] = useState(null)


  const handleCancelEdit = () => {
    setIsEditingComment(null)
  };

  return (
    <div>
      {props.comments.length > 0 ? (
        <>
        <NewComment handleAddComment={props.handleAddComment} />
        <h4>Read the comments below</h4>
        </>
      ): (
        <>
        <h4>No Comments Have Been Added Yet</h4>
        <NewComment handleAddComment={props.handleAddComment} />
        </>
      )}

      {props.comments.map((comment) => (
        <CommentCard 
          key={comment._id} 
          comment={comment} 
          user={props.user}
          volumeId={props.volumeId}
          handleEditComment={() =>
            isEditingComment === comment._id
              ? setIsEditingComment(null)
              : setIsEditingComment(comment._id)
          }
          handleDeleteComment={async () => {
            await props.handleDeleteComment(props.volumeId, comment._id);
          }}
          isEditingComment={isEditingComment} 
          handleCancelEdit={handleCancelEdit} 
        />
      ))}
        {isEditingComment && (
            <EditComment
            volumeId={props.volumeId}
            commentId={isEditingComment}
            user={props.user}
            onCommentUpdate={props.handleCommentUpdate}
            handleCancelEdit={handleCancelEdit}
            comment={props.comments.find((comment) => comment._id === isEditingComment)}
            />

          )}
    </div>
  );
}

export default Comments;
