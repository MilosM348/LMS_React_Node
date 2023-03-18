import styled from "styled-components";
import { colors } from "../common/element/elements";

export const Styles = styled.div`
  .features {
    padding: 30px 0px;
    .description {
    }
    .title {
      color: ${colors.violet};
      text-align: center;
      font-size: 28px;
      text-transform: uppercase;
      font-weight: bold;
    }
    .feature-item {
      padding: 30px 0px;
      .sub-title {
        color: ${colors.violet};
        font-size: 28px;
        font-weight: bold;
      }
    }
  }
`;