import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Settings, X, Upload, Plus, Trash2 } from "lucide-react";
import { items as defaultItems } from "./items";

const makeId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2));

const MAX_CARDS = 8;

export interface AnimationSettings {
  springDuration: number;
  springBounce: number;
  xSpringDuration: number;
  xSpringBounce: number;
  dragElastic: number;
  swipeConfidenceThreshold: number;
  zIndexDelay: number;
}

export interface CardStyle {
  id: string;
  image: string;
  imageScale: number;
  background: string;
}

interface SettingsPanelProps {
  settings: AnimationSettings;
  onSettingsChange: (settings: AnimationSettings) => void;
  cardStyles: CardStyle[];
  onCardStylesChange: (styles: CardStyle[]) => void;
}

const labelStyle: React.CSSProperties = { fontFamily: 'Inter', color: 'rgba(0,0,0,0.6)' };
const valueStyle: React.CSSProperties = { color: 'rgba(0,0,0,0.6)' };

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  cardStyles,
  onCardStylesChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputs = useRef<Array<HTMLInputElement | null>>([]);

  const updateSetting = (key: keyof AnimationSettings, value: number) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const updateCard = (index: number, patch: Partial<CardStyle>) => {
    const next = cardStyles.map((c, i) => (i === index ? { ...c, ...patch } : c));
    onCardStylesChange(next);
  };

  const handleImageFile = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => updateCard(index, { image: reader.result as string });
    reader.readAsDataURL(file);
  };

  const resetCards = () => {
    onCardStylesChange(
      defaultItems.map((it) => ({ id: makeId(), image: it.image, imageScale: 1, background: "#ffffff" })),
    );
  };

  const addCard = () => {
    if (cardStyles.length >= MAX_CARDS) return;
    const fallback = defaultItems[cardStyles.length % defaultItems.length].image;
    onCardStylesChange([
      ...cardStyles,
      { id: makeId(), image: fallback, imageScale: 1, background: "#ffffff" },
    ]);
  };

  const removeCard = (index: number) => {
    if (cardStyles.length <= 1) return;
    onCardStylesChange(cardStyles.filter((_, i) => i !== index));
  };

  const resetToDefaults = () => {
    onSettingsChange({
      springDuration: 0.3,
      springBounce: 0.3,
      xSpringDuration: 0.5,
      xSpringBounce: 0.1,
      dragElastic: 0.7,
      swipeConfidenceThreshold: 10000,
      zIndexDelay: 0.05,
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm border-border hover:bg-white shadow-sm h-8 w-8"
      >
        <Settings className="h-3.5 w-3.5" />
      </Button>

      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-[320px] bg-white border-l border-border shadow-lg z-[60] overflow-y-auto">
          <div className="flex items-start justify-end px-4 py-3 border-b border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div style={{ padding: "16px" }}>
            <div style={{ marginBottom: "20px" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "10px" }}>
                <Label className="text-[13px] font-normal" style={labelStyle}>
                  Cards
                </Label>
                <button
                  type="button"
                  onClick={resetCards}
                  className="text-[11px]"
                  style={{ color: 'rgba(0,0,0,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Reset
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cardStyles.map((card, i) => (
                  <div
                    key={card.id}
                    style={{
                      position: 'relative',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: '10px',
                      padding: '10px',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => removeCard(i)}
                      disabled={cardStyles.length <= 1}
                      title="Remove card"
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: cardStyles.length <= 1 ? 'not-allowed' : 'pointer',
                        color: cardStyles.length <= 1 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.45)',
                        borderRadius: '4px',
                        display: 'inline-flex',
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputs.current[i]?.click()}
                      title={`Change image ${i + 1}`}
                      style={{
                        position: 'relative',
                        width: '64px',
                        height: '64px',
                        flexShrink: 0,
                        borderRadius: '8px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        padding: 0,
                        cursor: 'pointer',
                        background: card.background,
                      }}
                    >
                      <img
                        src={card.image}
                        alt={`Card ${i + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transform: `scale(${card.imageScale})`,
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(0,0,0,0.35)', color: '#fff', opacity: 0, transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                      >
                        <Upload className="h-3.5 w-3.5" />
                      </span>
                    </button>
                    <input
                      ref={(el) => (fileInputs.current[i] = el)}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(i, file);
                        e.target.value = '';
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ marginBottom: '6px' }}>
                        <span className="text-[11px]" style={valueStyle}>Card {i + 1}</span>
                      </div>

                      <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                        <Label className="text-[11px] font-normal" style={labelStyle}>Image scale</Label>
                        <span className="text-[11px] font-mono" style={valueStyle}>{card.imageScale.toFixed(2)}x</span>
                      </div>
                      <Slider
                        value={[card.imageScale]}
                        onValueChange={([v]) => updateCard(i, { imageScale: v })}
                        min={0.5}
                        max={2}
                        step={0.05}
                        className="w-full"
                      />

                      <div className="flex items-center justify-between" style={{ marginTop: '8px' }}>
                        <Label className="text-[11px] font-normal" style={labelStyle}>Background</Label>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span className="text-[11px] font-mono" style={valueStyle}>{card.background}</span>
                          <label
                            title="Pick background color"
                            style={{
                              position: 'relative',
                              width: '20px',
                              height: '20px',
                              borderRadius: '4px',
                              border: '1px solid rgba(0,0,0,0.2)',
                              background: card.background,
                              cursor: 'pointer',
                              display: 'inline-block',
                              overflow: 'hidden',
                            }}
                          >
                            <input
                              type="color"
                              value={/^#[0-9a-f]{6}$/i.test(card.background) ? card.background : '#ffffff'}
                              onChange={(e) => updateCard(i, { background: e.target.value })}
                              style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: 'pointer',
                                border: 0,
                                padding: 0,
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={addCard}
                disabled={cardStyles.length >= MAX_CARDS}
                variant="outline"
                size="sm"
                className="w-full text-xs h-7"
                style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <Plus className="h-3 w-3" />
                Add card {cardStyles.length >= MAX_CARDS ? `(max ${MAX_CARDS})` : ''}
              </Button>
            </div>

            <Separator style={{ marginBottom: '16px' }} />

            <div style={{ marginBottom: "16px" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                <Label className="text-[13px] font-normal" style={labelStyle}>Animation Duration</Label>
                <span className="text-xs font-mono px-1.5 py-0.5" style={valueStyle}>
                  {settings.springDuration.toFixed(2)}s
                </span>
              </div>
              <Slider
                value={[settings.springDuration]}
                onValueChange={([value]) => updateSetting("springDuration", value)}
                min={0.1}
                max={1.0}
                step={0.05}
                className="w-full"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                <Label className="text-[13px] font-normal" style={labelStyle}>Animation Bounce</Label>
                <span className="text-xs font-mono px-1.5 py-0.5" style={valueStyle}>
                  {settings.springBounce.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[settings.springBounce]}
                onValueChange={([value]) => updateSetting("springBounce", value)}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                <Label className="text-[13px] font-normal" style={labelStyle}>Duration</Label>
                <span className="text-xs font-mono px-1.5 py-0.5" style={valueStyle}>
                  {settings.xSpringDuration.toFixed(2)}s
                </span>
              </div>
              <Slider
                value={[settings.xSpringDuration]}
                onValueChange={([value]) => updateSetting("xSpringDuration", value)}
                min={0.1}
                max={1.5}
                step={0.05}
                className="w-full"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                <Label className="text-[13px] font-normal" style={labelStyle}>Bounce</Label>
                <span className="text-xs font-mono px-1.5 py-0.5" style={valueStyle}>
                  {settings.xSpringBounce.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[settings.xSpringBounce]}
                onValueChange={([value]) => updateSetting("xSpringBounce", value)}
                min={0}
                max={0.5}
                step={0.01}
                className="w-full"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                <Label className="text-[13px] font-normal" style={labelStyle}>Drag Elasticity</Label>
                <span className="text-xs font-mono px-1.5 py-0.5" style={valueStyle}>
                  {settings.dragElastic.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[settings.dragElastic]}
                onValueChange={([value]) => updateSetting("dragElastic", value)}
                min={0.1}
                max={1.5}
                step={0.05}
                className="w-full"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                <Label className="text-[13px] font-normal" style={labelStyle}>Swipe Sensitivity</Label>
                <span className="text-xs font-mono px-1.5 py-0.5" style={valueStyle}>
                  {settings.swipeConfidenceThreshold.toLocaleString()}
                </span>
              </div>
              <Slider
                value={[settings.swipeConfidenceThreshold]}
                onValueChange={([value]) => updateSetting("swipeConfidenceThreshold", value)}
                min={1000}
                max={20000}
                step={500}
                className="w-full"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                <Label className="text-[13px] font-normal" style={labelStyle}>Z-Index Delay</Label>
                <span className="text-xs font-mono px-1.5 py-0.5" style={valueStyle}>
                  {settings.zIndexDelay.toFixed(3)}s
                </span>
              </div>
              <Slider
                value={[settings.zIndexDelay]}
                onValueChange={([value]) => updateSetting("zIndexDelay", value)}
                min={0}
                max={0.2}
                step={0.01}
                className="w-full"
              />
            </div>

            <div className="pt-2 border-t border-border">
              <Button
                onClick={resetToDefaults}
                variant="outline"
                size="sm"
                className="w-full text-xs h-7"
              >
                Reset to Defaults
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
