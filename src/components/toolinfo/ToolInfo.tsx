import "./ToolInfo.css";

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  description: React.ReactNode;
  howToUse: string[];
  benefits: string[];
  faqs: FAQ[];
}

export default function ToolInfo({
  description,
  howToUse,
  benefits,
  faqs,
}: Props) {
  return (
    <section className="tool-info">

      <div className="tool-info-section">
        <h2>¿Qué es esta herramienta?</h2>

        <div className="tool-info-text">
          {description}
        </div>
      </div>


      <div className="tool-info-section">
        <h2>¿Cómo utilizarla?</h2>

        <ol className="tool-info-steps">
          {howToUse.map((step, index) => (
            <li key={index}>
              {step}
            </li>
          ))}
        </ol>
      </div>


      <div className="tool-info-section">
        <h2>¿Por qué utilizar PixelTools Pro?</h2>

        <ul className="tool-info-benefits">
          {benefits.map((benefit, index) => (
            <li key={index}>
              {benefit}
            </li>
          ))}
        </ul>
      </div>


      <div className="tool-info-section">
        <h2>Preguntas frecuentes</h2>

        <div className="tool-info-faqs">
          {faqs.map((faq, index) => (
            <div
              className="tool-info-faq"
              key={index}
            >
              <h3>
                {faq.question}
              </h3>

              <p>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}