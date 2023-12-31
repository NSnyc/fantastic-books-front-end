// components 

// css
import styles from './Landing.module.css'
import LinkedInLogo from '/assets/LIlogo.png';
import GithubLogo from '/assets/githubWhiteLogo.png';
import carla from '/assets/carla.png'
import steven from '/assets/steven.png'
import enes from '/assets/enes.png'
const Landing = ({ user }) => {
  const renderLink = (logoSrc, altText, linkUrl) => (
    <div className={styles.linkContainer}>
      <a href={linkUrl} target="_blank" rel="noopener noreferrer">
        <img src={logoSrc} alt={altText} className={styles.linkLogo} />
      </a>
    </div>
  );
  return (
    <main className={styles.container}>
      <div className={styles.spacer}></div>

      <section className={styles.landing}>
        <div className={styles.titleContainer}>
        <img className={styles.landingTitle} src='/assets/fantastic-books-logo.png' />
        </div>
        <h2 className={styles.landingSubTitle}>and where to find them.</h2>
        <article className={styles.description}>
          <p className={styles.descriptionText}>
            Welcome to Fantastic Books - your literary Narnia for all bibliophilic delights! Dive 20,000 leagues into a personalized reading odyssey, where you can create custom shelves to curate your tales of wonder and mystery. Whether you're charting the realms of books you've journeyed through, setting sail to the titles on your next adventure list, or unearthing niche categories from the forgotten corners of literature, our platform is your compass. Like Bilbo setting out from the Shire, embark with us and craft your unique literary epic!
          </p>
        </article>
      </section>
      
      <section className={styles.features}>
        <h3 className={styles.featureTitle}>Features of this app:</h3>
          <article className={styles.directions}>
            <div className={styles.featureText}>
              <h4 className="direction-title">Search Book</h4>
              <p className="direction-text">Discover your next read with our intuitive search feature, powered by the Google Books API. Simply type in a title and explore the vast literary world awaiting your discovery!</p>
            </div>
      
            <div className={styles.featureText}>
              <h4 className="direction-title">Your Shelves</h4>
              <p className="direction-text">Step into the secret garden of our 'Shelf' feature – a reader's own enchanting alcove in the great library of life! Design your shelves with names as captivating as Pemberley's halls, seamlessly add tales of old and new. For those tales you wish to remain for your eyes only', simply set your shelf to private. [Privacy feature coming soon!]</p>
            </div>
        </article>
      </section>
          
          
      <section className={styles.devs}>
        <h3 className={styles.devTitle}>The Devs:</h3>
          <div className={styles.devCards}>
            <article className={styles.devCard}>
            <img src={carla} alt="Carla's Profile Photo" className={styles.devPhoto} />
              <h2 className={styles.devName}>Carla Pacheco</h2>
              <div className={styles.linkContainer}>
                {renderLink(LinkedInLogo, "LinkedIn Logo", 'https://www.linkedin.com/in/thecarlapacheco/')}
                {renderLink(GithubLogo, "GitHub Logo", 'https://github.com/cmpacheco23')}
              </div>
            </article>

            <article className={styles.devCard}>
            <img src={enes} alt="Enes' Profile Photo" className={styles.devPhoto} />
            <h2 className={styles.devName}>Enes Velovic</h2>
              <div className={styles.linkContainer}>
                {renderLink(LinkedInLogo, "LinkedIn Logo", 'https://www.linkedin.com/in/enesvelovic/')}
                {renderLink(GithubLogo, "GitHub Logo", 'https://github.com/NSnyc')}
              </div>
            </article>

            <article className={styles.devCard}>
            <img src={steven} alt="Steven's Profile Photo" className={styles.devPhoto} />
              <h2 className={styles.devName}>Steve Morrison</h2>
              <div className={styles.linkContainer}>
                {renderLink(LinkedInLogo, "LinkedIn Logo", 'https://www.linkedin.com/in/steven-ansman-morrison/')}
                {renderLink(GithubLogo, "GitHub Logo", 'https://github.com/venmorr')}
              </div>
            </article>
          </div>
      </section>
    </main>
  )
}

export default Landing
