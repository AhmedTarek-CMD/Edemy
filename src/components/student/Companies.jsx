import React from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";

const companies = [
  {
    name: "Microsoft",
    logo: assets.microsoft_logo,
  },
  {
    name: "Walmart",
    logo: assets.walmart_logo,
  },
  {
    name: "Accenture",
    logo: assets.accenture_logo,
  },
  {
    name: "Adobe",
    logo: assets.adobe_logo,
  },
  {
    name: "PayPal",
    logo: assets.paypal_logo,
  },
];

const Companies = () => {
  return (
    <section className="pt-20">
      {/* Title */}
      <motion.p
        className="text-base text-gray-500 text-center"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
      >
        Trusted by Learners From
      </motion.p>

      {/* Logos */}
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-8">
        {companies.map((company, index) => (
          <motion.div
            key={company.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{
              y: -4,
            }}
            className="group cursor-pointer"
          >
            <motion.img
              src={company.logo}
              alt={company.name}
              className="w-20 md:w-28 object-contain opacity-70  transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.25 }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Companies;
