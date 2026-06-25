import { createContext, useContext, useState, useCallback } from "react";

export const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  const [progressMap, setProgressMap] = useState({});

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

  const isLectureDone = useCallback(
    (courseId, chapterIdx, lectureIdx) =>
      !!(progressMap[courseId] ?? {})[`${chapterIdx}-${lectureIdx}`],
    [progressMap],
  );

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

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx)
    throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
};
