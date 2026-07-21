import React from "react";
import { X, Rocket, Compass, Calendar, ShieldCheck, Globe } from "lucide-react";

interface SpaceStoryModalProps {
  onClose: () => void;
}

export function SpaceStoryModal({ onClose }: SpaceStoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-2xl overflow-hidden flex flex-col shadow-[8px_8px_0px_0px_#000000]">
        {/* Banner with Earth Image */}
        <div className="h-[240px] relative bg-black flex items-end border-b-4 border-black">
          <img
            alt="Space Orbit"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            src="https://lh3.googleusercontent.com/aida/AP1WRLuywCrC2uXAPkLg-C0ZtBKreLfA438qDfnCPvKMUgArIwb7F14RzTID5W9k724sGAK4-2NDuHV103rFo8ZFSHDdN4wK5tKJ7pUUbLRtZTCsd2_m3pDhXkDofRr_RLQQf6Nr1g3JXpKpwUT2lXNLUlSbmHnAY-7hnN4ozNY95R4kSny1OL8p70lhRrRMx9zpJ_KklJpP0l8QgMwIz9lZSpPV8uW_3YTSWf18ywX_jEVDUs0rgGQZBTtHToM"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <div className="relative p-6 z-10 text-left">
            <span className="bg-white text-black border-2 border-black text-[9px] font-mono font-black uppercase tracking-wider px-3 py-1 mb-3 inline-block">
              HISTORIC SPACE MISSION
            </span>
            <h3 className="text-3xl font-black uppercase italic text-white tracking-tighter">
              LOOK FIRST / THEN LEAP.
            </h3>
            <p className="text-xs text-gray-300 mt-1 font-mono uppercase">
              TradingView's adventure to the stars with astronaut Scott "Kidd" Poteet.
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-1.5 border-2 border-white bg-black hover:bg-white text-white hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[50vh] text-left">
          <p className="text-sm text-gray-800 leading-relaxed font-sans">
            In September 2024, TradingView took its iconic mantra <strong className="text-black font-black">"Look first / Then leap"</strong> literally, boarding the SpaceX Falcon 9 and heading out into orbit as part of the Polaris Dawn mission. Led by mission pilot and seasoned astronaut <strong className="text-black font-black">Scott "Kidd" Poteet</strong>, the crew completed the first-ever commercial spacewalk, demonstrating that extreme commitment is only possible after meticulous, unyielding research.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-50 border-2 border-black flex gap-3">
              <Rocket className="w-5 h-5 text-black shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-black text-black uppercase tracking-wider">The Vehicle</h4>
                <p className="text-xs text-gray-600 mt-1 font-sans">SpaceX Dragon Resilience capsule, orbiting at an apogee of 1,400.7 kilometers.</p>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border-2 border-black flex gap-3">
              <Compass className="w-5 h-5 text-black shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-black text-black uppercase tracking-wider">The Purpose</h4>
                <p className="text-xs text-gray-600 mt-1 font-sans">Conduct scientific studies on radiation effects, communications, and health metrics.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-black text-black flex items-center gap-2 uppercase tracking-tight">
              <Globe className="w-4 h-4 text-black" />
              Commitment to the Human Horizon
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans italic border-l-4 border-black pl-3">
              "Space travel, like trading, is a high-risk landscape where raw intuition will get you lost. You must calculate every vector, observe every chart, and plan every exit route before you push the ignition. Scott Poteet's flight is a reminder to our 100 million strong community: look deeply, study the charts, and then—when the opportunity lights up—leap with absolute conviction."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-black bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-black hover:bg-white text-white hover:text-black border-2 border-black font-black py-2 px-6 text-xs uppercase tracking-wider transition-all brutalist-shadow cursor-pointer"
          >
            Close Mission Brief
          </button>
        </div>
      </div>
    </div>
  );
}
