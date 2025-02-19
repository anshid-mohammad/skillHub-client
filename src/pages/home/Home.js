import React from 'react'
import Footer from '../../componets/footer/Footer'
import CourseDetails from '../../componets/CourseDetails/CourseDetails'
import Teachers from '../../componets/teachers/Teachers'
import Learners from '../../componets/learners/Learners'
import Works from '../../componets/works/Works'
import Join from '../../componets/join/Join'

function Home(props) {
  return (
    <div>
        
 <Footer></Footer>
 <CourseDetails></CourseDetails>
 <Learners></Learners>
 <Teachers></Teachers>
<Works></Works>
<Join></Join>


    </div>
  )
}

export default Home
