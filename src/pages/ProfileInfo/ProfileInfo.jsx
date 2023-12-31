import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import * as profileService from "../../services/profileService";
import catOnShelfImage from "/assets/blackcat.png";
import styles from "./ProfileInfo.module.css";
import "flickity/css/flickity.css";
import uglyCat from "/assets/uglycat.png";
import greyCat from "/assets/greycat.png";

const ProfileInfo = (props) => {
  const [profile, setProfile] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [modalData, setModalData] = useState({
    isOpen: false,
    name: "",
    isEditing: false,
    id: null,
  });
  const inputRef = useRef(null);
  const bookContainerRefs = useRef({});
  const { profileId } = useParams();
  const [currentBooks, setCurrentBooks] = useState({});
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getOneProfile(profileId);
        setProfile(data);
        setShowButton(true);
      } catch (err) {
        (err);
      }
    };
    fetchProfile();
  }, [profileId]);

  useEffect(() => {
    if (modalData.isOpen && inputRef.current) inputRef.current.focus();
  }, [modalData.isOpen]);

  useEffect(() => {
    if (profile && profile.shelves) {
      const initialBooks = {};
      profile.shelves.forEach((shelf) => {
        initialBooks[shelf._id] = shelf.books;
      });
      setCurrentBooks(initialBooks);
    }
  }, [profile]);


  const handleShelf = async (action, shelfId) => {
    try {
      const result = await profileService[action](
        { name: modalData.name },
        profileId,
        shelfId
      );
      if (result) {
        setProfile((prev) => {
          const updatedShelves =
            action === "createShelf"
              ? [...prev.shelves, result]
              : prev.shelves.map((s) => (s._id === shelfId ? result : s));
          return { ...prev, shelves: updatedShelves };
        });
      }
      setModalData({ isOpen: false, name: "", isEditing: false, id: null });
    } catch (err) {
      (err);
    }
  };

  const handleDeleteShelf = async (shelfId) => {
    try {
      await profileService.deleteShelf(profileId, shelfId);
      setProfile((prev) => {
        const updatedShelves = prev.shelves.filter(
          (shelf) => shelf._id !== shelfId
        );
        return { ...prev, shelves: updatedShelves };
      });
    } catch (err) {
      (err);
    }
  };

  const handleDarkModeChange = (event) => {
    setDarkMode(event.target.checked);
  };

  const handleRemoveBookFromShelf = (shelfId, bookId) => {
    try {
      setCurrentBooks((prevBooks) => {
        const updatedBooks = { ...prevBooks };
        updatedBooks[shelfId] = updatedBooks[shelfId].filter((book) => book._id !== bookId);
        return updatedBooks;
      });
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <main>
      {profile ? (
        <div>
          <div className={styles.spacer}/>
          <img
            className={styles.photo}
            src={profile.photo}
            alt="profile photo"
          />
          <h1 className={styles.name}>{profile.name}</h1>
          <div className={styles.container}>
          <div className={styles.toggleContainer}>
            <input
              type="checkbox"
              className={styles.funCheckbox}
              id="funCheckbox"
              checked={darkMode}
              onChange={handleDarkModeChange}
            />
            <label htmlFor="funCheckbox" className={styles.funCheckboxLabel}>
              <i className="fas fa-moon"></i>
              <i className="fas fa-sun"></i>
              <span className={styles.funCheckboxThumb}></span>
            </label>
          </div>
          </div>
          {props.user._id !== profileId ? (
            showButton && (
            <button
              className={styles.b68}
              onClick={() =>
              setModalData({
              isOpen: true,
              isEditing: false,
              name: "",
              id: null,
              placeholder: "Shelf Name",
              })
              }> New Shelf </button>)
          ) : (
          <></>
          )}

          {profile.shelves.map((shelf) => (
            <div className={styles.shelf} key={shelf._id}>
              <div className={styles.shelfNavigation}>
                <div className={styles.shelfContent}>
                  <span className={styles.shelfName}>
                    <span
                      className={styles.tooltip}
                      data-title={shelf.name}
                    >
                      Name:{" "}
                      {shelf.name.length > 20
                        ? `${shelf.name.substring(0, 28)}...`
                        : shelf.name}
                    </span>
                  </span>
                  <div
                    className={styles.bookContainer}
                    ref={(ref) => (bookContainerRefs.current[shelf._id] = ref)}
                  >
                  {currentBooks[shelf._id]?.map((book) => (
                    <Link to={`/books/${book.googleId}`} key={book._id}>
                      <div className={styles.bookContainerItem}>
                      <img
                        key={book._id}
                        src={book.cover}
                        alt={book.title}
                        className={styles.bookCover}
                        />
                      <button
                        className={styles.removeBookButton}
                        onClick={() => handleRemoveBookFromShelf(shelf._id, book._id)}
                      >
                      X
                      </button>
                      </div>
                    </Link>
                  ))}
                  {shelf.books?.length === 0 && (
                    <img
                    src={darkMode ? catOnShelfImage : greyCat}
                    alt="Cat on Shelf"
                    className={styles.catImage}
                    />
                    )}
                  </div>
                </div>
                </div>
                <div className={styles.shelfActions}>
                <button
                  className={styles.edit}
                  onClick={() =>
                    setModalData({
                      isOpen: true,
                      isEditing: true,
                      name: shelf.name,
                      id: shelf._id,
                    })
                  }
                >
                  ✏️
                </button>
                <button
                  className={styles.delete}
                  onClick={() => handleDeleteShelf(shelf._id)}
                  >
                  🗑️
                </button>
              </div>
              {modalData.isEditing && modalData.id === shelf._id && (
                <div className={styles.modalOpen}>
                <label className={styles.input}>
                <input
                className={styles.input}
                ref={inputRef}
                type="text"
                value={modalData.name}
                placeholder="Edit Shelf Name"
                onChange={(e) =>
                  setModalData({ ...modalData, name: e.target.value })
                }
                    />
                    </label>
                  <button
                  className={styles.b68}
                  onClick={() => handleShelf("editShelf", shelf._id)}
                  >
                    Save
                  </button>
                  <button
                    className={styles.b68}
                    onClick={() =>
                      setModalData({
                        isOpen: false,
                        name: "",
                        isEditing: false,
                        id: null,
                      })
                    }
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
          {modalData.isOpen && !modalData.isEditing && (
            <div className={styles.modalOpen}>
              <label>
                <input
                  className={styles.newShelf}
                  ref={inputRef}
                  type="text"
                  value={modalData.name}
                  placeholder="Shelf Name"
                  onChange={(e) =>
                    setModalData({ ...modalData, name: e.target.value })
                  }
                />
              </label>
      <button
        className={styles.b68}
        onClick={() => handleShelf("createShelf")}
      >
        Create
      </button>
              <button
                className={styles.b68}
                onClick={() =>
                  setModalData({
                    isOpen: false,
                    name: "",
                    isEditing: false,
                    id: null,
                  })
                }
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>
          Loading...<img src={uglyCat} />
        </p>
      )}
    </main>
  );
};

export default ProfileInfo;