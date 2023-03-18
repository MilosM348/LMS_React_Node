import React, {useEffect, useState} from 'react'
import { Container, Row, Col } from "react-bootstrap";
import { Styles } from "./styles/features";
import { getAll } from '../api/settingFeature';
import { useAsync } from '../service/utils';

const Features = () => {
  const { data, status, error, run } = useAsync({
    status: "idle",
  });
  const [features, setFeatures] = useState([])

  useEffect(() => {
    run(getAll())
  }, [run])
  useEffect(() => {
    if (status === 'resolved') {
      setFeatures(data)
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status])
  return (
    <Styles>
      {features.length !== 0 &&
        <section className="features">
          <div className="title">Features</div>
          <Container>
            <Row>
              {features.map((item, index) => (
                <Col md="4" sm="6" xs="12" key={index}>
                  <div className="feature-item">
                    <div className="sub-title">{item.title}</div>
                    <div className="description">
                      {item.description}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      }
    </Styles>
  );
}
export default Features;
