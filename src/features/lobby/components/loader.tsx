import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div
      key="loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="mx-auto mb-4 w-12 h-12 rounded-full border-4"
          style={{
            borderColor: 'rgba(61, 90, 71, 0.2)',
            borderTopColor: 'rgba(61, 90, 71, 0.8)',
          }}
        />
        <p className="font-handwritten text-2xl text-foreground">
          Preparing the adventure...
        </p>
      </div>
    </motion.div>
  );
};

export default Loader;
