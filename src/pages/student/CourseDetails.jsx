import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AddContext } from "../../context/AddContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const CourseDetails = () => {
  const { id } = useParams();
  const {
    allCourses,
    calculateCourseDuration,
    calculateNoOfLectures,
    calculateChapterTime,
    currency,
  } = useContext(AddContext);
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  const fetchCourseData = async () => {
    const foundCourse = allCourses.find((course) => course._id === id);
    setCourseData(foundCourse);
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    fetchCourseData();
  }, [id, allCourses]);

  return courseData ? (
    <>
      <div className="relative flex flex-col-reverse md:flex-row gap-10 items-start px-8 md:px-36 text-left pt-20 md:pt-30 justify-between overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0 bg-linear-to-b from-cyan-100/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        <motion.div
          className="max-w-xl z-10 text-gray-500"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.h1
            className="text-2xl md:text-4xl font-semibold text-gray-800"
            variants={fadeUp}
          >
            {courseData.courseTitle}
          </motion.h1>

          <motion.p
            className="text-sm md:text-base pt-4"
            variants={fadeUp}
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          />

          <motion.div
            className="flex items-center space-x-2 mt-2"
            variants={fadeUp}
          >
            <p>{courseData.courseRatings?.[0]?.rating?.toFixed(1) || "N/A"}</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <motion.img
                  key={index}
                  src={
                    courseData.courseRatings?.[0]?.rating !== undefined
                      ? assets.star
                      : assets.star_blank
                  }
                  alt="Star"
                  className="w-3.5 h-3.5"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.07, duration: 0.3 }}
                />
              ))}
            </div>
            <p className="text-blue-500">
              ({courseData.courseRatings?.length || 0} review)
            </p>
            <p>{courseData.enrolledStudents.length} students</p>
          </motion.div>

          <motion.p className="text-sm md:text-base mt-4" variants={fadeUp}>
            Course By <span className="underline text-blue-600">Edemy</span>
          </motion.p>

          <motion.div className="pt-8 text-gray-800" variants={fadeUp}>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-5">
              Course Structure
            </h2>

            <div className="space-y-3">
              {courseData.courseContent.map((chapter, index) => (
                <motion.div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden"
                  whileHover={{
                    scale: 1.005,
                    boxShadow: "0 8px 32px rgba(59,130,246,0.10)",
                    borderColor: "#bfdbfe",
                  }}
                >
                  <div
                    className="px-4 py-4 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: openSections[index] ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"
                      >
                        ▼
                      </motion.div>

                      <h3 className="font-semibold text-gray-800">
                        {chapter.chapterTitle}
                      </h3>
                    </div>

                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border">
                      {chapter.chapterContent.length} lectures ·{" "}
                      {calculateChapterTime(chapter)}
                    </div>
                  </div>

                  <AnimatePresence>
                    {openSections[index] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t bg-linear-to-b from-gray-50 to-white">
                          <ul className="divide-y divide-gray-100">
                            {chapter.chapterContent.map((lecture, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-4 h-4 rounded-full border-2 border-blue-400 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                  </div>

                                  <span className="text-gray-700">
                                    {lecture.lectureTitle}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3">
                                  {lecture.isPreviewFree && (
                                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600">
                                      Preview
                                    </span>
                                  )}

                                  <span className="text-xs text-gray-400">
                                    {humanizeDuration(
                                      lecture.lectureDuration * 60 * 1000,
                                      { units: ["h", "m"] },
                                    )}
                                  </span>
                                </div>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="py-20 text-sm md:text-lg"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              Course Details
            </h2>
            <p
              className="pt-3 rich-text"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription,
              }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="max-w-106 shadow z-10 md:rounded-none overflow-hidden bg-white min-w-75 sm:min-w-105"
          variants={slideInRight}
          initial="hidden"
          animate="visible"
        >
          <motion.img
            src={courseData.courseThumbnail}
            alt={courseData.courseTitle}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          />

          <div className="p-5">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <img
                src={assets.time_left_clock_icon}
                alt="Time left"
                className="w-3.5"
              />
              <p className="text-red-500">
                <span className="font-medium">5 Days</span> left at this price!
              </p>
            </motion.div>

            <motion.div
              className="flex gap-3 items-center pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <p className="text-2xl md:text-4xl font-semibold text-gray-800">
                {(
                  courseData.coursePrice -
                  (courseData.discount * courseData.coursePrice) / 100
                ).toFixed(2)}{" "}
                {currency}
              </p>
              <p className="md:text-lg text-gray-500 line-through">
                {courseData.coursePrice} {currency}
              </p>
              <p className="md:text-lg text-gray-500">
                {courseData.discount}% OFF
              </p>
            </motion.div>

            <motion.div
              className="flex items-center text-sm md:text-lg gap-4 pt-2 md:pt-4 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="Star Icon" />
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="Clock Icon" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="Lesson Icon" />
                <p>{calculateNoOfLectures(courseData)} Lessons</p>
              </div>
            </motion.div>

            <motion.button
              className="mt-4 md:mt-6 bg-blue-600 text-white font-medium py-3 w-full cursor-pointer"
              whileHover={{ scale: 1.02, backgroundColor: "#1d4ed8" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </motion.button>

            <motion.div
              className="pt-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
            >
              <p className="md:text-xl text-lg font-medium text-gray-500">
                What's in the course?
              </p>
              <ul className="list-disc ml-4 pt-2 text-sm md:text-base text-gray-500">
                {[
                  "Lifetime access with free updates.",
                  "Downloadable resources and source code.",
                  "Step-by-step, hands-on projects guidance.",
                  "Quizzes to test your knowledge.",
                  "Certificate of completion",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + i * 0.07, duration: 0.3 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
