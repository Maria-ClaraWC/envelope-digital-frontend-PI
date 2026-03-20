import React from 'react';
import styled from 'styled-components';
import { FaUserCircle, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

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
  cursor: pointer;
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

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSizes.medium};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const showBackButton = location.pathname !== '/home' && location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register';
  
  return (
    <HeaderContainer>
      <LeftSection>
        {showBackButton && (
          <BackButton onClick={() => navigate(-1)}>
            <FaArrowLeft /> Voltar
          </BackButton>
        )}
        <Logo onClick={() => navigate('/home')}>Envelope Digital</Logo>
      </LeftSection>
      {user && (
        <UserInfo>
          <UserName>{user?.nome || 'Usuário'}</UserName>
          <UserIcon />
        </UserInfo>
      )}
    </HeaderContainer>
  );
};