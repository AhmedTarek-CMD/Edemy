import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AddContext } from "../../context/AddContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CourseCard = ({ course }) => {
  const { currency } = useContext(AddContext);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <Link
        to={`/course/${course._id}`}
        onClick={() => scrollTo(0, 0)}
        className="border border-gray-500/30 pb-3 overflow-hidden rounded-lg block bg-white shadow-sm hover:shadow-xl transition-all duration-300"
      >
        <div className="overflow-hidden">
          <motion.img
            src={course.courseThumbnail}
            alt={course.courseTitle}
            className="w-full"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="p-3 text-left h-50">
          <h3 className="text-lg font-semibold">{course.courseTitle}</h3>

          <p className="text-gray-500">Edemy</p>

          <div className="flex items-center space-x-2 mt-2">
            <p>{course.courseRatings?.[0]?.rating?.toFixed(1) || "N/A"}</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <img
                  key={index}
                  src={
                    course.courseRatings?.[0]?.rating !== undefined
                      ? assets.star
                      : assets.star_blank
                  }
                  alt="Star"
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>

            <p className="text-gray-500">
              {course.courseRatings?.length || 0} review
            </p>
          </div>

          <p className="text-base font-semibold text-gray-800 mt-2">
            {currency}
            {(
              course.coursePrice -
              (course.discount * course.coursePrice) / 100
            ).toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
