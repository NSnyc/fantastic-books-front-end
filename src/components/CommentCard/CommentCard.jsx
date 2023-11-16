import React, { useState, useEffect } from 'react';
import styles from './CommentCard.module.css';
// import EditComment from '../EditComment/EditComment';

const CommentCard = (props) => {
  const [isEditingComment, setIsEditingComment] = useState(false)
  const [formData, setFormData] = useState({
    text: props.comment?.text,
    rating: props.comment?.rating,
  })
  
  const handleToggleEditForm = () => {
    console.log('selectedComment:', props.comment)
    setIsEditingComment(!isEditingComment);
    const selectedComment = props.comments.find((element) => element._id === props.comment._id);
    props.setSelectedComment(selectedComment)
  };
  
  useEffect(() => {
    setFormData({
      text: props.comment?.text,
      rating: props.comment?.rating,
    });
  }, [props.comment]);

  
  const handleCancelEdit = () => {
    setIsEditingComment(false)
  }

  const handleTextChange = event => {
    setFormData(prevState => ({ ...prevState, text: event.target.value }));
  }
  
  const handleRatingChange = event => {
    const ratingValue = parseInt(event.target.value, 10);
    setFormData(prevState => ({ ...prevState, rating: ratingValue }));
  }
  

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    console.log("Submitting with:", props.volumeId, props.commentId, formData);
    await props.handleUpdateComment(props.volumeId, props.commentId, formData)
    setIsEditingComment(false)
  }
  
  const handleCancel = () => {
    handleCancelEdit()
  }
  
  const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  
  function getRatingEmojis(rating) {
    if (rating < 1 || rating > 5) {
      return 'Invalid Rating';
    }
    return '⭐'.repeat(rating);
  }
  
  
  return (
    <article className={styles.commentCard}>
      {isEditingComment ? (
        <div className={styles.editComment}>
          <h2 className={`${styles.editComment} ${styles.h2Edit}`}>Edit Comment</h2>
          <textarea
            name="text"
            type="text"
            id="text-input"
            value={formData.text}
            onChange={handleTextChange}
          />
          <div className={styles.dropdown}> 
          <label htmlFor="rating" className={styles.dropdownLabel}>Rating:</label>
          <select
            name="rating"
            id="rating"
            className={styles.dropdownSelect} 
            value={formData.rating}
            onChange={handleRatingChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        </div>
          <div className={styles.btnRow}>
            <button className={styles.submit} onClick={handleSubmit}>
              Save
            </button>
            <button className={styles.cancel} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.commentText}>
          <p className={styles.commentText}>{props.comment.text}</p>
          <div className={styles.commenterSection}>
            {props.comment.commenter.photo && (
              <div className={styles.namePhoto}>
                <img
                  src={props.comment.commenter.photo}
                  alt={`Photo of ${props.comment.commenter.name}`}
                  className={styles.commenterPhoto}
                />
              </div>
            )}
          <p className={styles.name}>— {props.comment.commenter.name}</p>
          <p className={styles.emojis}>{getRatingEmojis(props.comment.rating)}</p>
          <p className={styles.date}>{formatDate(props.comment.createdAt)}</p>
          </div>
  
          <div className={styles.commentButtons}>
            {props.user.profile === props.comment.commenter._id && (
              <div className={styles.editDeleteBtns}>
                <button onClick={handleToggleEditForm} disabled={props.isEditingComment === props.comment._id}>
                  ✏️
                </button>
                <button
                  onClick={() => props.handleDeleteComment(props.volumeId, props.comment._id)}
                  disabled={props.isEditingComment === props.comment._id}>
                  🗑️
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
};
  
  export default CommentCard;
  