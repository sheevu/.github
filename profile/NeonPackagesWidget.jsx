import React, { useMemo, useState } from "react";
import "./assets/neon-packages-widget.css";

const plans = [
  {
    id: "launch",
    name: "Launch",
    price: "₹1,999",
    frequency: "/month",
    tagline: "Establish your presence with essential creatives.",
    description:
      "Perfect for early-stage teams that need a punchy brand introduction across channels.",
    features: [
      "8 bespoke social posts",
      "2 animated story loops",
      "1 campaign landing screen",
      "Weekly performance pulse"
    ]
  },
  {
    id: "scale",
    name: "Scale",
    price: "₹3,999",
    frequency: "/month",
    tagline: "Amplify campaigns with accelerated production.",
    description:
      "Grow momentum through iterative storytelling, agile optimisation, and brighter touchpoints.",
    features: [
      "16 omnichannel assets",
      "4 product spotlights",
      "Audience targeting workshop",
      "Realtime collaboration pod"
    ]
  },
  {
    id: "dominate",
    name: "Dominate",
    price: "₹7,999",
    frequency: "/month",
    tagline: "Command attention with a dedicated creative squad.",
    description:
      "Designed for bold brands that want neon-grade takeovers, rapid experiments, and deep data loops.",
    features: [
      "Unlimited iteration sprint",
      "Always-on motion lab",
      "Dedicated strategist & PM",
      "Advanced insights dashboard"
    ]
  }
];

const NeonPackagesWidget = () => {
  const [activePlan, setActivePlan] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    company: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const heroCopy = useMemo(
    () => ({
      title: "Choose your neon-powered launchpad",
      subtitle:
        "Handpick a package and leave your details. Our specialists will craft a personalised activation roadmap within one business day."
    }),
    []
  );

  const handleSelectPlan = (planName) => {
    setActivePlan(planName);
    setIsSubmitted(false);
    setFormErrors((previous) => {
      if (!previous.plan) {
        return previous;
      }

      const { plan, ...rest } = previous;
      return rest;
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formValues.name.trim()) {
      errors.name = "Please share your name.";
    }

    if (!formValues.email.trim()) {
      errors.email = "We need an email to follow up.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      errors.email = "That email doesn't look right.";
    }

    if (!formValues.company.trim()) {
      errors.company = "Tell us which company you represent.";
    }

    return errors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormTouched(true);
    const errors = validateForm();

    if (!activePlan) {
      errors.plan = "Select a package to continue.";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitted(true);
    } else {
      setIsSubmitted(false);
    }
  };

  return (
    <section className="neon-widget" aria-labelledby="neon-packages-title">
      <div className="neon-gradient" aria-hidden="true" />
      <div className="neon-container">
        <header className="neon-header">
          <h1 id="neon-packages-title">{heroCopy.title}</h1>
          <p className="neon-subtitle">{heroCopy.subtitle}</p>
        </header>

        <div className="neon-grid" role="list">
          {plans.map((plan) => {
            const isActive = activePlan === plan.name;

            return (
              <article
                key={plan.id}
                className={`neon-card${isActive ? " is-active" : ""}`}
                role="listitem"
              >
                <div className="neon-card-inner">
                  <div className="neon-card-header">
                    <div className="neon-card-title">
                      <h2>{plan.name}</h2>
                      <span className="neon-tagline">{plan.tagline}</span>
                    </div>
                    <div className="neon-price">
                      <span className="neon-price-amount">{plan.price}</span>
                      <span className="neon-price-frequency">{plan.frequency}</span>
                    </div>
                  </div>
                  <p className="neon-description">{plan.description}</p>
                  <ul className="neon-feature-list">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="neon-select"
                    onClick={() => handleSelectPlan(plan.name)}
                  >
                    {isActive ? "Selected" : `Choose ${plan.name}`}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <section
          className="neon-form-panel"
          aria-live="polite"
          aria-label="Lead capture form"
        >
          <h2 className="form-title">Let's connect</h2>
          <p className="form-caption">
            {activePlan
              ? `You've picked the ${activePlan} package. Drop your details and we'll reach out with next steps.`
              : "Select a package above to unlock the enquiry form."}
          </p>

          <form className="neon-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="plan" className="form-label">
                Selected package
              </label>
              <input
                id="plan"
                name="plan"
                value={activePlan}
                readOnly
                placeholder="Select a package"
                className={`form-input${formTouched && formErrors.plan ? " has-error" : ""}`}
              />
              {formTouched && formErrors.plan && (
                <p className="error-text">{formErrors.plan}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formValues.name}
                onChange={handleInputChange}
                className={`form-input${
                  formTouched && formErrors.name ? " has-error" : ""
                }`}
                placeholder="Your full name"
              />
              {formTouched && formErrors.name && (
                <p className="error-text">{formErrors.name}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formValues.email}
                onChange={handleInputChange}
                className={`form-input${
                  formTouched && formErrors.email ? " has-error" : ""
                }`}
                placeholder="you@company.com"
              />
              {formTouched && formErrors.email && (
                <p className="error-text">{formErrors.email}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="company" className="form-label">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                value={formValues.company}
                onChange={handleInputChange}
                className={`form-input${
                  formTouched && formErrors.company ? " has-error" : ""
                }`}
                placeholder="Organisation name"
              />
              {formTouched && formErrors.company && (
                <p className="error-text">{formErrors.company}</p>
              )}
            </div>

            <button type="submit" className="form-submit" disabled={!activePlan}>
              Share my details
            </button>

            {isSubmitted && (
              <p className="success-text" role="status">
                Thank you! A Sudarshan AI Labs consultant will connect with you shortly.
              </p>
            )}
          </form>
        </section>
      </div>
    </section>
  );
};

export default NeonPackagesWidget;
