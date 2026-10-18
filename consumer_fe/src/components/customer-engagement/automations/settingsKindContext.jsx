import { createContext, useContext } from 'react';
import { getSettingsUiCopy } from './settingsData';

const SettingsKindContext = createContext(getSettingsUiCopy('birthday'));

export function SettingsKindProvider({ kindId = 'birthday', children }) {
  return (
    <SettingsKindContext.Provider value={getSettingsUiCopy(kindId)}>
      {children}
    </SettingsKindContext.Provider>
  );
}

export function useSettingsKindCopy() {
  return useContext(SettingsKindContext);
}
