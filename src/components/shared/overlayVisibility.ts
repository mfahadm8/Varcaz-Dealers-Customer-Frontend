import {createContext,useContext} from 'react';
/** Visibility only: inherited through portals; operational authority remains with readers. */
export const OverlayVisibilityContext=createContext(true);
export function useOverlayVisibility(){return useContext(OverlayVisibilityContext);}
