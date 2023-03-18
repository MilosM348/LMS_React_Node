import styled from "styled-components";
// import { colors } from "../../../../components/common/element/elements.js";

export const Styles = styled.div`
  .message-tab {
    display: flex;
    width: 100%;
    .message-box {
      width: calc(100% - 300px);
      position: relative;
      .message-body {
        padding-bottom: 20px;
        .message-header {
          padding: 20px 10px;
          color: gray;
        }
        .message-list {
          padding: 10px;
          min-height: 600px;
          max-height: 600px;
          overflow-y: scroll;
          .message-item {
            border-bottom: solid #d7d7d7 1px;
            width: 100%;
            padding: 10px 0px;
            .message-writer {
              color: gray;
              font-size: 12px;
            }
            .message-desc {
              color: black;
            }
          }
        }
      }
      .message-form {
        margin: 0px 5px;
        position: absolute;
        bottom: 0px;
        width: calc(100% - 10px);
        input {
          width: 100%;
          border: solid 1px gray;
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
      border: solid 1px gray;
      border-radius: 5px;
      .user-item {
        cursor: pointer;
        font-size: 17px;
        color: black;
        padding: 10px 0px 5px 15px;
        overflow-x: hidden;
        &:hover {
          background-color: #b3b3b3;
          color: white;
        }
      }
      .active {
        background-color: gray;
        color: white;
      }
    }
    .assignment-list {
      width: 150px;
      border: solid 1px gray;
      border-radius: 5px;
      .assignment-item {
        cursor: pointer;
        font-size: 17px;
        color: black;
        padding: 10px 0px 5px 15px;
        overflow-x: hidden;
        &:hover {
          background-color: #b3b3b3;
          color: white;
        }
      }
      .active {
        background-color: gray;
        color: white;
      }
    }
  }
`;
