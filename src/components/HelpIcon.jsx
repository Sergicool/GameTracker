// HelpIcon.jsx
import { FaQuestionCircle } from 'react-icons/fa';
import './HelpIcon.css';

function HelpIcon({ onClick }) {
  return (
    <span className="help-icon" onClick={onClick} role="button" tabIndex={0}>
      <FaQuestionCircle />
    </span>
  );
}

export default HelpIcon;
