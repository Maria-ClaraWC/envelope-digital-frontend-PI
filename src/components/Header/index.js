import React from 'react';
import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.small};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.h1`
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.primary};
  font-weight: 700;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const UserName = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.black};
`;

const UserIcon = styled(FaUserCircle)`
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
`;

export const Header = () => {
  const { user } = useAuth();

  return (
    <HeaderContainer>
      <Logo>Gestão de Viagens</Logo>
      <UserInfo>
        <UserName>{user?.nome || 'Usuário'}</UserName>
        <UserIcon />
      </UserInfo>
    </HeaderContainer>
  );
};