// components/Header/index.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUserCircle, FaArrowLeft, FaTruck, FaSignOutAlt } from 'react-icons/fa';
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

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  
  svg {
    font-size: 1.75rem;
    color: ${props => props.theme.colors.primary};
  }
  
  h1 {
    font-size: ${props => props.theme.fontSizes.large};
    font-weight: 700;
    color: ${props => props.theme.colors.primary};
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
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

const LogoutMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.xs};
  min-width: 200px;
  z-index: 1000;
`;

const LogoutButton = styled.button`
  background-color: ${props => props.theme.colors.error};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  width: 100%;
  justify-content: center;
  
  &:hover {
    background-color: #c62828;
  }
  
  svg {
    font-size: 1rem;
  }
`;

const UserInfoContainer = styled.div`
  position: relative;
`;

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  
  const showBackButton = location.pathname !== '/home' && 
                         location.pathname !== '/' && 
                         location.pathname !== '/login' && 
                         location.pathname !== '/register';
  
  const handleUserClick = () => {
    setShowLogoutMenu(!showLogoutMenu);
  };
  
  const handleLogout = () => {
    logout();
    window.location.href = 'http://localhost:3000/';
  };
  
  // Fechar menu quando clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-info-container')) {
        setShowLogoutMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <HeaderContainer>
      <LeftSection>
        {showBackButton && (
          <BackButton onClick={() => navigate(-1)}>
            <FaArrowLeft /> Voltar
          </BackButton>
        )}
        <Logo onClick={() => navigate('/home')}>
          <FaTruck />
          <h1>Envelope Digital</h1>
        </Logo>
      </LeftSection>
      {user && (
        <UserInfoContainer className="user-info-container">
          <UserInfo onClick={handleUserClick}>
            <UserName>{user?.nome || 'Usuário'}</UserName>
            <UserIcon />
          </UserInfo>
          {showLogoutMenu && (
            <LogoutMenu>
              <LogoutButton onClick={handleLogout}>
                <FaSignOutAlt />
                Sair da conta
              </LogoutButton>
            </LogoutMenu>
          )}
        </UserInfoContainer>
      )}
    </HeaderContainer>
  );
};