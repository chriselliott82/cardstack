import { useState } from "react";
import CarouselStack from "./components/CarouselStack";
import { SettingsPanel, AnimationSettings, CardStyle } from "./components/SettingsPanel";
import { items as defaultItems } from "./components/items";

const makeId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2));

const defaultCardStyles: CardStyle[] = defaultItems.map((it) => ({
  id: makeId(),
  image: it.image,
  imageScale: 1,
  background: "#ffffff",
}));

export default function App() {
  const [settings, setSettings] = useState<AnimationSettings>({
    springDuration: 0.3,
    springBounce: 0.3,
    xSpringDuration: 0.5,
    xSpringBounce: 0.1,
    dragElastic: 0.7,
    swipeConfidenceThreshold: 10000,
    zIndexDelay: 0.05,
  });

  const [cardStyles, setCardStyles] = useState<CardStyle[]>(defaultCardStyles);

  return (
    <div className="App">
      <div className="hero-container">
        <div className="container">
          <CarouselStack settings={settings} cardStyles={cardStyles} />
        </div>
      </div>
      <SettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        cardStyles={cardStyles}
        onCardStylesChange={setCardStyles}
      />
    </div>
  );
}
