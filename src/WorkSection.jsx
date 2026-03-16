import { useState } from "react";
import mercuryLogo from './assets/mercury-logo-icon.svg'
import revLogo from './assets/rev.com-31.svg'
import mercuryAutomation from './assets/accounting-automations.png'
import mercuryAutomationGif from './assets/accounting-automations-hover.gif'
import mercuryFoundations from './assets/accounting-foundations.png'
import mercuryFoundationsGif from './assets/accounting-foundations.gif'
import revApiPlayground from './assets/rev-ai-playground.png'
import revApiPlaygroundGif from './assets/rev-ai-playground.gif'
import revDesignSystem from './assets/rev-design-system.png'
import revDesignSystemGif from './assets/rev-design-system.gif'

const companies = [
  {
    name: "mercury",
    logo: mercuryLogo,
    role: "product designer",
    dates: "jun 2022 – present",
    description:
      "Mercury is a startup that revolutionizes business banking* by taking a tedious process and making it easy and accessible to founders. I design tools that give founders clarity and accuracy in their books, catching problems at the source so they stop wrestling with accounting altogether.",
    contactNote: "For in-depth details of my work, please contact me.",
    projects: [
      {
        title: "accounting automation",
        description:
          "I led three successive design initiatives across the platform: bulk actions, automation, and insights, each growing in complexity and scope. Bulk actions drove +41% usage and +67% in adoption.",
        staticSrc: mercuryAutomation,
        hoverSrc: mercuryAutomationGif,
        alt: "Accounting automation",
      },
      {
        title: "accounting foundations",
        description:
          "Third-party ERP integrations introduced errors outside Mercury's control. I designed error states and re-authentication flows that gave users clarity when things broke. This reduced errors for our users by 80%.",
        staticSrc: mercuryFoundations,
        hoverSrc: mercuryFoundationsGif,
        alt: "Accounting foundations",
      },
    ],
  },
  {
    name: "rev",
    logo: revLogo,
    role: "product designer",
    dates: "jun 2021 – jun 2022",
    description:
      "Rev provides transcription, captions, and subtitles powered by 100,000s of hours of transcribed audio. I updated the design system to align with the new brand and built out the API playground for developers to explore Rev's AI/ML speech-to-text model directly.",
    contactNote: "For in-depth details of my work, please contact me.",
    projects: [
      {
        title: "API playground",
        description:
          "Rev had a rare advantage in training data that made their speech-to-text model worth exploring. I designed two entry points: a no-code path for quick experimentation and a code path for developers who wanted direct API access.",
        staticSrc: revApiPlayground,
        hoverSrc: revApiPlaygroundGif,
        alt: "API playground",
      },
      {
        title: "brand & design system",
        description:
          "In 2021, Rev overhauled its logo, colors, and brand messaging. I audited and updated every component in the design system to match the new visual language and tone.",
        staticSrc: revDesignSystem,
        hoverSrc: revDesignSystemGif,
        alt: "Brand & design system",
      },
    ],
  },
];

function ImagePreview({ project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        borderRadius: 8,
        overflow: "hidden",
        aspectRatio: "16/10",
        position: "relative",
        background: "#f5f5f5",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={project.staticSrc}
        alt={project.alt}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          imageRendering: "-webkit-optimize-contrast",
          opacity: hovered ? 0 : 1,
          transition: "opacity 0.2s ease",
        }}
      />
      <img
        src={project.hoverSrc}
        alt={project.alt}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          imageRendering: "-webkit-optimize-contrast",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s ease",
          willChange: "opacity",
        }}
      />
    </div>
  );
}

function CompanyBlock({ company }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="company-block">
      <div className="company-header-row">
        <span className="company-name-row">
          <img src={company.logo} alt={company.name} className="company-logo" />
          <span className="company-name">{company.name}</span>
          <span className="company-role"> {company.role}</span>
        </span>
        <span className="company-date">{company.dates}</span>
      </div>

      <div className="company-intro">
        <p className="intro-text">{company.description}</p>
        <p className="contact-note">{company.contactNote}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          border: "0.5px solid #e6e3de",
          borderRadius: 12,
          overflow: "hidden",
          background: "#fff",
          minHeight: 280,
        }}
      >
        {/* Preview panel */}
        <div
          style={{
            borderRight: "0.5px solid #eeebe6",
            background: "#faf9f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div style={{ width: "100%", transition: "opacity 0.26s ease" }}>
            <ImagePreview project={company.projects[activeIndex]} />
          </div>
        </div>

        {/* Project list */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {company.projects.map((project, i) => (
            <div
              key={project.title}
              onClick={() => setActiveIndex(i)}
              style={{
                borderBottom:
                  i < company.projects.length - 1 ? "0.5px solid #f2efe9" : "none",
                cursor: "pointer",
                background: activeIndex === i ? "#fff" : undefined,
                transition: "background 0.12s ease",
              }}
              onMouseEnter={(e) => {
                if (activeIndex !== i)
                  e.currentTarget.style.background = "#faf9f7";
              }}
              onMouseLeave={(e) => {
                if (activeIndex !== i)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 18px",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 2,
                    height: 13,
                    borderRadius: 1,
                    background: activeIndex === i ? "#9a8fc4" : "#e0ddd8",
                    flexShrink: 0,
                    transition: "background 0.2s ease",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: activeIndex === i ? 500 : 400,
                    color: activeIndex === i ? "#1a1a1a" : "#bbb",
                    transition: "color 0.2s ease",
                    flex: 1,
                  }}
                >
                  {project.title}
                </span>
              </div>

              {activeIndex === i && (
                <div style={{ padding: "0 18px 16px 30px" }}>
                  <p
                    style={{
                      fontSize: 11.5,
                      color: "#aaa",
                      lineHeight: 1.7,
                    }}
                  >
                    {project.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WorkSection() {
  return (
    <div className="work-grid">
      <div className="work-section-label">
        <span className="section-label">✦ work</span>
      </div>

      <div className="work-companies">
        {companies.map((company) => (
          <CompanyBlock key={company.name} company={company} />
        ))}
      </div>
    </div>
  );
}
