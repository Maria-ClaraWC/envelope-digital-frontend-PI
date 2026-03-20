import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

const AlertContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const AlertWrapper = styled.div`
  background-color: ${props => {
    switch (props.type) {
      case 'success': return '#4CAF50';
      case 'error': return '#FF6B6B';
      case 'warning': return '#FFC107';
      case 'info': return '#9A6767';
      default: return '#9A6767';
    }
  }};
  color: white;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  min-width: 300px;
  max-width: 500px;
`;

const AlertIcon = styled.div`
  font-size: 1.25rem;
`;

const AlertMessage = styled.div`
  flex: 1;
  font-size: ${props => props.theme.fontSizes.medium};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

export const Alert = ({ type, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <FaCheckCircle />;
      case 'error': return <FaTimesCircle />;
      case 'warning': return <FaExclamationCircle />;
      default: return <FaInfoCircle />;
    }
  };

  return (
    <AlertContainer>
      <AlertWrapper type={type}>
        <AlertIcon>{getIcon()}</AlertIcon>
        <AlertMessage>{message}</AlertMessage>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </AlertWrapper>
    </AlertContainer>
  );
};

export const useAlert = () => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (type, message, duration = 5000) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message, duration }]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const AlertComponent = () => (
    <>
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          onClose={() => removeAlert(alert.id)}
          duration={alert.duration}
        />
      ))}
    </>
  );

  return { addAlert, AlertComponent };
};