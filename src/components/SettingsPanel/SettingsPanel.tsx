import React from "react";
import "./SettingsPanel.css";
import SettingsCheckbox from "./SettingsCheckbox";
import type {ISettings, settingsProps} from "../../App";

const SettingsPanel = ({setSettings, settings}: settingsProps) => {

  const preventSubmit = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') event.preventDefault()
  }


  const changeSetting = (event: React.ChangeEvent<HTMLInputElement>, setting: keyof ISettings): void => {
    setSettings({...settings, [setting]: event.target.checked})
  }

  return (
    <form
      onKeyDown={(event) => preventSubmit(event)}
      className="settings-panel"
    >
      <SettingsCheckbox
        checked={settings.addControlBtns}
        setting="addControlBtns"
        onChange={changeSetting}
      >
        add Control Buttons
      </SettingsCheckbox>
      <SettingsCheckbox
        checked={settings.addIndicators}
        setting="addIndicators"
        onChange={changeSetting}
      >
        add Indicators
      </SettingsCheckbox>
      <SettingsCheckbox
        checked={settings.autoReplay}
        setting="autoReplay"
        onChange={changeSetting}
      >
        Auto replay
        <input
          type="number"
          value={settings.autoReplayDelay}
          onChange={(event) => setSettings(
            {...settings, autoReplayDelay: Number(event.target.value)})}
        /> ms
      </SettingsCheckbox>
      <SettingsCheckbox
        checked={settings.animation}
        onChange={changeSetting}
        setting={'animation'}
      >
        Add animation
        <input
          type={"number"}
          value={settings.animDuration}
          onChange={(event) => setSettings(
            {...settings, animDuration: Number(event.target.value)})}
        />ms <br/>
        {settings.animation &&
          <select
            value={settings.animationCurve}
            onChange={(event) => setSettings(
              {
                ...settings,
                animationCurve: event.target.value as ISettings['animationCurve']
              })}
          >
            <option value='linear'>linear</option>
            <option value='ease'>ease</option>
            <option value='ease-in'>ease-in</option>
            <option value='ease-out'>ease-out</option>
            <option value='ease-in-out'>ease-in-out</option>
          </select>
        }
      </SettingsCheckbox>
      <label className="settings-panel__label">
        Slider logic
        <select
          value={settings.sliderLogic} onChange={(event) => setSettings(
          {
            ...settings,
            sliderLogic: event.target.value as ISettings['sliderLogic']
          })}
        >
          <option value='stip'>strip</option>
          <option value='deque'>deque</option>

        </select>
      </label>
    </form>
  );
};

export default SettingsPanel;
