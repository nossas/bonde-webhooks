import styled from 'styled-components';
import { Link as LinkStyled } from 'bonde-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  > div {
    flex-grow: 1;
    margin-right: 10px;
  }
  > div:nth-child(2) {
    margin-right: 0; 
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column-reverse;

    ${LinkStyled}, button {
      width: 100%;
      text-align: center;
    }

    ${LinkStyled} {
      padding: 10px 0;
    }
  }
`;

export default Container;