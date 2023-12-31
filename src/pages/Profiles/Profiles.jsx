// npm modules
import { useState, useEffect } from 'react'

// services
import * as profileService from '../../services/profileService'

//pages
// import Profile from '../Profile/Profile'

//components
import ProfileCard from '../../components/ProfileCard/ProfileCard'
// css
import styles from './Profiles.module.css'
import uglyCat from '/assets/uglycat.png'

const Profiles = () => {
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    const fetchProfiles = async () => {
      const profileData = await profileService.getAllProfiles()
      setProfiles(profileData)
    }
    fetchProfiles()
  }, [])

  if (!profiles.length) {
    return <main className={styles.container}><h1>Loading...<img src={uglyCat}/></h1></main>
  }
  
  return (
    <main>
      <div className={styles.spacer}>hello</div>
      
      <h1 className={styles.pageTitle}>View All Profiles</h1>
      <div className={styles.container}>
      {profiles.map(profile => (
        <ProfileCard key={profile._id} profile={profile}/>
        ))}
      </div>

  
    </main>
  )
}

export default Profiles
