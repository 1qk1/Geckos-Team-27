import React from "react";
import PropTypes from "prop-types";

const ButtonIconText = ({ container, btnClass, onClick, icon, text }) => (
  <div className={container}>
    <button className={btnClass} onClick={onClick}>
      <span>
        <div>
          <div>
            <i className={icon} />
          </div>
          <div>
            <span>{text}</span>
          </div>
        </div>
      </span>
    </button>
  </div>
);

ButtonIconText.propTypes = {
  container: PropTypes.string,
  btnClass: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default ButtonIconText;
