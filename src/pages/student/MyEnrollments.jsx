import React, { useContext } from "react";
import { AddContext } from "../../context/AddContext";
import { useProgress } from "../../context/ProgressContext";
import Footer from "../../components/student/Footer";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const ProgressBar = ({ pct }) => (
  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={`h-full rounded-full ${
        pct === 100
          ? "bg-linear-to-r from-green-400 to-emerald-500"
          : "bg-linear-to-r from-blue-600 via-cyan-500 to-indigo-600"
      }`}
    />
  </div>
);

const CompletionBadge = ({ pct }) => {
  if (pct !== 100) return null;
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full ml-2"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path
          d="M2 5l2 2 4-4"
          stroke="#16a34a"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Done
    </motion.span>
  );
};

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration, navigate } =
    useContext(AddContext);
  const { getCourseProgress } = useProgress();

  return (
    <>
      <div className="relative overflow-hidden min-h-screen bg-slate-50">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="md:px-36 px-5 py-12"
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
              My Enrollments
            </h1>
            <p className="text-gray-500 mt-2">
              Continue learning and track your progress.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="overflow-hidden rounded-3xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-2xl"
          >
            <table className="w-full">
              <thead className="max-sm:hidden bg-linear-to-r from-blue-600 to-cyan-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Course</th>
                  <th className="px-6 py-4 text-left">Duration</th>
                  <th className="px-6 py-4 text-left">Completed</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>

              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {enrolledCourses.map((course, index) => {
                  const { lectureCompleted, totalLectures, pct } =
                    getCourseProgress(course._id, course);
                  const isFullyDone = pct === 100;

                  return (
                    <motion.tr
                      key={index}
                      variants={rowVariants}
                      whileHover={{ scale: 1.01 }}
                      className="border-b border-gray-200 transition-all duration-300 hover:bg-blue-50/50"
                    >
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-4">
                          <motion.img
                            whileHover={{ scale: 1.08, rotate: 2 }}
                            transition={{ duration: 0.3 }}
                            src={course.courseThumbnail}
                            alt={course.courseTitle}
                            className="w-20 md:w-28 rounded-xl shadow-lg"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center flex-wrap">
                              <h3 className="font-semibold text-gray-800 truncate">
                                {course.courseTitle}
                              </h3>
                              <CompletionBadge pct={pct} />
                            </div>

                            <div className="mt-3">
                              <ProgressBar pct={pct} />
                              <div className="flex items-center justify-between mt-1">
                                <AnimatePresence mode="wait">
                                  <motion.span
                                    key={pct}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.3 }}
                                    className={`text-xs font-medium ${
                                      isFullyDone
                                        ? "text-green-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {Math.round(pct)}% completed
                                  </motion.span>
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 max-sm:hidden">
                        <span className="font-medium text-gray-700">
                          {calculateCourseDuration(course)}
                        </span>
                      </td>

                      <td className="px-6 py-5 max-sm:hidden">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={lectureCompleted}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="font-medium text-gray-700"
                          >
                            {lectureCompleted}
                          </motion.span>
                        </AnimatePresence>
                        <span className="font-medium text-gray-700">
                          {" "}
                          / {totalLectures}
                        </span>
                        <span className="text-gray-500 ml-1">Lectures</span>
                      </td>

                      <td className="px-6 py-5">
                        <motion.button
                          whileHover={{
                            scale: 1.05,
                            boxShadow: isFullyDone
                              ? "0px 0px 25px rgba(22,163,74,0.35)"
                              : "0px 0px 25px rgba(37,99,235,0.35)",
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate("/player/" + course._id)}
                          className={`px-5 py-2 rounded-xl text-white font-medium transition-all duration-300 cursor-pointer ${
                            isFullyDone
                              ? "bg-linear-to-r from-green-500 to-emerald-600"
                              : "bg-linear-to-r from-blue-600 to-cyan-500"
                          }`}
                        >
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={String(isFullyDone)}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.2 }}
                              className="block"
                            >
                              {isFullyDone ? "✓ Completed" : "Continue"}
                            </motion.span>
                          </AnimatePresence>
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default MyEnrollments;
