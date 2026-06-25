import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { AddContext } from "../../context/AddContext";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/student/SearchBar";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AddContext);
  const { input } = useParams();

  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const searchTerm = input?.toLowerCase() || "";

    const filtered = allCourses.filter((course) =>
      course.courseTitle.toLowerCase().includes(searchTerm),
    );

    setFilteredCourses(filtered);
  }, [input, allCourses]);

  return (
    <>
      <motion.div
        className="relative px-8 md:px-36 pt-20 text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex flex-col md:flex-row items-start justify-between w-full gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          {" "}
          <div>
            <motion.h1
              className="text-4xl text-gray-800 font-semibold"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Courses List
            </motion.h1>
            <motion.p
              className="text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span
                onClick={() => navigate("/")}
                className="cursor-pointer text-blue-600 hover:text-blue-700 transition"
              >
                Home
              </span>{" "}
              / <span>Course List</span>
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SearchBar data={input} />
          </motion.div>
        </motion.div>

        {input && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full border border-gray-200 bg-white shadow-sm my-8 text-gray-600"
          >
            <p className="text-sm font-medium">{input}</p>

            <motion.img
              src={assets.cross_icon}
              alt="Cross Icon"
              className="cursor-pointer w-4 h-4"
              whileHover={{
                rotate: 90,
                scale: 1.1,
              }}
              whileTap={{
                scale: 0.9,
              }}
              transition={{
                duration: 0.2,
              }}
              onClick={() => navigate("/course-list")}
            />
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-2 md:px-0 my-16"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {filteredCourses.map((course) => (
            <motion.div
              key={course._id}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 30,
                  scale: 0.95,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                },
              }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
                transition: {
                  duration: 0.2,
                },
              }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Footer />
      </motion.div>
    </>
  );
};

export default CoursesList;
