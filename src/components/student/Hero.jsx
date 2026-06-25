import React from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <section className="relative overflow-hidden flex flex-col items-center justify-center w-full md:pt-34 pt-20 px-7 md:px-0 text-center bg-linear-to-b from-cyan-100/70 to-white">
      <div className="absolute top-30 left-1/2 -translate-x-1/2 w-125 h-125 bg-blue-300/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
            },
          },
        }}
      >
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
          className="md:text-5xl text-3xl relative font-bold text-gray-800 max-w-4xl mx-auto leading-tight"
        >
          Empower Your Future with the courses designed to{" "}
          <span className="text-blue-600 relative inline-block">
            fit your choices.
            <motion.img
              src={assets.sketch}
              alt="Sketch"
              className="md:block hidden absolute -bottom-7 right-0"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </span>
        </motion.h1>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
          className="md:block hidden text-gray-500 max-w-3xl mx-auto mt-6 text-lg leading-8"
        >
          We bring together world-class instructors, interactive content, and a
          supportive community to help you achieve your personal and
          professional goals.
        </motion.p>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
          className="md:hidden block text-gray-500 max-w-sm mx-auto mt-4"
        >
          We bring together world-class instructors to help you achieve your
          professional goals.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 25 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.7 }}
          className="mt-10 w-full flex justify-center"
        >
          <SearchBar />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
