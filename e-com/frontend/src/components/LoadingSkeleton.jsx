import { motion } from 'framer-motion';

const shimmerTransition = {
  duration: 1.5,
  repeat: Infinity,
  ease: 'linear',
};

const shimmerVariants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
};

const shimmerBackground = 'linear-gradient(90deg, #1f1f1f 25%, #2a2a2a 50%, #1f1f1f 75%)';

export function ProductSkeleton() {
  return (
    <div className="bg-brand-surface-card rounded-2xl border border-white/5 p-4 flex flex-col justify-between h-[360px] overflow-hidden">
      <div>
        {/* Aspect Image Area */}
        <div className="relative aspect-square w-full bg-brand-surface rounded-xl overflow-hidden mb-4">
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            transition={shimmerTransition}
            style={{
              backgroundImage: shimmerBackground,
              backgroundSize: '200% 100%',
              width: '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Small Brand Pill */}
        <div className="w-16 h-4 bg-white/5 rounded-md overflow-hidden relative">
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            transition={shimmerTransition}
            style={{
              backgroundImage: shimmerBackground,
              backgroundSize: '200% 100%',
              width: '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Title line 1 */}
        <div className="w-3/4 h-5 bg-white/5 rounded-md overflow-hidden relative mt-3">
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            transition={shimmerTransition}
            style={{
              backgroundImage: shimmerBackground,
              backgroundSize: '200% 100%',
              width: '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Size pills */}
        <div className="flex gap-1.5 mt-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="w-10 h-5 bg-white/5 rounded overflow-hidden relative">
              <motion.div
                variants={shimmerVariants}
                animate="animate"
                transition={shimmerTransition}
                style={{
                  backgroundImage: shimmerBackground,
                  backgroundSize: '200% 100%',
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Price + arrow row */}
      <div className="flex items-center justify-between mt-6 pt-2">
        <div className="w-16 h-6 bg-white/5 rounded-md overflow-hidden relative">
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            transition={shimmerTransition}
            style={{
              backgroundImage: shimmerBackground,
              backgroundSize: '200% 100%',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 overflow-hidden relative">
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            transition={shimmerTransition}
            style={{
              backgroundImage: shimmerBackground,
              backgroundSize: '200% 100%',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </div>

    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 gap-4">
      <div className="flex items-center gap-3 w-1/2">
        <div className="w-10 h-10 bg-white/5 rounded-lg overflow-hidden relative flex-shrink-0">
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            transition={shimmerTransition}
            style={{
              backgroundImage: shimmerBackground,
              backgroundSize: '200% 100%',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
        <div className="w-full space-y-2">
          <div className="w-3/4 h-4 bg-white/5 rounded overflow-hidden relative">
            <motion.div
              variants={shimmerVariants}
              animate="animate"
              transition={shimmerTransition}
              style={{
                backgroundImage: shimmerBackground,
                backgroundSize: '200% 100%',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
          <div className="w-1/2 h-3 bg-white/5 rounded overflow-hidden relative">
            <motion.div
              variants={shimmerVariants}
              animate="animate"
              transition={shimmerTransition}
              style={{
                backgroundImage: shimmerBackground,
                backgroundSize: '200% 100%',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-1/4 h-4 bg-white/5 rounded overflow-hidden relative">
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          transition={shimmerTransition}
          style={{
            backgroundImage: shimmerBackground,
            backgroundSize: '200% 100%',
            width: '100%',
            height: '100%',
          }}
        />
      </div>
      <div className="w-16 h-6 bg-white/5 rounded-full overflow-hidden relative">
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          transition={shimmerTransition}
          style={{
            backgroundImage: shimmerBackground,
            backgroundSize: '200% 100%',
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </div>
  );
}
