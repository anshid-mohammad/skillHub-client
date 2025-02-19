import React from 'react'
import styles from "./works.module.css"

function Works() {
  return (
    <div className={styles.container}>
      <div className={styles.headerText}>
        <h1 className={styles.text}>Why Skill Hub works</h1>
      </div>
      <div className={styles.leftText}>
           <img className={styles.worksImage} src="../../../images/works1.png" alt="learners" />
           <h2 className={styles.subHeader}>Solving Real Problems:</h2>
           <p className={styles.subText}>Skills help you address challenges <br />efficiently. For example,<br /> programming skills solve software <br />problems, while communication <br /> skills resolve conflicts.</p>

      </div>
      <div className={styles.middleText}>
      <img className={styles.worksImage} src="../../../images/works2.png" alt="learners" />
<h2 className={styles.subHeader}>Enhancing Collaboration:</h2>
<p className={styles.subText}>Skills like teamwork and <br /> communication allow <br /> individuals and teams to work <br /> effectively toward common goals.</p>
      </div>
      <div className={styles.rightText}>
      <img className={styles.worksImage} src="../../../images/works3.png" alt="learners" />
<h2 className={styles.subHeader}>Building Efficiency:</h2>
<p className={styles.subText}>The right skills enable people <br />to complete tasks faster <br />and with fewer errors, <br />improving productivity.</p>
      </div>

    </div>
  )
}

export default Works
