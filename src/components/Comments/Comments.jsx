import { useState } from "react";

import CommentCard from "../CommentCard/CommentCard";
import NewComment from "../NewComment/NewComment"

import styles from "./Comments.module.css"

const Comments = (props) => {
  const [selectedComment, setSelectedComment] = useState(null)

  const sortedComments = props.comments.slice().sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt)})

  return (
    <div className={styles.commentTester}>
      <NewComment user={props.user} handleAddComment={props.handleAddComment} />
      {props.comments.length > 0 ? (
        <>
        <h4 className={styles.commentH4Title} >Read existing comments below</h4>
        </>
      ): (
        <>
        <h4 className={styles.commentH4Title}>No Comments Have Been Added Yet</h4>
        </>
      )}
      <div className={styles.commentCardContainer}>
      {sortedComments.map((comment) => (
        <CommentCard 
          key={`edit-${comment._id}`} 
          comment={comment} 
          commentId={comment._id}
          comments={props.comments}
          user={props.user}
          volumeId={props.volumeId}
          setSelectedComment={setSelectedComment}
          handleDeleteComment={async () => {
            await props.handleDeleteComment(
              props.volumeId,
              comment._id
            );
          }}
          handleUpdateComment={props.handleUpdateComment}
          selectedComment={selectedComment}
        />
      ))}
      </div>
    </div>
  )
}

export default Comments;
