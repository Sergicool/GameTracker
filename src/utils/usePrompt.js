// hooks/usePrompt.js
import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

export function usePrompt(message, when) {
  const navigator = useContext(NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;

    navigator.push = (...args) => {
      const confirm = window.confirm(message);
      if (confirm) {
        navigator.push = push; // restaurar
        navigator.push(...args);
      }
    };

    return () => {
      navigator.push = push; // restaurar
    };
  }, [navigator, message, when]);
}
