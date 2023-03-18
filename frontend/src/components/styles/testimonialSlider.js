import styled from "styled-components";
import { colors } from "../common/element/elements.js";

export const Styles = styled.div`
    .testimonial-area {
        background-size    : cover;
        background-position: center;
        background-repeat  : no-repeat;
        padding            : 63px 0;
        position           : relative;

        &:before {
            position  : absolute;
            content   : '';
            opacity   : 0.98;
            width     : 100%;
            height    : 100%;
            top       : 0;
            left      : 0;
        }

        .sec-title {
            h4 {
                color: ${colors.violet};
                text-align: center;
                font-size: 28px;
                text-transform: uppercase;
                font-weight: bold;
                line-height  : 35px;
                max-width    : 550px;
                margin       : auto;
                margin-bottom: 43px;

                @media(max-width: 575px) {
                    margin-bottom: 15px;
                    font-size: 20px;
                }
            }
        }

        .testimonial-slider {
            .slider-item {
                .desc {
                    background-color: rgb(118 7 219 / 8%);
                    padding         : 30px 38px;
                    border-radius : 5px;
                    position: relative;

                    &::before {
                        content         : "";
                        position        : absolute;
                        border-width    : 15px 15px;
                        border-style    : solid;
                        border-top-color: rgb(118 7 219 / 8%);
                        ;
                        border-right-color : transparent;
                        border-bottom-color: transparent;
                        border-left-color  : transparent;
                        top                : 100%;
                        left               : 47px;
                        z-index            : 1;
                    }

                    h5 {
                        font-size    : 18px;
                        color        : black;
                        margin-bottom: 15px;
                    }

                    p {
                        font-size  : 13px;
                        color      : black;
                        line-height: 25px;
                    }
                }

                .writer {
                    margin-top : 35px;
                    margin-left: 30px;

                    img {
                        max-width: 65px;
                        border-radius : 50%;
                        float       : left;
                        margin-right: 15px;
                    }

                    h6 {
                        color        : black;
                        padding-top  : 10px;
                        margin-bottom: 3px;
                    }

                    p {
                        color: black;
                    }
                }
            }

            .slider-dot {
                margin-top: 48px !important;

                .swiper-pagination-bullet {
                    width     : 22px;
                    height    : 9px;
                    background: ${colors.violet2};
                    display   : inline-block;
                    margin    : 3px;
                    opacity   : 1 !important;
                    border-radius : 5px;
                }

                .swiper-pagination-bullet.swiper-pagination-bullet-active {
                    background: ${colors.violet};
                }
            }
        }

        @media(max-width: 767px) {
            padding: 30px 0;
        }
    }
`;