import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import styles from "./BookDetails.module.css"
import * as bookService from '../../services/bookService'
import { Link } from "react-router-dom"
import * as profileService from '../../services/profileService'
import uglyCat from '/assets/uglycat.png'

//components
import Comments from "../../components/Comments/Comments"

const BookDetails = (props) => {
  const { volumeId } = useParams()
  const [book, setBook] = useState(null)
  const [comments, setComments] = useState([])
  const [shelves, setShelves] = useState([])
  const [selectedShelf, setSelectedShelf] = useState('')
  const [profile, setProfile] = useState({})
  const [modalData, setModalData] = useState({ isOpen: false, name: '', isEditing: false, id: null })
  const inputRef = useRef(null)


  useEffect(() => {
    const fetchShelves = async () => {
      const profileData = await profileService.getOneProfile(props.user.profile)
      setProfile(profileData)
      setShelves(profileData.shelves || [])
    }
    fetchShelves()
  }, [])

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const bookData = await bookService.getBookDetails(volumeId)
        setBook(bookData)
        const comments = await bookService.getComments(volumeId)
        setComments(comments)
      } catch (error) {
        console.error(error)
      }
    }
    fetchBookData()
  }, [volumeId])

  useEffect(() => {
    if (modalData.isOpen && inputRef.current) inputRef.current.focus()
  }, [modalData.isOpen])



  const handleAddComment = async (commentFormData) => {
    const newComment = await bookService.createComment(volumeId, commentFormData)
    if (newComment) {
      setComments((prevComments) => [{...newComment, createdAt: newComment.commenter.createdAt },...prevComments])

      setBook((bookExists) => {
        if (!bookExists || !bookExists.comments) {
          return bookExists
        }
        return { ...bookExists, comments: [...bookExists.comments, {...newComment, createdAt: newComment.commenter.createdAt }] }
      })
    }
  }

  const sortCommentsByCreatedAt = (comments) => {
    return comments.slice().sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }
  
  const handleUpdateComment = async (volumeId, commentId, commentFormData) => {
    try {
      console.log('Updating comment with ID:', commentId)
      const updatedComment = await bookService.updateComment(volumeId, commentId, commentFormData);
      const updatedComments = comments.map((comment) => (comment._id === updatedComment._id ? updatedComment : comment))
      console.log('UPDATEDCOMMENTS',updatedComments)
      setComments(updatedComments);
    } catch (error) {
      console.error(error);
    }
  };

  
  const handleDeleteComment = async (volumeId, commentId) => {
    await bookService.deleteComment(volumeId, commentId)
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    )
    setBook((prevBook) => {
      if (!prevBook || !prevBook.comments) {
        return prevBook
      }
      return {
        ...prevBook,
        comments: prevBook.comments.filter((comment) => comment._id !== commentId),
      }
    })
  }

  const handleSelectedShelf = (event) => {  
    setSelectedShelf(event.target.value )
  }

  const handleAddToShelf = async () => {
    (selectedShelf)
    try {
      (props.user.profile, selectedShelf, volumeId)
      const profileData = await profileService.addBookToShelf(props.user.profile, selectedShelf, volumeId)
      setProfile(profileData)
      setShelves(profileData.shelves || [])
      alert("Book added to shelf!")
    } catch (error) {
      console.error(error)
      alert("Failed to add the book to shelf.")
    }
  }

  const handleShelf = async () => {
    try {
      const newShelf = await profileService.createShelf({ name: modalData.name }, props.user.profile)
      setShelves(prev => [...prev, newShelf])
      setModalData({ isOpen: false, name: '', isEditing: false, id: null })
    } catch (err) { (err) }
  }

  return (
    <main className={styles.main}>
      <div className={styles.spacer}></div>
      {book ? (
      <div className={styles.info}>
        <h1 className={styles.bookTitle}>{book.title}</h1>
      <div className={styles.sideBySide}>
        <img className={styles.cover} src={book.cover} alt="book cover" />
        <div className={styles.bookInfo}>
          {
            shelves.length === 0  && !props.user !== null ? (
              <>
                {props.user ? (
                  <button onClick={() => setModalData({ isOpen: true, isEditing: false,   name: '', id: null })}> Add New Shelf </button> ) : (
                  <></>
                )}
                {modalData.isOpen && (
                  <div className={styles.modalOpen}>
                    <label>Shelf Name:<input ref={inputRef} type="text" value={modalData.name} onChange={e => setModalData({ ...modalData, name: e.target.value })} /></label>
                    <button onClick={handleShelf}>Create</button>
                    <button onClick={() => setModalData({ isOpen: false, name: '', isEditing: false, id: null })}>Cancel</button>
                  </div>
                )}
              </>
            ) : (
              <>
                <select id="shelfDropdown" onChange={handleSelectedShelf}>
                  <option value="">Select a shelf</option>
                  {shelves.map((shelf) => (
                    <option key={shelf._id} value={shelf._id}>
                      {shelf.name}
                    </option>
                  ))}
                </select>
                <button className={styles.b68} onClick={handleAddToShelf}>Add to Shelf</button>
              </>
            )
            
          }
          {book.subtitle && (
            <h3 className={styles.subTitle}>{book.subtitle}</h3>
          )}
          {book.authors && (
            <h3 className={styles.bookAuthor}>
              <span style={{ fontWeight: 'bold' }}>Author: </span>
              {book.authors}
            </h3>
          )}
          <p className={styles.bookPage}><span style={{ fontWeight: 'bold' }}>Pages:</span> {book.pages}</p>
          {book.published && ( 
          <p className={styles.bookDescriptionDetails}><span style={{ fontWeight: 'bold' }}>Published:</span> {book.published}</p>
          )}
          <p className={styles.bookDescriptionDetails}><span style={{ fontWeight: 'bold' }}>Categories: </span>{book.categories}</p>
          <div className={styles.description} dangerouslySetInnerHTML={{ __html: book.description || "" }}></div>
          <Link to={book.url}>
          <button className={styles.b68} >Learn More</button>
          </Link>
        </div>
      </div>
      </div>
      ) : (
        <p>Loading...<img src={uglyCat}/></p>
      )}
      <section className={styles.commentContainerSection}>
        {book ? (
          <div>
            <h1 className={styles.commentH1}>Comments About <br /> {book.title}</h1>
            <Comments 
              key={comments._id} 
              comments={comments} 
              setComments={setComments}
              user={props.user} 
              handleUpdateComment={handleUpdateComment}
              handleAddComment={handleAddComment}
              handleDeleteComment={handleDeleteComment}
              volumeId={volumeId} 
              sortCommentsByCreatedAt={sortCommentsByCreatedAt}
              book={book}

            />
          </div>) : (
          <p>Loading...<img src={uglyCat}/></p>
        )}
      </section>
    </main>
  )
}

export default BookDetails