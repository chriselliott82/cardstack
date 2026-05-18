import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Settings, X, Upload } from "lucide-react";
import { items as defaultItems } from "./items";

export interface AnimationSettings {
  springDuration: number;
  springBounce: number;
  xSpringDuration: number;
  xSpringBounce: number;
  dragElastic: number;
  swipeConfidenceThreshold: number;
  zIndexDelay: number;
}

interface SettingsPanelProps {
  settings: AnimationSettings;
  onSettingsChange: (settings: AnimationSettings) => void;
  cardImages: string[];
  onCardImagesChange: (images: string[]) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  cardImages,
  onCardImagesChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleImageFile = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const next = [...cardImages];
      next[index] = reader.result as string;
      onCardImagesChange(next);
    };
    reader.readAsDataURL(file);
  };

  const resetImages = () => {
    onCardImagesChange(defaultItems.map((it) => it.image));
  };

  const updateSetting = (
    key: keyof AnimationSettings,
    value: number,
  ) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
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
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: "8px" }}
              >
                <Label className="text-[13px] font-normal" style={{ fontFamily: 'Inter', color: 'rgba(0,0,0,0.6)' }}>
                  Card Images
                </Label>
                <button
                  type="button"
                  onClick={resetImages}
                  className="text-[11px]"
                  style={{ color: 'rgba(0,0,0,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Reset
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {cardImages.map((src, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => fileInputs.current[i]?.click()}
                      title={`Change image ${i + 1}`}
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1 / 1',
                        borderRadius: '8px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        padding: 0,
                        cursor: 'pointer',
                        background: '#f5f5f5',
                      }}
                    >
                      <img
                        src={src}
                        alt={`Card ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
                    <span className="text-[10px]" style={{ color: 'rgba(0,0,0,0.5)' }}>Card {i + 1}</span>
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
                  </div>
                ))}
              </div>
            </div>

            <Separator style={{ marginBottom: '16px' }} />

            <div style={{ marginBottom: "16px" }}>
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: "8px" }}
              >
                <Label className="text-[13px] font-normal" style={{ fontFamily: 'Inter', color: 'rgba(0,0,0,0.6)' }}>
                  Animation Duration
                </Label>
                <span className="text-xs font-mono px-1.5 py-0.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  {settings.springDuration.toFixed(2)}s
                </span>
              </div>
              <Slider
                value={[settings.springDuration]}
                onValueChange={([value]) =>
                  updateSetting("springDuration", value)
                }
                min={0.1}
                max={1.0}
                step={0.05}
                className="w-full"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: "8px" }}
              >
                <Label className="text-[13px] font-normal" style={{ fontFamily: 'Inter', color: 'rgba(0,0,0,0.6)' }}>
                  Animation Bounce
                </Label>
                <span className="text-xs font-mono px-1.5 py-0.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  {settings.springBounce.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[settings.springBounce]}
                onValueChange={([value]) =>
                  updateSetting("springBounce", value)
                }
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: "8px" }}
              >
                <Label className="text-[13px] font-normal" style={{ fontFamily: 'Inter', color: 'rgba(0,0,0,0.6)' }}>
                  Duration
                </Label>
                <span className="text-xs font-mono px-1.5 py-0.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  {settings.xSpringDuration.toFixed(2)}s
                </span>
              </div>
              <Slider
                value={[settings.xSpringDuration]}
                onValueChange={([value]) =>
                  updateSetting("xSpringDuration", value)
                }
                min={0.1}
                max={1.5}
                step={0.05}
                className="w-full"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: "8px" }}
              >
                <Label className="text-[13px] font-normal" style={{ fontFamily: 'Inter', color: 'rgba(0,0,0,0.6)' }}>
                  Bounce
                </Label>
                <span className="text-xs font-mono px-1.5 py-0.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  {settings.xSpringBounce.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[settings.xSpringBounce]}
                onValueChange={([value]) =>
                  updateSetting("xSpringBounce", value)
                }
                min={0}
                max={0.5}
                step={0.01}
                className="w-full"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: "8px" }}
              >
                <Label className="text-[13px] font-normal" style={{ fontFamily: 'Inter', color: 'rgba(0,0,0,0.6)' }}>
                  Drag Elasticity
                </Label>
                <span className="text-xs font-mono px-1.5 py-0.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  {settings.dragElastic.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[settings.dragElastic]}
                onValueChange={([value]) =>
                  updateSetting("dragElastic", value)
                }
                min={0.1}
                max={1.5}
                step={0.05}
                className="w-full"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: "8px" }}
              >
                <Label className="text-[13px] font-normal" style={{ fontFamily: 'Inter', color: 'rgba(0,0,0,0.6)' }}>
                  Swipe Sensitivity
                </Label>
                <span className="text-xs font-mono px-1.5 py-0.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  {settings.swipeConfidenceThreshold.toLocaleString()}
                </span>
              </div>
              <Slider
                value={[settings.swipeConfidenceThreshold]}
                onValueChange={([value]) =>
                  updateSetting(
                    "swipeConfidenceThreshold",
                    value,
                  )
                }
                min={1000}
                max={20000}
                step={500}
                className="w-full"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: "8px" }}
              >
                <Label className="text-[13px] font-normal" style={{ fontFamily: 'Inter', color: 'rgba(0,0,0,0.6)' }}>
                  Z-Index Delay
                </Label>
                <span className="text-xs font-mono px-1.5 py-0.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  {settings.zIndexDelay.toFixed(3)}s
                </span>
              </div>
              <Slider
                value={[settings.zIndexDelay]}
                onValueChange={([value]) =>
                  updateSetting("zIndexDelay", value)
                }
                min={0}
                max={0.2}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* Reset Button */}
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