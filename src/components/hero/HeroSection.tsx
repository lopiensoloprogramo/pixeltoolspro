import "./HeroSection.css";

interface HeroSectionProps {
  badge: string;
  title: string;
  description: string;
}

export default function HeroSection({
  badge,
  title,
  description
}: HeroSectionProps) {

  return (
    <section className="hero">

        <span className="hero-badge">
        {badge}
        </span>


      <h1>
        {title}
      </h1>


      <p>
        {description}
      </p>


    </section>
  );
}