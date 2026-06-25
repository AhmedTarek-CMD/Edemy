import React from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-left bg-gray-800 md:px-36 mt-10 w-full overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-start justify-center px-8 md:px-0 gap-10 md:gap-32 py-12 border-b border-white/20">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center md:items-start w-full"
        >
          <motion.img
            src={assets.logo_dark}
            alt="logo"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer"
          />

          <p className="text-sm text-white/80 mt-6 text-center md:text-left leading-7 max-w-sm">
            Learn without limits. Explore expert-led courses in technology,
            business, design, and more to build real-world skills and grow at
            own pace.
          </p>
        </motion.div>

        {/* Company */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: 0.1,
          }}
          className="flex flex-col items-center md:items-start w-full"
        >
          <h2 className="mb-4 font-semibold text-white">Company</h2>

          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-3">
            {["Home", "About Us", "Contact Us", "Privacy Policy"].map(
              (item) => (
                <motion.li
                  key={item}
                  whileHover={{ x: 4 }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </a>
                </motion.li>
              ),
            )}
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: 0.2,
          }}
          className="hidden md:flex flex-col items-start w-full"
        >
          <h2 className="mb-5 font-semibold text-white">
            Subscribe to our newsletter
          </h2>

          <p className="text-sm text-white/80 leading-6">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>

          <div className="pt-5 gap-3 flex items-center">
            <motion.input
              whileFocus={{
                scale: 1.01,
              }}
              type="email"
              placeholder="Enter your email"
              className="border border-gray-500/30 bg-gray-800 text-gray-300 placeholder-gray-500 outline-none w-64 h-10 text-sm px-3 rounded-lg focus:border-blue-500 transition-all duration-300"
            />

            <motion.button
              whileHover={{
                y: -2,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="bg-blue-600 text-white rounded-lg h-10 px-6 text-sm hover:bg-blue-700 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Bottom */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.4,
          delay: 0.2,
        }}
        className="text-xs md:text-sm text-center py-5 text-white/60"
      >
        &copy; 2026 Ahmed Tarek. All rights reserved.
      </motion.p>
    </motion.footer>
  );
};

export default Footer;
