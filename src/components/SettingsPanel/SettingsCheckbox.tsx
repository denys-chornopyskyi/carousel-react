import type React from "react";
import type {ISettings} from "../../App";

interface SettingsCheckboxProps {
  checked: boolean,
  onChange(event: React.ChangeEvent<HTMLInputElement>, setting: keyof ISettings): void;
  children: React.ReactNode;
  setting: keyof ISettings;
}

const SettingsCheckbox = ({
                            checked,
                            onChange,
                            children,
                            setting
                          }: SettingsCheckboxProps) => {
  return (
    <label className="settings-panel__label">
      <input
        type="checkbox"
        checked={checked}
        onChange={event => onChange(event, setting)}
      />
      {children}
    </label>
  );
};

export default SettingsCheckbox;
