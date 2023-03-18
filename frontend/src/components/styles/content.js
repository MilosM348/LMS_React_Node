import styled from "styled-components";
import { colors } from "../common/element/elements.js";

export const Styles = styled.div`
  .content {
    padding: 80px 0px;
    .description {
      font-size: 33px;
      font-weight: 600;
      padding: 10px 0px;
    }
    .title {
      font-size: 17px;
      font-weight: 600;
      color: ${colors.violet};
      padding: 10px 0px;
    }
    button {
      border: none;
      background-color: ${colors.violet};
      padding: 8px 40px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      text-transform: uppercase;
      margin: 10px 0px;
      &:hover {
        background: ${colors.violet2};
      }
    }
    img {
      width: 100%;
    }
  }
`;