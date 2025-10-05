import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

const Tooltip = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${positionClasses[position]} z-50 pointer-events-none`}
          >
            <div className="bg-gray-900 text-white text-sm rounded-lg px-4 py-3 shadow-xl border border-white/20 max-w-sm whitespace-normal">
              {content}
              <div className={`absolute w-2 h-2 bg-gray-900 border-white/20 transform rotate-45 ${
                position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-b border-r' :
                position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2 border-t border-l' :
                position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2 border-t border-r' :
                'left-[-4px] top-1/2 -translate-y-1/2 border-b border-l'
              }`}></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const InfoTooltip = ({ content, position = 'top' }) => {
  return (
    <Tooltip content={content} position={position}>
      <Info className="w-4 h-4 text-gray-400 hover:text-cyan-400 transition-colors cursor-help" />
    </Tooltip>
  );
};

export default Tooltip;
