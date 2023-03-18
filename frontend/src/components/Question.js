import React, { useEffect, useState } from 'react';
import Datas from '../data/faq-event/faq-event.json';
import {useAsync} from '../service/utils'
import {getAll} from '../api/settingQuestion'

function Question() {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const [datas, setDatas] = useState([])

    useEffect(() => {
        const accordionButton = document.querySelectorAll(".accordion-button");
        accordionButton.forEach(button => {
            button.addEventListener("click", () => {
                button.classList.toggle("active");
                const content = button.nextElementSibling;

                if (button.classList.contains("active")) {
                    content.className = "accordion-content show";
                    content.style.maxHeight = content.scrollHeight + "px";
                } else {
                    content.className = "accordion-content";
                    content.style.maxHeight = "0";
                }
            });
        });
    });
    useEffect(() => {
        run(getAll())
    }, [run])
    useEffect(() => {
        if (status === 'resolved') {
            if (data.length !== 0) {
                setDatas(data)
            }
        }
        else if (status === 'rejected') {
            console.log(error)
        }
    }, [status])

    return (
        <div className="faq-box">
            {
                datas.map((faqData, i) => (
                    <div className="faq-item" key={i}>
                        <button className="accordion-button active">
                            <div className="accordion-icon"><i className="las la-plus"></i></div>
                            <p>{faqData.question}</p>
                        </button>
                        <div className="accordion-content show">
                            <p>{faqData.answer}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
export default Question
