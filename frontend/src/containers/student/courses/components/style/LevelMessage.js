import styled from "styled-components";
import { colors } from "../../../../../components/common/element/elements.js";

export const Styles = styled.div`
  .message-tab {
    display: flex;
    width: 100%;
    .message-box {
      width: calc(100% - 150px);
      position: relative;
      .message-list {
        min-height: 400px;
        max-height: 400px;
        overflow-y: scroll;
        .message-writer {
          color: gray;
          font-size: 12px;
        }
        .message-desc {
          color: black;
        }
      }
      .message-form {
        margin: 0px 5px;
        position: absolute;
        bottom: 0px;
        width: calc(100% - 10px);
        input {
          width: 100%;
          border: solid 1px ${colors.violet2};
          border-radius: 3px;
          padding: 5px;
        }
        .attach-file {
          position: absolute;
          padding-top: 0px !important;
          top: 0px;
          right: -5px;
        }
      }
    }
    .user-list {
      width: 150px;
      border: solid 1px ${colors.violet2};
      border-radius: 5px;
      .user-item {
        cursor: pointer;
        font-size: 17px;
        color: black;
        padding: 10px 0px 5px 15px;
        overflow-x: hidden;
        &:hover {
          background-color: ${colors.violet2};
          color: white;
        }
      }
      .active {
        background-color: ${colors.violet};
        color: white;
      }
    }
  }
`;
