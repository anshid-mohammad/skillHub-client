import React from "react";
import {Route,Routes} from "react-router-dom"
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import Header from "./componets/header/Header";
import Login from "./pages/login/Login";
import LearnersHome from "./pages/learnersHome/LearnersHome";
import SignupTeacher from "./pages/SignupTeachers/SignupTeachers";
import LoginTeachers from "./pages/loginTeachers/LoginTeachers";
import TeachersHome from "./pages/home/teachersHome/TeachersHome";
import TeachersForm from "./pages/home/teachersForm/TeachersForm";
import Sample from "./componets/sample/Sample";
import AdminHome from "./pages/admin/AdminHome";
import CourseList from "./pages/admin/CourseList/CourseList";
import CourseDetailsPage from "./pages/learnersHome/CourseDetailsPage/CourseDetailsPage";
import StudentsForm from "./pages/learnersHome/StudentForm/StudentForm";
import StudentDetails from "./pages/home/StudentDetails/StudentDetails";
import StudentList from "./pages/home/studentList/StudentList";
import ProgressBar from "./pages/home/addmisionProcess/ProgressBar";
import StudentProgress from "./pages/learnersHome/studentProgress/StudentProgress";
import Chat from "./pages/chat/Chat";
import EditProfile from "./pages/learnersHome/Profile/editProfile/EditProfile";
import Profile from "./pages/learnersHome/Profile/Profile";
import TeacherProfile from "./pages/home/teacherProfile/TeacherProfile";
import EditTeacherProfile from "./pages/home/teacherProfile/editTeachersProfile/EditTeacherProfile";
import ViewMore from "./pages/home/addmisionProcess/viewMore/ViewMore";
import Razorpay from "./pages/learnersHome/razorpay/Razorpay";
import ViewPayment from "./pages/learnersHome/viewPayment/ViewPayment";
import PaymentReceipt from "./pages/learnersHome/paymentReceipt/PaymentReceipt";
import TeacherList from "./pages/learnersHome/CourseDetailsPage/teacherDetails/TeacherList";
import ViewCourses from "./pages/home/approvedCourses/viewCourses/ViewCourses";
import ViewApprovedCourses from "./pages/home/yourCourses/viewApprovedCourses/ViewApprovedCourse";
import MentorList from "./pages/admin/mentorDetails/MentorList";
import UserList from "./pages/admin/userDetails/UserList";



function App() {
  return (
    <div className="App">
      <Header/>
        <Routes>
        <Route  path='/' element={<Home/>}></Route>
        <Route  path='/signup' element={<Signup/>}></Route>
        <Route  path='/login' element={<Login/>}></Route>
        <Route  path='/teacher-signup' element={<SignupTeacher/>}></Route>
        <Route  path='/teacher-login' element={<LoginTeachers/>}></Route>
        <Route  path='/teachers' element={<TeachersHome/>}></Route>
        <Route  path='/teacher-profile' element={<TeacherProfile/>}></Route>
        <Route  path='/edit-teacher-profile' element={<EditTeacherProfile/>}></Route>
        <Route  path='/Progress-bar' element={<ProgressBar/>}></Route>
        <Route  path='/view-course/:id' element={<ViewCourses/>}></Route>



        <Route  path='/learners' element={<LearnersHome/>}></Route>
        <Route  path='/course-details/:id' element={<CourseDetailsPage/>}></Route>
        <Route  path='/student-form' element={<StudentsForm/>}></Route>
        <Route  path='/student-Progress' element={<StudentProgress/>}></Route>
        <Route  path='/edit-profile' element={<EditProfile/>}></Route>
        <Route  path='/student-profile' element={<Profile/>}></Route>
        <Route  path='/razorpay' element={<Razorpay/>}></Route>
        <Route  path='/view-payment/:id' element={<ViewPayment/>}></Route>
        <Route  path="/payment-receipt/:id" element={<PaymentReceipt/>}></Route>
        <Route  path="/teacher-list/:id" element={<TeacherList/>}></Route>





        <Route  path='/teachers-form' element={<TeachersForm/>}></Route>
        <Route  path='/student-Details' element={<StudentDetails/>}></Route>
        <Route  path='/student-list/:id' element={<StudentList/>}></Route>
        <Route  path='/progress-bar' element={<ProgressBar/>}></Route>
        <Route  path='/chat' element={<Chat/>}></Route>
        <Route  path='/view-more/:id' element={<ViewMore/>}></Route>
        <Route  path='/view-approved-course' element={<ViewApprovedCourses/>}></Route>


        <Route  path='/sample' element={<Sample/>}></Route>
        <Route  path='/admin' element={<AdminHome/>}></Route>
        <Route  path='/admin-courselist/:id' element={<CourseList/>}></Route>
        <Route  path='/mentor-list/:id' element={<MentorList/>}></Route>
        <Route  path='/user-list/:id' element={<UserList/>}></Route>


        
        </Routes>
    </div>
  );
}

export default App;
