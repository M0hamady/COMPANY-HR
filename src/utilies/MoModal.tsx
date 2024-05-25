import React from "react";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  primaryButtonName?: string;
  primaryButtonStyle?: string;
  primaryButtonAction?: () => void;
  secondaryButtonName?: string;
  secondaryButtonStyle?: string;
  secondaryButtonAction?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen = false,
  onClose,
  title,
  children,
  primaryButtonName,
  primaryButtonStyle,
  primaryButtonAction,
  secondaryButtonName,
  secondaryButtonStyle,
  secondaryButtonAction,
}) => {
  const handlePrimaryButtonClick = () => {
    if (primaryButtonAction) {
      primaryButtonAction();
    }
  };

  const handleSecondaryButtonClick = () => {
    if (secondaryButtonAction) {
      secondaryButtonAction();
    }
  };

  const modalClass = isOpen ? "modal-wrapper open" : "modal-wrapper";

  return (
    <div className={modalClass}>
      <div className="modal-content">
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button className="modal-close" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          {secondaryButtonName && (
            <button
              className={`modal-button secondary-button ${
                secondaryButtonStyle ? secondaryButtonStyle : "bg-gray-300"
              }`}
              onClick={handleSecondaryButtonClick}
            >
              {secondaryButtonName}
            </button>
          )}
          {primaryButtonName && (
            <button
              className={`modal-button primary-button ${
                primaryButtonStyle ? primaryButtonStyle : "bg-blue-500 text-white"
              }`}
              onClick={handlePrimaryButtonClick}
            >
              {primaryButtonName}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;