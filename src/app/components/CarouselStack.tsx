import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AnimationSettings } from "./SettingsPanel";

const STACK_POSITIONS = 4;

const createCardVariants = (settings: AnimationSettings) => ({
  visible: (i: number) => ({
    opacity: 1,
    zIndex: [4, 3, 2, 1][i] ?? 0,
    scale: [1, 0.9, 0.85, 0.8][i] ?? 0.8,
    y: [0, -12, 0, 12][i] ?? 12,
    rotate: [0, 2, 4, 7][i] ?? 7,
    x: [0, 32, 48, 62][i] ?? 62,
    perspective: 400,
    transition: {
      zIndex: { delay: settings.zIndexDelay },
      scale: { type: "spring", duration: settings.springDuration, bounce: settings.springBounce },
      y: { type: "spring", duration: settings.springDuration, bounce: settings.springBounce },
      x: { type: "spring", duration: settings.xSpringDuration, bounce: settings.xSpringBounce },
    },
  }),
  exit: { opacity: 0, scale: 0.5, y: 50 },
});

const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

interface CardStyleInput {
  id: string;
  image: string;
  imageScale: number;
  background: string;
}

interface CarouselStackProps {
  settings: AnimationSettings;
  cardStyles: CardStyleInput[];
}

export const CarouselStack: React.FC<CarouselStackProps> = ({ settings, cardStyles }) => {
  const [order, setOrder] = useState<string[]>(() => cardStyles.map((c) => c.id));
  const [dragElastic, setDragElastic] = useState(0.7);

  useEffect(() => {
    setDragElastic(settings.dragElastic);
  }, [settings.dragElastic]);

  useEffect(() => {
    setOrder((prev) => {
      const ids = cardStyles.map((c) => c.id);
      const kept = prev.filter((id) => ids.includes(id));
      const added = ids.filter((id) => !kept.includes(id));
      return [...kept, ...added];
    });
  }, [cardStyles]);

  const paginate = () => {
    setOrder((prev) => (prev.length > 1 ? [...prev.slice(1), prev[0]] : prev));
  };

  const cardVariants = createCardVariants(settings);

  const byId = new Map(cardStyles.map((c) => [c.id, c]));
  const visible = order.slice(0, Math.min(STACK_POSITIONS, order.length));

  return (
    <div className="content-container">
      <AnimatePresence initial={false}>
        {visible.map((id, i) => {
          const card = byId.get(id);
          if (!card) return null;
          return (
            <motion.div
              key={id}
              custom={i}
              variants={cardVariants}
              initial="exit"
              animate="visible"
              exit="exit"
              drag={true}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={dragElastic}
              onDragEnd={(_e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (
                  swipe < -settings.swipeConfidenceThreshold ||
                  swipe > settings.swipeConfidenceThreshold
                ) {
                  paginate();
                }
              }}
              className={`card card-${i}`}
              style={{ background: card.background }}
            >
              <img
                src={card.image}
                alt=""
                style={{ transform: `scale(${card.imageScale})` }}
              />
              <div className="card-content" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CarouselStack;
