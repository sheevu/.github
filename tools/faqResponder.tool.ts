interface FAQItem {
  question: string;
  answer: string;
  keywords?: string[];
}

const FAQ_LIST: FAQItem[] = [
  {
    question: 'What does Sudarshan AI Labs do?',
    answer:
      'Sudarshan AI Labs builds conversational AI, automation, and analytics solutions that help Indian businesses, governments, and youth adopt digital tools faster.',
    keywords: ['services', 'offerings', 'solutions'],
  },
  {
    question: 'Which industries do you specialise in?',
    answer:
      'We empower MSMEs, D2C brands, education providers, government programs, and startups with tailored AI assistants, marketing automation, and data intelligence.',
    keywords: ['verticals', 'sectors', 'MSME'],
  },
  {
    question: 'How can I start a project with Sudarshan AI Labs?',
    answer:
      'Pick a package or request a discovery call with your goals, and our team will scope the right AI roadmap, timelines, and success metrics for you.',
    keywords: ['engage', 'contact', 'work with you'],
  },
  {
    question: 'Do you offer custom AI development?',
    answer:
      'Yes—we design bespoke assistants, integrations, and workflows tuned to your brand tone, compliance needs, and existing systems.',
    keywords: ['custom', 'tailored', 'bespoke'],
  },
  {
    question: 'Can you integrate with our CRM or Google Sheets?',
    answer:
      'Absolutely, we connect AI experiences with CRMs, Google Workspace, and analytics stacks using secure APIs or Model Context Protocol connectors.',
    keywords: ['integrations', 'google sheets', 'CRM'],
  },
  {
    question: 'What languages can your AI assistant support?',
    answer:
      'We specialise in English and Hindi conversations today, and we can extend to other Indian languages based on project requirements.',
    keywords: ['language', 'hindi', 'english'],
  },
  {
    question: 'How do you ensure data privacy and security?',
    answer:
      'We follow strict access controls, anonymise training data, and align with India’s data protection norms while storing leads securely in approved systems.',
    keywords: ['security', 'privacy', 'data protection'],
  },
  {
    question: 'What is the typical implementation timeline?',
    answer:
      'Rapid pilots go live in 2–3 weeks, while enterprise-grade rollouts with custom workflows usually take 6–8 weeks depending on integrations.',
    keywords: ['timeline', 'duration', 'how long'],
  },
  {
    question: 'Do you provide training and support after launch?',
    answer:
      'Yes, every engagement includes enablement workshops, documentation, and on-demand support so your teams stay confident with the AI tools.',
    keywords: ['support', 'training', 'after launch'],
  },
  {
    question: 'How can I see pricing and packages?',
    answer:
      'You can explore standard packs via the showPackages tool or request a custom quote for enterprise needs and bundled services.',
    keywords: ['pricing', 'packages', 'cost'],
  },
];

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

function matches(faq: FAQItem, query: string): boolean {
  const normalisedQuery = normalise(query);
  if (normalise(faq.question).includes(normalisedQuery) || normalisedQuery.includes(normalise(faq.question))) {
    return true;
  }

  return (faq.keywords ?? []).some((keyword) => {
    const normalisedKeyword = normalise(keyword);
    return normalisedKeyword.includes(normalisedQuery) || normalisedQuery.includes(normalisedKeyword);
  });
}

export function faqResponder(question?: string): string {
  if (!question) {
    return [
      '## Top Sudarshan AI Labs FAQs',
      '',
      ...FAQ_LIST.map((faq, index) => `${index + 1}. **${faq.question}**\n   ${faq.answer}`),
      '',
      '_Need something else? I can consult our Sudarshan AI Labs knowledge base via the MCP tools._',
    ].join('\n');
  }

  const match = FAQ_LIST.find((faq) => matches(faq, question));

  if (match) {
    return [
      `### ${match.question}`,
      '',
      match.answer,
      '',
      '_Have another question? I can keep helping or fetch more details from our business documents._',
    ].join('\n');
  }

  return [
    "I don't have that answer in the curated FAQ list.",
    'Let me pull the latest details from our uploaded Sudarshan AI Labs documents using the knowledge-base tools.',
  ].join('\n');
}

export default faqResponder;
