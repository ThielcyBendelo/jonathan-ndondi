// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// Composant de base pour les animations skeleton
const SkeletonItem = ({ className = '', animate = true }) => (
  <motion.div
    className={`bg-gradient-to-r from-gray-300/20 to-gray-400/20 rounded-lg ${className}`}
    animate={
      animate
        ? {
            opacity: [0.4, 0.8, 0.4],
          }
        : {}
    }
    transition={
      animate
        ? {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        : {}
    }
  />
);

// Skeleton pour les cartes de services
export const ServicesSkeleton = () => (
  <motion.div
    className="py-20 bg-gradient-to-br from-dark-100 via-dark-200 to-dark-100"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="container mx-auto px-6">
      {/* Header skeleton */}
      <div className="text-center mb-16">
        <SkeletonItem className="h-12 w-96 mx-auto mb-4" />
        <SkeletonItem className="h-6 w-[600px] mx-auto mb-2" />
        <SkeletonItem className="h-6 w-96 mx-auto" />
      </div>

      {/* Services grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-dark-200/50 rounded-2xl p-8 border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            {/* Icon */}
            <SkeletonItem className="w-16 h-16 rounded-full mb-6" />

            {/* Title */}
            <SkeletonItem className="h-8 w-48 mb-2" />
            <SkeletonItem className="h-5 w-36 mb-4" />

            {/* Description */}
            <SkeletonItem className="h-4 w-full mb-2" />
            <SkeletonItem className="h-4 w-full mb-2" />
            <SkeletonItem className="h-4 w-3/4 mb-6" />

            {/* Features */}
            <div className="space-y-2 mb-6">
              {[...Array(4)].map((_, j) => (
                <SkeletonItem key={j} className="h-4 w-32" />
              ))}
            </div>

            {/* Price and button */}
            <div className="flex justify-between items-center mb-4">
              <SkeletonItem className="h-6 w-24" />
              <SkeletonItem className="h-5 w-20" />
            </div>

            <SkeletonItem className="h-12 w-full rounded-lg" />
          </motion.div>
        ))}
      </div>

      {/* CTA Section skeleton */}
      <div className="text-center">
        <SkeletonItem className="h-10 w-80 mx-auto mb-4" />
        <SkeletonItem className="h-5 w-96 mx-auto mb-8" />
        <SkeletonItem className="h-12 w-48 mx-auto rounded-lg" />
      </div>
    </div>
  </motion.div>
);

// Skeleton pour la section Skills
export const SkillsSkeleton = () => (
  <motion.div
    className="py-20 bg-dark-200"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="container mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <SkeletonItem className="h-12 w-80 mx-auto mb-4" />
        <SkeletonItem className="h-6 w-96 mx-auto" />
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-dark-300 rounded-xl p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <SkeletonItem className="w-12 h-12 mx-auto mb-3 rounded-lg" />
            <SkeletonItem className="h-5 w-20 mx-auto mb-2" />
            <SkeletonItem className="h-4 w-16 mx-auto" />
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

// Skeleton pour la section Experience
export const ExperienceSkeleton = () => (
  <motion.div
    className="py-20 bg-dark-100"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="container mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <SkeletonItem className="h-12 w-72 mx-auto mb-4" />
        <SkeletonItem className="h-6 w-80 mx-auto" />
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="flex gap-6 mb-12"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
          >
            {/* Timeline dot */}
            <div className="flex flex-col items-center">
              <SkeletonItem className="w-4 h-4 rounded-full" />
              {i < 3 && <SkeletonItem className="w-0.5 h-20 mt-4" />}
            </div>

            {/* Content */}
            <div className="flex-1">
              <SkeletonItem className="h-8 w-64 mb-2" />
              <SkeletonItem className="h-5 w-48 mb-2" />
              <SkeletonItem className="h-4 w-32 mb-4" />
              <SkeletonItem className="h-4 w-full mb-2" />
              <SkeletonItem className="h-4 w-5/6" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

// Skeleton pour les projets
export const ProjectsSkeleton = () => (
  <motion.div
    className="py-20 bg-dark-200"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="container mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <SkeletonItem className="h-12 w-64 mx-auto mb-4" />
        <SkeletonItem className="h-6 w-80 mx-auto" />
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-dark-300 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            {/* Image */}
            <SkeletonItem className="h-48 w-full" animate={false} />

            {/* Content */}
            <div className="p-6">
              <SkeletonItem className="h-6 w-48 mb-2" />
              <SkeletonItem className="h-4 w-full mb-2" />
              <SkeletonItem className="h-4 w-3/4 mb-4" />

              {/* Tags */}
              <div className="flex gap-2 mb-4">
                <SkeletonItem className="h-6 w-16 rounded-full" />
                <SkeletonItem className="h-6 w-20 rounded-full" />
                <SkeletonItem className="h-6 w-14 rounded-full" />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <SkeletonItem className="h-10 w-24 rounded-lg" />
                <SkeletonItem className="h-10 w-20 rounded-lg" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

// Skeleton pour le contact
export const ContactSkeleton = () => (
  <motion.div
    className="py-20 bg-dark-100"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="container mx-auto px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SkeletonItem className="h-12 w-72 mx-auto mb-4" />
          <SkeletonItem className="h-6 w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form skeleton */}
          <div className="space-y-6">
            <SkeletonItem className="h-12 w-full rounded-lg" />
            <SkeletonItem className="h-12 w-full rounded-lg" />
            <SkeletonItem className="h-32 w-full rounded-lg" />
            <SkeletonItem className="h-12 w-full rounded-lg" />
          </div>

          {/* Contact links skeleton */}
          <div className="space-y-4">
            <SkeletonItem className="h-6 w-48 mb-4" />
            {[...Array(6)].map((_, i) => (
              <SkeletonItem key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default {
  ServicesSkeleton,
  SkillsSkeleton,
  ExperienceSkeleton,
  ProjectsSkeleton,
  ContactSkeleton,
};
