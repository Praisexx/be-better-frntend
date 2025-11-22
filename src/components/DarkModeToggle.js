import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import '../styles/DarkModeToggle.css';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <Sun className="toggle-icon" size={20} />
      ) : (
        <Moon className="toggle-icon" size={20} />
      )}
    </button>
  );
};

export default DarkModeToggle;
