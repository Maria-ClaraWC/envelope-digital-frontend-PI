// components/Button/index.js
import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: ${props => props.outline ? 'transparent' : props.theme.colors.primary};
  color: ${props => props.outline ? props.theme.colors.primary : props.theme.colors.white};
  padding: ${props => {
    if (props.small) return '0.5rem 1rem';
    if (props.large) return '0.875rem 2rem';
    return '0.75rem 1.5rem';
  }};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => {
    if (props.small) return props.theme.fontSizes.small;
    if (props.large) return props.theme.fontSizes.large;
    return props.theme.fontSizes.medium;
  }};
  font-weight: 600;
  transition: all 0.3s ease;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  border: ${props => props.outline ? `2px solid ${props.theme.colors.primary}` : 'none'};

  &:hover {
    background-color: ${props => props.outline ? props.theme.colors.primary : props.theme.colors.primaryDark};
    color: ${props => props.outline ? props.theme.colors.white : props.theme.colors.white};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.small};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Button = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};