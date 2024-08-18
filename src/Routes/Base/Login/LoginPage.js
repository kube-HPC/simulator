import React from 'react';
import styled from 'styled-components';
import FormLogin from './FormLogin';
import bgImage from '../../../images/bgLogin.png';

const BackgroundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${bgImage});
  background-size: contain;
  background-position: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    filter: blur(3px);
    z-index: 1;
  }
`;

const LoginBox = styled.div`
  width: 20%;
  padding: 20px;
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  z-index: 2;
  position: relative;
  display: flex;
  margin-top: -240px;
`;
/*
const TitleLogoBox = styled.div`
  z-index: 3;
  position: relative;
  display: flex;
  align-items: flex-start;
  width: 22%;
  justify-content: space-evenly;
  height: 58px;
`;
*/
const LoginPage = () => (
  <BackgroundWrapper>
    {/*   <TitleLogoBox>
      <Fish style={{ width: '57px' }} />
      <Title style={{ width: '250px', height: 'auto' }} />
    </TitleLogoBox> */}
    <LoginBox>
      <FormLogin />
    </LoginBox>
  </BackgroundWrapper>
);

export default LoginPage;
