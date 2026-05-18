import { useState } from "react";
import CarouselStack from "./components/CarouselStack";
import { SettingsPanel, AnimationSettings } from "./components/SettingsPanel";
import { items as defaultItems } from "./components/items";

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

  const [cardImages, setCardImages] = useState<string[]>(
    defaultItems.map((it) => it.image),
  );

  return (
    <div className="App">
      <div className="hero-container">
        <div className="container">
          <CarouselStack settings={settings} images={cardImages} />
        </div>
      </div>
      <SettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        cardImages={cardImages}
        onCardImagesChange={setCardImages}
      />
    </div>
  );
}
