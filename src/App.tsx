import "./styles/index.css";
import img1 from "./assets/1.jpg";
import img2 from "./assets/2.jpg";
import img3 from "./assets/3.jpg";
import img4 from "./assets/4.jpg";
import Carousel from "./components/Carousel/Carousel";
import ControlPanel from "./components/SettingsPanel/SettingsPanel";
import type React from "react";
import {useState} from "react";

const IMAGES = [img1, img2, img3, img4];

export interface ISettings {
  addControlBtns: boolean;
  addIndicators: boolean;
  autoReplay: boolean;
  autoReplayDelay: number;
  animDuration: number;
  animation: boolean;
  animationCurve: 'ease' | 'linear' | 'easy-in' | 'ease-out' | 'ease-in-out';
  sliderLogic: 'strip' | 'deque';
}

export interface settingsProps {
  settings: ISettings;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
}

const App = () => {
  const [settings, setSettings] = useState<ISettings>({
    addControlBtns: true,
    addIndicators: false,
    autoReplay: false,
    autoReplayDelay: 1000,
    animation: false,
    animDuration: 1000,
    animationCurve: 'linear',
    sliderLogic: 'strip',
  });

  return (
    <div className="app">
      <Carousel
        imageUrls={IMAGES}
        settings={settings}
        setSettings={setSettings}
      />
      <ControlPanel settings={settings} setSettings={setSettings}/>
    </div>
  );
};

export default App;
