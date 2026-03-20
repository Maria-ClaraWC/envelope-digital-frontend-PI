import React from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.small};
  transition: all 0.3s ease;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};

  &:hover {
    box-shadow: ${props => props.clickable ? props.theme.shadows.medium : props.theme.shadows.small};
    transform: ${props => props.clickable ? 'translateY(-2px)' : 'none'};
  }
`;

export const Card = ({ children, onClick, ...props }) => {
  return (
    <StyledCard onClick={onClick} clickable={!!onClick} {...props}>
      {children}
    </StyledCard>
  );
};