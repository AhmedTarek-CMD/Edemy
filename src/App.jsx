import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import Home from "./pages/student/Home";
import Loading from "./components/student/Loading";
import Player from "./pages/student/Player";
import MyEnrollments from "./pages/student/MyEnrollments";
import CourseDetails from "./pages/student/CourseDetails";
import CoursesList from "./pages/student/CoursesList";
import Navbar from "./components/student/Navbar";

const App = () => {
  const isEducatorPages = useMatch("/educator/*");

  return (
    <div className="md:text-xl text-sm min-h-screen bg-white">
      {!isEducatorPages && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading" element={<Loading />} />
      </Routes>
    </div>
  );
};

export default App;
