import React from "react";
import { Sparkles, Film, Compass, Utensils, Activity } from "lucide-react";

export interface PresetVideo {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  hashtags: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export const VIDEO_PRESETS: PresetVideo[] = [
  {
    id: "preset-tech",
    name: "AI Smart Assistant Unboxing",
    category: "Tech & Gadgets",
    icon: Sparkles,
    title: "This AI Companion is From 2030! Unboxing & First Reactions",
    description: "Today I am unboxing the brand new holographic AI assistant. It connects to all your smart home devices instantly and can even suggest recipes based on what is in your fridge. Let me know in the comments if you would buy this for $199!",
    hashtags: "ai, technology, futuristic, coolgadgets, unboxing, smartdevice",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-with-a-blue-screen-on-41617-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "preset-cooking",
    name: "Crispy ASMR Roasted Garlic Bread",
    category: "Aesthetic Cooking",
    icon: Utensils,
    title: "How to Make the Sound of Perfect Garlic Bread Crunch ASMR",
    description: "This is the ultimate secret garlic bread recipe. Layered with roasted garlic paste, freshly organic parsley, and a blend of triple cheese (parmesan, mozzarella, pecorino). Hear that crunchy toast at the end!",
    hashtags: "garlicbread, asmr, cooking, foodtok, cheesy, breadrecipe, viralrecipe",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-dripping-honey-on-fresh-pancakes-34354-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "preset-travel",
    name: "Hidden Bali Waterfall Hike",
    category: "Travel & Exploration",
    icon: Compass,
    title: "Secret Waterfalls in Bali You MUST Visit If You Hate Big Crowds",
    description: "Deep in the northern jungle of Bali lies this pristine 80-meter waterfall. It requires a steep 30-minute hike down narrow ancient steps, but once you arrive, you have the entire emerald natural plunge pool to yourself. Save this for your next adventure trip!",
    hashtags: "bali, travelvlog, wilderness, hiddengems, wanders, adventure, waterfallhike",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-going-down-a-slide-at-a-water-park-41566-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "preset-fitness",
    name: "5-Min Intense Morning Burner",
    category: "Health & Fitness",
    icon: Activity,
    title: "Do This Quick morning workout routine to boost daily energy",
    description: "No weights, no equipment, no excuses! This 5-minute morning explosive circuit features 4 movements designed to elevate your heart rate, kickstart fat loss, and keep you dynamic all day. Try it with me!",
    hashtags: "fitness, workoutroutine, morningenergy, morningmotivation, fatloss, hiit, homegym",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-doing-pushups-in-gym-40277-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400",
  }
];

interface PresetsProps {
  onSelect: (preset: PresetVideo) => void;
  selectedId: string | null;
}

export const Presets: React.FC<PresetsProps> = ({ onSelect, selectedId }) => {
  return (
    <div id="presets-section" className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <h3 id="presets-title" className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
          <Film className="w-3.5 h-3.5 text-blue-600" />
          Test-Drive Presets
        </h3>
        <span className="text-[10px] text-slate-400 font-medium font-sans">Click to instantly populate editor</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {VIDEO_PRESETS.map((preset) => {
          const IconComponent = preset.icon;
          const isSelected = selectedId === preset.id;
          return (
            <button
              key={preset.id}
              id={`preset-btn-${preset.id}`}
              type="button"
              onClick={() => onSelect(preset)}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all group duration-200 cursor-pointer ${
                isSelected
                  ? "bg-blue-50/75 border-blue-600 shadow-xs text-blue-900"
                  : "bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? "bg-blue-200/50 text-blue-700" : "bg-white border border-slate-200 text-slate-400 group-hover:text-slate-600"}`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? "text-blue-600" : "text-slate-400"}`}>{preset.category}</p>
                <p className={`text-xs font-semibold truncate ${isSelected ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"} mt-0.5`}>{preset.name}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
