import React from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    <section className="relative overflow-hidden py-28 px-8">
      {/* Background glow */}
      <div className="absolute inset-0 flex justify-center pointer-events-none">
        <div className="w-125 h-125 bg-blue-300/20 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <h1 className="text-3xl md:text-5xl font-semibold text-gray-800 leading-tight max-w-4xl">
          Learn anything, anytime,
          <br />
          anywhere
        </h1>

        <p className="text-gray-500 mt-5 text-lg max-w-xl leading-8">
          Join thousands of learners building practical skills, advancing their
          careers, and growing faster.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-5 mt-10">
          <motion.button
            whileHover={{
              y: -2,
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          >
            Get Started
          </motion.button>

          <motion.button
            whileHover={{ x: 3 }}
            className="flex items-center gap-2 text-blue-600 font-medium cursor-pointer"
          >
            Learn More
            <motion.img
              src={assets.arrow_icon}
              alt="Arrow"
              animate={{
                x: [0, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToAction;
