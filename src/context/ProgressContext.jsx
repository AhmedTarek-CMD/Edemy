import { createContext, useContext, useState, useCallback } from "react";

/**
 * ProgressContext
 *
 * Stores completed lectures keyed by courseId.
 * Shape: { [courseId]: { "[chapterIdx]-[lectureIdx]": true } }
 *
 * Wrap your app (or at least the routes that include Player + MyEnrollments)
 * with <ProgressProvider> and consume via useProgress().
 */
export const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  // { courseId: { "0-0": true, "0-1": true, ... } }
  const [progressMap, setProgressMap] = useState({});

  /** Toggle a single lecture complete / incomplete */
  const toggleLecture = useCallback((courseId, chapterIdx, lectureIdx) => {
    const key = `${chapterIdx}-${lectureIdx}`;
    setProgressMap((prev) => {
      const course = prev[courseId] ?? {};
      return {
        ...prev,
        [courseId]: { ...course, [key]: !course[key] },
      };
    });
  }, []);

  /** True if a specific lecture is marked complete */
  const isLectureDone = useCallback(
    (courseId, chapterIdx, lectureIdx) =>
      !!(progressMap[courseId] ?? {})[`${chapterIdx}-${lectureIdx}`],
    [progressMap],
  );

  /** { lectureCompleted, totalLectures, pct } for a given course */
  const getCourseProgress = useCallback(
    (courseId, courseData) => {
      if (!courseData) return { lectureCompleted: 0, totalLectures: 0, pct: 0 };
      const totalLectures = courseData.courseContent.reduce(
        (acc, ch) => acc + ch.chapterContent.length,
        0,
      );
      const done = Object.values(progressMap[courseId] ?? {}).filter(
        Boolean,
      ).length;
      return {
        lectureCompleted: done,
        totalLectures,
        pct: totalLectures ? Math.round((done / totalLectures) * 100) : 0,
      };
    },
    [progressMap],
  );

  return (
    <ProgressContext.Provider
      value={{ toggleLecture, isLectureDone, getCourseProgress, progressMap }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

/** Convenience hook */
export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx)
    throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
};
