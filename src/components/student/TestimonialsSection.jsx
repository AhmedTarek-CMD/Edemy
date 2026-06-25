import React from "react";
import { motion } from "framer-motion";
import { assets, dummyTestimonial } from "../../assets/assets";

const TestimonialsSection = () => {
  return (
    <section className="pb-20 xl:px-70 lg:px-40 px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-medium text-gray-800">Testimonials</h2>

        <p className="md:text-base text-gray-500 mt-3">
          Hear from our learners as they share their journeys of transformation,
          success, and how our
          <br />
          platform has made a difference in their lives.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
        {dummyTestimonial.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.3,
              delay: index * 0.12,
              ease: "easeOut",
            }}
            whileHover={{ y: -4 }}
            className="group border border-gray-200 rounded-2xl bg-white text-left overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 px-5 py-5 bg-gray-50 border-b border-gray-100">
              <motion.img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {testimonial.name}
                </h3>

                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="h-4 w-4 opacity-90"
                    src={
                      i < Math.floor(testimonial.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                  />
                ))}
              </div>

              <p className="text-gray-600 mt-5 leading-7 text-sm">
                {testimonial.feedback}
              </p>

              <button className="mt-5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                Read more
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
