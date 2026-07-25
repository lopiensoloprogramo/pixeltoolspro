import "./LegalPage.css";

interface LegalPageProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalPage({
  title,
  children,
}: LegalPageProps) {
  return (
    <main className="legal-page">

      <div className="legal-container">

        <h1>{title}</h1>

        <div className="legal-content">
          {children}
        </div>

      </div>

    </main>
  );
}