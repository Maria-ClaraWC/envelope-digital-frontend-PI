import React, { forwardRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.theme.spacing.md};
  width: 100%;
`;

const Label = styled.label`
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.darkGray};
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 500;
`;

const StyledInput = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.gray};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.fontSizes.medium};
  transition: all 0.3s ease;
  background-color: ${props => props.theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.darkGray}80;
  }

  &:disabled {
    background-color: ${props => props.theme.colors.gray};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.small};
  margin-top: ${props => props.theme.spacing.xs};
`;

export const Input = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <StyledInput ref={ref} error={error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
});