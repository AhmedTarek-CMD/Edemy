import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { AddContext } from "../../context/AddContext";
import { useProgress } from "../../context/ProgressContext";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};
const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};
const slideLeft = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const chapterVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};
const lectureItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: i * 0.045, ease: "easeOut" },
  }),
};
const playerVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: -20,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};
const thumbnailVariants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const PulseRing = () => (
  <span className="relative flex h-3 w-3 shrink-0">
    <motion.span
      className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
      animate={{ scale: [1, 1.8], opacity: [0.75, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
    />
    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
  </span>
);

const ShimmerBar = ({ progress = 0 }) => (
  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
    <motion.div
      className="h-full rounded-full bg-linear-to-r from-blue-500 via-cyan-400 to-indigo-500"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    />
  </div>
);

const AmbientBlob = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{
      scale: [1, 1.15, 1],
      opacity: [0.15, 0.25, 0.15],
      x: [0, 10, 0],
      y: [0, -8, 0],
    }}
    transition={{ duration: 7, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const CompletionToast = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-green-200"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8l3.5 3.5L13 5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Lecture marked as complete!
      </motion.div>
    )}
  </AnimatePresence>
);

const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AddContext);
  const { toggleLecture, isLectureDone, getCourseProgress } = useProgress();
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [hoveredLecture, setHoveredLecture] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef(null);
  const headerRef = useRef(null);

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 80], [1, 0.85]);
  const headerY = useTransform(scrollY, [0, 80], [0, -4]);
  const springHeaderY = useSpring(headerY, { stiffness: 200, damping: 30 });

  useEffect(() => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) setCourseData(course);
    });
  }, [courseId, enrolledCourses]);

  const toggleSection = (index) =>
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));

  const handleToggleComplete = (chapterIdx, lectureIdx) => {
    const wasDone = isLectureDone(courseId, chapterIdx, lectureIdx);
    toggleLecture(courseId, chapterIdx, lectureIdx);
    if (!wasDone) {
      clearTimeout(toastTimer.current);
      setShowToast(true);
      toastTimer.current = setTimeout(() => setShowToast(false), 2500);
    }
  };

  const {
    lectureCompleted: doneCount,
    totalLectures,
    pct: progressPct,
  } = getCourseProgress(courseId, courseData);

  return (
    <div className="relative min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      <AmbientBlob className="w-96 h-96 bg-blue-200 top-0 -left-20" delay={0} />
      <AmbientBlob
        className="w-80 h-80 bg-indigo-100 top-40 right-0"
        delay={2.5}
      />
      <AmbientBlob
        className="w-64 h-64 bg-sky-200 bottom-40 left-1/3"
        delay={4}
      />

      <CompletionToast show={showToast} />

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36"
      >
        <div className="text-gray-800">
          <motion.div variants={slideUp} ref={headerRef}>
            <motion.h2
              style={{ opacity: headerOpacity, y: springHeaderY }}
              className="text-2xl font-bold text-gray-900 tracking-tight"
            >
              Course Structure
            </motion.h2>

            {courseData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-3 mb-1"
              >
                <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                  <span>
                    {doneCount} of {totalLectures} lectures completed
                  </span>
                  <motion.span
                    key={progressPct}
                    initial={{ scale: 1.3, color: "#3b82f6" }}
                    animate={{ scale: 1, color: "#6b7280" }}
                    transition={{ duration: 0.4 }}
                    className="font-semibold"
                  >
                    {progressPct}%
                  </motion.span>
                </div>
                <ShimmerBar progress={progressPct} />
              </motion.div>
            )}
          </motion.div>

          <div className="pt-5 space-y-2">
            <AnimatePresence>
              {courseData?.courseContent.map((chapter, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={chapterVariants}
                  initial="hidden"
                  animate="visible"
                  layout
                  className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden"
                  whileHover={{
                    scale: 1.005,
                    boxShadow: "0 8px 32px rgba(59,130,246,0.10)",
                    borderColor: "#bfdbfe",
                  }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                >
                  <motion.div
                    className="px-4 py-3.5 flex items-center justify-between cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                    whileTap={{ scale: 0.995 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: openSections[index] ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-500"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M2 5l5 5 5-5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.div>
                      <p className="text-sm md:text-base font-semibold text-gray-800">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <motion.div
                      className="flex items-center gap-1.5 text-xs md:text-sm text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100"
                      whileHover={{
                        backgroundColor: "#eff6ff",
                        borderColor: "#bfdbfe",
                        color: "#3b82f6",
                      }}
                    >
                      <span>{chapter.chapterContent.length} lectures</span>
                      <span className="text-gray-300">·</span>
                      <span>{calculateChapterTime(chapter)}</span>
                    </motion.div>
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {openSections[index] && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.38,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-100 bg-linear-to-b from-gray-50/60 to-white/60">
                          <ul className="divide-y divide-gray-100/70 px-2 py-1">
                            {chapter.chapterContent.map((lecture, i) => {
                              const done = isLectureDone(courseId, index, i);
                              const isActive =
                                playerData?.chapter === index + 1 &&
                                playerData?.lecture === i + 1;
                              const isHovered =
                                hoveredLecture === `${index}-${i}`;

                              return (
                                <motion.li
                                  key={i}
                                  custom={i}
                                  variants={lectureItemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg my-0.5 cursor-pointer transition-colors duration-150 ${
                                    isActive
                                      ? "bg-blue-50/80 border border-blue-100"
                                      : "hover:bg-gray-50/80"
                                  }`}
                                  onHoverStart={() =>
                                    setHoveredLecture(`${index}-${i}`)
                                  }
                                  onHoverEnd={() => setHoveredLecture(null)}
                                  onClick={() =>
                                    lecture.lectureUrl &&
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  whileTap={{ scale: 0.99 }}
                                >
                                  <motion.div
                                    className="shrink-0"
                                    animate={{ scale: done ? [1, 1.3, 1] : 1 }}
                                    transition={{ duration: 0.4 }}
                                  >
                                    {isActive ? (
                                      <PulseRing />
                                    ) : done ? (
                                      <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
                                      >
                                        <svg
                                          width="8"
                                          height="8"
                                          viewBox="0 0 8 8"
                                          fill="none"
                                        >
                                          <path
                                            d="M1 4l2 2 4-4"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                        className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center"
                                        animate={
                                          isHovered
                                            ? {
                                                borderColor: "#3b82f6",
                                                scale: 1.1,
                                              }
                                            : {
                                                borderColor: "#d1d5db",
                                                scale: 1,
                                              }
                                        }
                                      >
                                        <motion.div
                                          animate={
                                            isHovered
                                              ? { opacity: 1 }
                                              : { opacity: 0 }
                                          }
                                          className="w-2 h-2 rounded-full bg-blue-400"
                                        />
                                      </motion.div>
                                    )}
                                  </motion.div>

                                  <p
                                    className={`flex-1 text-sm ${isActive ? "text-blue-700 font-medium" : done ? "text-gray-400 line-through" : "text-gray-700"}`}
                                  >
                                    {lecture.lectureTitle}
                                  </p>

                                  <div className="flex items-center gap-3 ml-auto shrink-0">
                                    {lecture.lectureUrl && (
                                      <motion.button
                                        className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                                          isActive
                                            ? "bg-blue-500 text-white"
                                            : "bg-white border border-blue-200 text-blue-500 hover:bg-blue-50"
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPlayerData({
                                            ...lecture,
                                            chapter: index + 1,
                                            lecture: i + 1,
                                          });
                                        }}
                                      >
                                        {isActive ? "▶ Now" : "Watch"}
                                      </motion.button>
                                    )}

                                    <motion.button
                                      className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                                        done
                                          ? "bg-green-50 border-green-200 text-green-600"
                                          : "bg-gray-50 border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-500"
                                      }`}
                                      whileTap={{ scale: 0.85 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleComplete(index, i);
                                      }}
                                      title={
                                        done
                                          ? "Mark incomplete"
                                          : "Mark complete"
                                      }
                                    >
                                      {done ? "✓" : "○"}
                                    </motion.button>

                                    <span className="text-xs text-gray-400 tabular-nums">
                                      {humanizeDuration(
                                        lecture.lectureDuration * 60 * 1000,
                                        { units: ["h", "m"] },
                                      )}
                                    </span>
                                  </div>
                                </motion.li>
                              );
                            })}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <motion.div variants={slideLeft} className="md:mt-10 md:mb-30">
          <div className="sticky top-6">
            <AnimatePresence mode="wait">
              {playerData ? (
                <motion.div
                  key="player"
                  variants={playerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="rounded-2xl overflow-hidden shadow-2xl shadow-blue-100/60 border border-blue-100/80 bg-white"
                >
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 rounded-t-2xl bg-linear-to-br from-blue-400/20 to-indigo-400/10 pointer-events-none z-10"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <YouTube
                      videoId={playerData.lectureUrl.split("/").pop()}
                      iframeClassName="w-full aspect-video"
                      className="w-full"
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="px-4 py-3 flex justify-between items-center bg-white/90 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <PulseRing />
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        <span className="text-blue-500">
                          {playerData.chapter}.{playerData.lecture}
                        </span>{" "}
                        {playerData.lectureTitle}
                      </p>
                    </div>

                    <motion.button
                      className={`ml-3 shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                        isLectureDone(
                          courseId,
                          playerData.chapter - 1,
                          playerData.lecture - 1,
                        )
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                      }`}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() =>
                        handleToggleComplete(
                          playerData.chapter - 1,
                          playerData.lecture - 1,
                        )
                      }
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={String(
                            isLectureDone(
                              courseId,
                              playerData.chapter - 1,
                              playerData.lecture - 1,
                            ),
                          )}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="block"
                        >
                          {isLectureDone(
                            courseId,
                            playerData.chapter - 1,
                            playerData.lecture - 1,
                          )
                            ? "✓ Completed"
                            : "Mark Complete"}
                        </motion.span>
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="thumbnail"
                  variants={thumbnailVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="relative rounded-2xl overflow-hidden shadow-xl shadow-gray-200/70 border border-gray-100 group"
                >
                  {courseData?.courseThumbnail ? (
                    <>
                      <img
                        src={courseData.courseThumbnail}
                        alt="Course Thumbnail"
                        className="w-full object-cover"
                      />
                      <motion.div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.div
                          className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M5 3.5l12 6.5-12 6.5V3.5z"
                              fill="#3b82f6"
                            />
                          </svg>
                        </motion.div>
                      </motion.div>
                      <motion.div
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-blue-600 shadow-sm border border-blue-100"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                      >
                        {totalLectures} Lectures
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      className="aspect-video flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 text-gray-400"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path d="M5 4l14 8-14 8V4z" fill="#93c5fd" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium">
                        Select a lecture to begin
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {courseData && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Your Progress
                  </p>
                  <motion.span
                    key={progressPct}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className="text-sm font-bold text-blue-500"
                  >
                    {progressPct}%
                  </motion.span>
                </div>
                <ShimmerBar progress={progressPct} />
                <p className="text-xs text-gray-400 mt-1.5">
                  {doneCount} of {totalLectures} lectures done
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Player;
