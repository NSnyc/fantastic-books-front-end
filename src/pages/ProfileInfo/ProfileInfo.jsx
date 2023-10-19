import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import * as profileService from '../../services/profileService'
import catOnShelfImage from '../../assets/blackcat.png'
import styles from './ProfileInfo.module.css'

const ProfileInfo = () => {
  const [profile, setProfile] = useState(null)
  const [showButton, setShowButton] = useState(false)
  const [modalData, setModalData] = useState({ isOpen: false, name: '', isEditing: false, id: null })
  const inputRef = useRef(null)
  const { profileId } = useParams()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getOneProfile(profileId)
        setProfile(data)
        setShowButton(true)
      } catch (err) { console.log(err) }
    }
    fetchProfile()
  }, [profileId])

  useEffect(() => {
    if (modalData.isOpen && inputRef.current) inputRef.current.focus()
  }, [modalData.isOpen])

  const handleShelf = async (action, shelfId) => {
    try {
      const result = await profileService[action]({ name: modalData.name }, profileId, shelfId)
      if (result) {
        setProfile(prev => {
          const updatedShelves = action === 'createShelf' ? [...prev.shelves, result] : prev.shelves.map(s => s._id === shelfId ? result : s)
          return { ...prev, shelves: updatedShelves }
        })
      }
      setModalData({ isOpen: false, name: '', isEditing: false, id: null })
    } catch (err) { console.log(err) }
  }

  const handleDeleteShelf = async (shelfId) => {
    try {
      await profileService.deleteShelf(profileId, shelfId)
      setProfile(prev => {
        const updatedShelves = prev.shelves.filter(shelf => shelf._id !== shelfId)
        return { ...prev, shelves: updatedShelves }
      })
    } catch (err) { console.log(err) }
  }

  return (
    <main>
      {profile ? (
        <div>
          <div className={styles.spacer}>hello</div>
          <img className={styles.photo} src={profile.photo} alt="profile photo" />
          <h1 className={styles.name}>{profile.name}</h1>
          <h2>Books Collected:</h2><h2>Shelves Created:</h2>
          {profile.shelves.map(shelf => (
            <div className={styles.shelf} key={shelf._id}>
              <div className={styles.shelfContent}>
              <span className={styles.shelfname}>
                <span className={styles.tooltip} data-title={shelf.name} tooltip={shelf.name}>
                  Name: {shelf.name.length > 20 ? `${shelf.name.substring(0, 30)}...` : shelf.name}
                </span>
              </span>
                {shelf.books?.length ? null : <img src={catOnShelfImage} alt="Cat on Shelf" className={styles.catImage} />}
                <button className={styles.edit} onClick={() => setModalData({ isOpen: true, isEditing: true, name: shelf.name, id: shelf._id })}>✏️</button>
                <button className={styles.delete} onClick={() => handleDeleteShelf(shelf._id)}>🗑️</button>
              </div>
              {modalData.isEditing && modalData.id === shelf._id && (
                <div className={styles.modalOpen}>
                  <label>Edit Shelf Name:<input ref={inputRef} type="text" value={modalData.name} onChange={e => setModalData({ ...modalData, name: e.target.value })} /></label>
                  <button onClick={() => handleShelf('editShelf', shelf._id)}>Save</button>
                  <button onClick={() => setModalData({ isOpen: false, name: '', isEditing: false, id: null })}>Cancel</button>
                </div>
              )}
            </div>
          ))}
          {modalData.isOpen && !modalData.isEditing && (
            <div className={styles.modalOpen}>
              <label>Shelf Name:<input ref={inputRef} type="text" value={modalData.name} onChange={e => setModalData({ ...modalData, name: e.target.value })} /></label>
              <button className={styles.create} onClick={() => handleShelf('createShelf')}>Create</button>
              <button onClick={() => setModalData({ isOpen: false, name: '', isEditing: false, id: null })}>Cancel</button>
            </div>
          )}
          {showButton && <button onClick={() => setModalData({ isOpen: true, isEditing: false, name: '', id: null })} className={styles.createShelfButton}>New Shelf</button>}
        </div>
      ) : <p>Loading...</p>}
    </main>
  )
}

export default ProfileInfo
