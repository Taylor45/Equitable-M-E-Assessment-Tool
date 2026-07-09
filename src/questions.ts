import { Question, Dimension } from './types';

export const dimensions: Dimension[] = [
  {
    id: 1,
    name: "Planning & Design",
    subtitle: "Foundational Equity",
    purpose: "This section assesses the philosophical basis and conceptual design of the M&E system.",
    questionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    feedback: {
      L1: "Your current approach largely reflects conventional M&E practices. While functional, it may reinforce existing power structures and miss opportunities to centre equity.",
      L2: "Your approach shows movement toward equity. There are intentional efforts to include participation and equity considerations, but deeper integration is needed.",
      L3: "Your approach reflects a transformative, equity-centred M&E system. It actively challenges systemic inequities and centres community knowledge and participation.",
      tie: "Your Planning & Design profile is mixed, with some elements of conventional practice alongside growing equity considerations. Clarifying your core philosophical alignment could help unify your approach."
    }
  },
  {
    id: 2,
    name: "Implementation",
    subtitle: "Power and Participation",
    purpose: "This section assesses who is involved and how decisions are made.",
    questionIds: [10, 11, 12, 13, 14, 15],
    feedback: {
      L1: "Your current approach largely reflects conventional M&E practices. While functional, it may reinforce existing power structures and miss opportunities to centre equity.",
      L2: "Your approach shows movement toward equity. There are intentional efforts to include participation and equity considerations, but deeper integration is needed.",
      L3: "Your approach reflects a transformative, equity-centred M&E system. It actively challenges systemic inequities and centres community knowledge and participation.",
      tie: "Your M&E implementation shows a balanced or shifting model of participation. While some stages consult community members, other key decisions or resource structures remain donor-led."
    }
  },
  {
    id: 3,
    name: "Data Analysis & Interpretation",
    subtitle: "Cultural Competence",
    purpose: "Focuses on how data is translated into meaning and respected",
    questionIds: [16, 17, 18, 19, 20, 21, 22, 23],
    feedback: {
      L1: "Your current approach largely reflects conventional M&E practices. While functional, it may reinforce existing power structures and miss opportunities to centre equity.",
      L2: "Your approach shows movement toward equity. There are intentional efforts to include participation and equity considerations, but deeper integration is needed.",
      L3: "Your approach reflects a transformative, equity-centred M&E system. It actively challenges systemic inequities and centres community knowledge and participation.",
      tie: "You have mixed practices in data analysis. While you recognize the importance of local context, systematic protocols for shared interpretation, validation, and data ownership are not yet fully established."
    }
  },
  {
    id: 4,
    name: "Use of Findings & Accountability",
    subtitle: "Systemic Change",
    purpose: "Focuses on the commitment to systemic change",
    questionIds: [24, 25, 26, 27, 28, 29, 30],
    feedback: {
      L1: "Your current approach largely reflects conventional M&E practices. While functional, it may reinforce existing power structures and miss opportunities to centre equity.",
      L2: "Your approach shows movement toward equity. There are intentional efforts to include participation and equity considerations, but deeper integration is needed.",
      L3: "Your approach reflects a transformative, equity-centred M&E system. It actively challenges systemic inequities and centres community knowledge and participation.",
      tie: "Your use of findings reflects a transitional stage of accountability. You demonstrate transparency in sharing findings but face limitations in translating those insights into broader systemic action or policy reform."
    }
  }
];

export const questions: Question[] = [
  // --- DIMENSION 1: PLANNING & DESIGN ---
  {
    id: 1,
    dimensionId: 1,
    section: "Philosophical Alignment",
    text: "Which best describes the philosophical alignment of your M&E framework?",
    options: [
      {
        text: "Not explicitly equity-focused",
        level: "L1",
        description: "Uses standard evaluation models without explicitly challenging power dynamics.",
        feedback: "The M&E framework is based on standard, dominant Western models and does not explicitly cite or challenge power structures."
      },
      {
        text: "Partially equity-integrated",
        level: "L2",
        description: "Includes some equity principles (e.g., Cultural Competence, critical inquiry) but they are not fully embedded as a core foundation.",
        feedback: "The M&E framework has begun to adopt principles like Cultural Competence and critical inquiry but lacks a foundational shift."
      },
      {
        text: "Explicitly equity- and justice-centred",
        level: "L3",
        description: "Grounded in decolonial, intersectional, or Afrocentric approaches with a core mission to address systemic inequalities.",
        feedback: "The M&E framework is explicitly rooted in African epistemologies and Afrocentricity, uses a decolonised logic model, and aims to address systemic inequities in development outcomes."
      }
    ]
  },
  {
    id: 2,
    dimensionId: 1,
    section: "Philosophical Alignment",
    text: "To what extent is your M&E framework grounded in local or indigenous knowledge systems (e.g., African epistemologies)?",
    options: [
      {
        text: "Not at all",
        level: "L1",
        description: "Relies entirely on standard, dominant Western conceptual models.",
        feedback: "The M&E framework is based on standard, dominant Western models and does not explicitly cite or challenge power structures."
      },
      {
        text: "Limited",
        level: "L2",
        description: "Acknowledges local context as an add-on, but does not allow local knowledge to reframe the core evaluation design.",
        feedback: "The M&E framework has begun to adopt principles like Cultural Competence and critical inquiry but lacks a foundational shift."
      },
      {
        text: "Fully integrated",
        level: "L3",
        description: "Explicitly co-designed with and rooted in indigenous knowledge systems and decolonial methodologies.",
        feedback: "The M&E framework is explicitly rooted in African epistemologies and Afrocentricity, uses a decolonised logic model, and aims to address systemic inequities in development outcomes."
      }
    ]
  },
  {
    id: 3,
    dimensionId: 1,
    section: "Philosophical Alignment",
    text: "Does your M&E framework explicitly challenge dominant (Western) evaluation paradigms?",
    options: [
      {
        text: "No",
        level: "L1",
        description: "Accepts and implements conventional metrics and logframes without question.",
        feedback: "The M&E framework is based on standard, dominant Western models and does not explicitly cite or challenge power structures."
      },
      {
        text: "Partially",
        level: "L2",
        description: "Modifies standard indicators slightly to reflect local context, but leaves the overall logic unchanged.",
        feedback: "The M&E framework has begun to adopt principles like Cultural Competence and critical inquiry but lacks a foundational shift."
      },
      {
        text: "Yes",
        level: "L3",
        description: "Replaces standard paradigms with decolonial logic models or participant-driven theories of change.",
        feedback: "The M&E framework is explicitly rooted in African epistemologies and Afrocentricity, uses a decolonised logic model, and aims to address systemic inequities in development outcomes."
      }
    ]
  },
  {
    id: 4,
    dimensionId: 1,
    section: "Equity Focus",
    text: "To what extent does your M&E framework integrate equity considerations?",
    options: [
      {
        text: "Minimal focus",
        level: "L1",
        description: "Focuses mainly on overall programme results without specific equity measures.",
        feedback: "The M&E framework focuses on general program outcomes without explicit attention to disaggregated data or impact on marginalised groups."
      },
      {
        text: "Moderate focus",
        level: "L2",
        description: "Tracks some equity indicators such as gender or age.",
        feedback: "The M&E framework tracks outcomes based on basic demographic categories (e.g., gender, age) but lacks an intersectional lens."
      },
      {
        text: "Strong focus",
        level: "L3",
        description: "Uses gender and intersectional approaches to address systemic inequities.",
        feedback: "The M&E framework employs a non-negotiable, centred gender and intersectional lens to identify, track, and address systemic and historical inequities."
      }
    ]
  },
  {
    id: 5,
    dimensionId: 1,
    section: "Equity Focus",
    text: "To what extent does your M&E framework incorporate intersectionality (e.g., gender, age, disability, class)?",
    options: [
      {
        text: "Not at all",
        level: "L1",
        description: "Little or no consideration of intersecting identities and inequalities.",
        feedback: "The M&E framework focuses on general programme outcomes without explicit attention to disaggregated data or marginalised groups. Limited attention to intersectional inequities."
      },
      {
        text: "To a limited extent",
        level: "L2",
        description: "Consider some demographic categories such as gender or age.",
        feedback: "The M&E framework tracks outcomes using basic demographic categories (e.g., gender, age). Basic intersectional elements are included but not fully integrated."
      },
      {
        text: "Fully integrated",
        level: "L3",
        description: "Systematically applies an intersectional lens across the framework.",
        feedback: "Highly Equitable / Transformative: The M&E framework employs a centred gender and intersectional lens to identify and address systemic and intersecting inequities."
      }
    ]
  },
  {
    id: 6,
    dimensionId: 1,
    section: "Equity Focus",
    text: "What demographic or equity-related variables are routinely collected in your M&E system?",
    options: [
      {
        text: "Limited variables",
        level: "L1",
        description: "Only basic programme data is collected, with no demographic breakdown.",
        feedback: "The M&E framework has minimal capacity for equity analysis due to limited data."
      },
      {
        text: "Basic variables",
        level: "L2",
        description: "Data includes basic demographics such as gender and age.",
        feedback: "The M&E framework has some capacity for equity analysis but remains limited in scope."
      },
      {
        text: "Comprehensive variables",
        level: "L3",
        description: "Data includes multiple equity-relevant variables (e.g., gender, age, disability, location, income).",
        feedback: "Highly Equitable / Transformative: The M&E framework enables strong equity analysis through robust and disaggregated data systems."
      }
    ]
  },
  {
    id: 7,
    dimensionId: 1,
    section: "Equity Focus",
    text: "Does your M&E design explicitly challenge existing power structures and inequalities?",
    options: [
      {
        text: "No",
        level: "L1",
        description: "Does not explicitly address power imbalances or structural inequalities.",
        feedback: "The M&E framework focuses on general program outcomes without explicit attention to disaggregated data or impact on marginalised groups."
      },
      {
        text: "Partially",
        level: "L2",
        description: "Recognises some inequalities and includes limited equity-focused approaches.",
        feedback: "The M&E framework tracks outcomes based on basic demographic categories (e.g., gender, age) but lacks an intersectional lens."
      },
      {
        text: "Yes",
        level: "L3",
        description: "Explicitly addresses power relations, exclusion, and systemic inequities.",
        feedback: "Highly Equitable/Transformative: The M&E framework employs a non-negotiable, centred gender and intersectional lens to identify, track, and address systemic and historical inequities."
      }
    ]
  },
  {
    id: 8,
    dimensionId: 1,
    section: "Evaluation Questions",
    text: "To what extent are your evaluation questions framed in a clear and equity-focused way?",
    options: [
      {
        text: "Narrowly framed",
        level: "L1",
        description: "The M&E framework uses evaluation questions focused mainly on efficiency and effectiveness (e.g., “Did the programme work?”).",
        feedback: "Evaluation questions are narrowly focused on program efficiency and effectiveness (e.g., \"Did the program work?\")."
      },
      {
        text: "Somewhat framed",
        level: "L2",
        description: "The M&E framework includes descriptive questions that begin to explore differences across groups.",
        feedback: "Evaluation questions include simple descriptive questions about differential outcomes."
      },
      {
        text: "Clearly equity-focused",
        level: "L3",
        description: "The M&E framework frames evaluation questions through critical inquiry and power analysis (e.g., “Whose needs are prioritised and why?”).",
        feedback: "Evaluation questions are framed through critical inquiry and power awareness (e.g., \"Whose needs are being served, whose are being ignored, and why?\")."
      }
    ]
  },
  {
    id: 9,
    dimensionId: 1,
    section: "Evaluation Questions",
    text: "Which best describes the focus of your evaluation questions?",
    options: [
      {
        text: "Focused on efficiency and outputs",
        level: "L1",
        description: "The M&E framework focuses on efficiency, outputs, and basic programme performance.",
        feedback: "Evaluation questions are narrowly focused on program efficiency and effectiveness (e.g., \"Did the program work?\")."
      },
      {
        text: "Includes some analysis of differences across groups",
        level: "L2",
        description: "The M&E framework considers differences in outcomes across population groups.",
        feedback: "Evaluation questions include simple descriptive questions about differential outcomes for different groups."
      },
      {
        text: "Explicitly examines power, exclusion, and systemic inequities",
        level: "L3",
        description: "The M&E framework examines exclusion, power relations, and systemic inequities.",
        feedback: "Evaluation questions are framed through critical inquiry and power awareness (e.g., \"Whose needs are being served, whose are being ignored, and why?\")."
      }
    ]
  },

  // --- DIMENSION 2: IMPLEMENTATION (POWER & PARTICIPATION) ---
  {
    id: 10,
    dimensionId: 2,
    section: "Stakeholder Participation",
    text: "What is the primary role of stakeholders or communities in your M&E process?",
    options: [
      {
        text: "Passive participants (data sources)",
        level: "L1",
        description: "The M&E framework treats communities mainly as sources of data with limited involvement in decision-making.",
        feedback: "Communities and beneficiaries are primarily treated as passive subjects of data collection or as 'informants.'"
      },
      {
        text: "Consulted stakeholders",
        level: "L2",
        description: "The M&E framework involves communities at selected stages, mainly for feedback and validation.",
        feedback: "Communities are consulted at specific points (e.g., tool testing) and provide feedback on preliminary findings."
      },
      {
        text: "Co-creators",
        level: "L3",
        description: "The M&E framework engages communities as active partners in designing, implementing, and interpreting M&E processes.",
        feedback: "M&E processes are driven by the transformative principle of participation. The community and beneficiaries are recognised as true experts of their own lives and actively co-create M&E questions, tools, and timelines, potentially using Empowerment Evaluation."
      }
    ]
  },
  {
    id: 11,
    dimensionId: 2,
    section: "Stakeholder Participation",
    text: "At which stages are communities involved in the M&E process?",
    options: [
      {
        text: "Not involved",
        level: "L1",
        description: "The M&E framework does not involve communities in any stage of the process.",
        feedback: "Communities and beneficiaries are primarily treated as passive subjects of data collection or as 'informants.'"
      },
      {
        text: "Limited involvement",
        level: "L2",
        description: "The M&E framework involves communities in selected stages such as data collection or reporting.",
        feedback: "Communities are consulted at specific points (e.g., tool testing) and provide feedback on preliminary findings."
      },
      {
        text: "Full involvement",
        level: "L3",
        description: "The M&E framework involves communities across multiple stages, including design, data collection, analysis, and reporting.",
        feedback: "M&E processes are driven by the transformative principle of participation. The community and beneficiaries are recognised as true experts of their own lives and actively co-create M&E questions, tools, and timelines, potentially using Empowerment Evaluation."
      }
    ]
  },
  {
    id: 12,
    dimensionId: 2,
    section: "Stakeholder Participation",
    text: "Are community members compensated for their participation in M&E activities?",
    options: [
      {
        text: "No",
        level: "L1",
        description: "The M&E framework does not provide compensation for community participation.",
        feedback: "Communities and beneficiaries are primarily treated as passive subjects of data collection or as 'informants.'"
      },
      {
        text: "Sometimes",
        level: "L2",
        description: "The M&E framework provides irregular or inconsistent compensation for community participation.",
        feedback: "Communities are consulted at specific points (e.g., tool testing) and provide feedback on preliminary findings."
      },
      {
        text: "Yes, consistently",
        level: "L3",
        description: "The M&E framework ensures regular and fair compensation for community participation in M&E activities.",
        feedback: "M&E processes are driven by the transformative principle of participation. The community and beneficiaries are recognised as true experts of their own lives and actively co-create M&E questions, tools, and timelines, potentially using Empowerment Evaluation."
      }
    ]
  },
  {
    id: 13,
    dimensionId: 2,
    section: "Methodological Choice",
    text: "How are M&E methodologies chosen?",
    options: [
      {
        text: "Ad hoc selection",
        level: "L1",
        description: "The M&E framework selects methods without a clear rationale or consistent approach.",
        feedback: "Methods are chosen solely for logistical efficiency (e.g., standardised surveys) and ignore local context."
      },
      {
        text: "Partially aligned",
        level: "L2",
        description: "The M&E framework uses some standard methods with limited adaptation to context.",
        feedback: "Methods include qualitative techniques but are still selected and designed primarily by external evaluators."
      },
      {
        text: "Intentionally aligned",
        level: "L3",
        description: "The M&E framework selects methods based on programme goals, context, and stakeholder needs.",
        feedback: "Methods prioritise Cultural Competence and the lived realities of participants, utilising approaches like Culturally Responsive Evaluation (CRE) or local, narrative-based methodologies."
      }
    ]
  },
  {
    id: 14,
    dimensionId: 2,
    section: "Methodological Choice",
    text: "To what extent are culturally appropriate methods used in your evaluations?",
    options: [
      {
        text: "Not at all",
        level: "L1",
        description: "The M&E framework uses standardised methods with little or no cultural adaptation.",
        feedback: "Methods are chosen solely for logistical efficiency (e.g., standardised surveys) and ignore local context."
      },
      {
        text: "Limited",
        level: "L2",
        description: "The M&E framework includes some qualitative or adapted methods, but design remains externally driven.",
        feedback: "Methods include qualitative techniques but are still selected and designed primarily by external evaluators."
      },
      {
        text: "Extensive",
        level: "L3",
        description: "The M&E framework prioritises culturally responsive and locally grounded evaluation methods.",
        feedback: "Methods prioritise Cultural Competence and the lived realities of participants, utilising approaches like Culturally Responsive Evaluation (CRE) or local, narrative-based methodologies."
      }
    ]
  },
  {
    id: 15,
    dimensionId: 2,
    section: "Resource Control",
    text: "Who controls the M&E resources and budget?",
    options: [
      {
        text: "Donor/management only",
        level: "L1",
        description: "The M&E framework is fully controlled by donors or organisational management with no shared decision-making.",
        feedback: "The NGO/CBO and the donor maintain full control over M&E budget, resource allocation, and timeline."
      },
      {
        text: "Shared between organisation and stakeholders",
        level: "L2",
        description: "The M&E framework includes some shared decision-making, including limited community participation in resource use.",
        feedback: "Limited resources are allocated to compensating community members for their time and contribution to data collection."
      },
      {
        text: "Community-inclusive/shared ownership",
        level: "L3",
        description: "The M&E framework shares budget decisions with stakeholders, including resources for participation and capacity building.",
        feedback: "The M&E budget includes significant resources dedicated to community capacity-building and decision-making on research methods and data collection protocols (shared ownership)."
      }
    ]
  },

  // --- DIMENSION 3: DATA ANALYSIS & INTERPRETATION (CULTURAL COMPETENCE) ---
  {
    id: 16,
    dimensionId: 3,
    section: "Data Validation",
    text: "How do you ensure validity and context during data interpretation?",
    options: [
      {
        text: "Not addressed",
        level: "L1",
        description: "The M&E framework does not explicitly consider validity or contextual interpretation.",
        feedback: "Data is interpreted against universal, pre-defined Western success metrics, potentially leading to cultural misinterpretation."
      },
      {
        text: "Inconsistently considered",
        level: "L2",
        description: "The M&E framework considers context during interpretation, but not in a consistent or structured way.",
        feedback: "Contextual factors are mentioned as limitations or background, but do not significantly shape the interpretation of findings."
      },
      {
        text: "Systematically ensured",
        level: "L3",
        description: "The M&E framework systematically ensures validity and context through structured processes and stakeholder engagement.",
        feedback: "Data analysis is grounded in the principle of epistemic humility, where the community is involved in making meaning of the data to ensure interpretations are locally valid and culturally congruent."
      }
    ]
  },
  {
    id: 17,
    dimensionId: 3,
    section: "Data Validation",
    text: "Who is involved in interpreting the data?",
    options: [
      {
        text: "Internal only",
        level: "L1",
        description: "The M&E framework relies solely on internal M&E teams for data interpretation.",
        feedback: "Data is interpreted against universal, pre-defined Western success metrics, potentially leading to cultural misinterpretation."
      },
      {
        text: "Internal + external input",
        level: "L2",
        description: "The M&E framework mainly uses internal teams with limited external input.",
        feedback: "Contextual factors are mentioned as limitations or background, but do not significantly shape the interpretation of findings."
      },
      {
        text: "Mixed participation",
        level: "L3",
        description: "The M&E framework involves internal teams, stakeholders, and/or community members in interpretation.",
        feedback: "Data analysis is grounded in the principle of epistemic humility, where the community is involved in making meaning of the data to ensure interpretations are locally valid and culturally congruent."
      }
    ]
  },
  {
    id: 18,
    dimensionId: 3,
    section: "Data Validation",
    text: "Are findings validated with communities before finalisation?",
    options: [
      {
        text: "No",
        level: "L1",
        description: "The M&E framework does not involve communities in validating findings.",
        feedback: "Data is interpreted against universal, pre-defined Western success metrics, potentially leading to cultural misinterpretation."
      },
      {
        text: "Sometimes",
        level: "L2",
        description: "The M&E framework occasionally validates findings with communities.",
        feedback: "Contextual factors are mentioned as limitations or background, but do not significantly shape the interpretation of findings."
      },
      {
        text: "Yes",
        level: "L3",
        description: "The M&E framework systematically validates findings with communities before finalisation.",
        feedback: "Data analysis is grounded in the principle of epistemic humility, where the community is involved in making meaning of the data to ensure interpretations are locally valid and culturally congruent."
      }
    ]
  },
  {
    id: 19,
    dimensionId: 3,
    section: "Data Validation",
    text: "To what extent does local context influence your interpretation of findings?",
    options: [
      {
        text: "Not at all",
        level: "L1",
        description: "The M&E framework does not integrate local context in interpreting findings.",
        feedback: "Data is interpreted against universal, pre-defined Western success metrics, potentially leading to cultural misinterpretation."
      },
      {
        text: "Moderately",
        level: "L2",
        description: "The M&E framework considers local context but mainly as background information.",
        feedback: "Contextual factors are mentioned as limitations or background, but do not significantly shape the interpretation of findings."
      },
      {
        text: "Strongly",
        level: "L3",
        description: "The M&E framework places strong emphasis on local context in interpreting findings.",
        feedback: "Data analysis is grounded in the principle of epistemic humility, where the community is involved in making meaning of the data to ensure interpretations are locally valid and culturally congruent."
      }
    ]
  },
  {
    id: 20,
    dimensionId: 3,
    section: "Data Ownership",
    text: "What are the protocols for data ownership?",
    options: [
      {
        text: "Not clearly defined",
        level: "L1",
        description: "The M&E framework has unclear or absent data ownership protocols.",
        feedback: "All raw data is owned by the NGO/CBO or donor, and the community has no automatic right to access or use the data."
      },
      {
        text: "Partially defined",
        level: "L2",
        description: "The M&E framework has some data ownership guidelines, but they are inconsistently applied.",
        feedback: "The NGO/CBO shares a final report with the community."
      },
      {
        text: "Clearly defined",
        level: "L3",
        description: "The M&E framework establishes clear and consistent data ownership protocols from the outset.",
        feedback: "Data ownership and access protocols are established before M&E begins, ensuring communities have the right to access, utilise, and even veto the sharing of their own data."
      }
    ]
  },
  {
    id: 21,
    dimensionId: 3,
    section: "Data Ownership",
    text: "Which best describes data ownership in your M&E system?",
    options: [
      {
        text: "Owned solely by organisation/donor",
        level: "L1",
        description: "The M&E framework assigns full ownership of data to the organisation or donor.",
        feedback: "All raw data is owned by the NGO/CBO or donor, and the community has no automatic right to access or use the data."
      },
      {
        text: "Shared access with stakeholders",
        level: "L2",
        description: "The M&E framework shares reports or selected data with stakeholders and communities.",
        feedback: "The NGO/CBO shares a final report with the community."
      },
      {
        text: "Community has defined rights over access and use",
        level: "L3",
        description: "The M&E framework ensures communities have clear rights to access, use, and govern their data.",
        feedback: "Data ownership and access protocols are established before M&E begins, ensuring communities have the right to access, utilise, and even veto the sharing of their own data."
      }
    ]
  },
  {
    id: 22,
    dimensionId: 3,
    section: "Language and Accessibility",
    text: "In what language(s) are M&E findings shared?",
    options: [
      {
        text: "English",
        level: "L1",
        description: "The M&E framework shares findings mainly in the dominant organisational or donor language.",
        feedback: "M&E reporting is conducted exclusively in the dominant language of the donor/NGO, without investment in local-language translation."
      },
      {
        text: "Local languages",
        level: "L2",
        description: "The M&E framework translates key findings into local languages.",
        feedback: "Key findings summaries are translated into local languages."
      },
      {
        text: "Multiple formats (oral, visual, written)",
        level: "L3",
        description: "The M&E framework shares findings using multiple languages and accessible formats (e.g., oral, visual, written).",
        feedback: "All critical M&E documents and feedback loops are proactively produced in locally appropriate languages and formats, recognising diverse literacy levels."
      }
    ]
  },
  {
    id: 23,
    dimensionId: 3,
    section: "Language and Accessibility",
    text: "To what extent are findings made accessible to diverse audiences (e.g., literacy levels, formats)?",
    options: [
      {
        text: "Not at all",
        level: "L1",
        description: "The M&E framework provides findings in limited formats with little consideration for accessibility.",
        feedback: "M&E reporting is conducted exclusively in the dominant language of the donor/NGO, without investment in local-language translation."
      },
      {
        text: "Limited",
        level: "L2",
        description: "The M&E framework provides some translated or simplified summaries for selected audiences.",
        feedback: "Key findings summaries are translated into local languages."
      },
      {
        text: "Extensive",
        level: "L3",
        description: "The M&E framework uses diverse and accessible formats tailored to different audiences and literacy levels.",
        feedback: "All critical M&E documents and feedback loops are proactively produced in locally appropriate languages and formats, recognising diverse literacy levels."
      }
    ]
  },

  // --- DIMENSION 4: USE OF FINDINGS & ACCOUNTABILITY (SYSTEMIC CHANGE) ---
  {
    id: 24,
    dimensionId: 4,
    section: "Reporting and Transparency",
    text: "How does your organisation handle reporting and transparency?",
    options: [
      {
        text: "Limited or unclear reporting",
        level: "L1",
        description: "The M&E framework limits reporting and provides little transparency around findings or decisions.",
        feedback: "The M&E report is circulated primarily to donors and management. Negative findings are often suppressed or softened."
      },
      {
        text: "Reporting with inconsistent transparency",
        level: "L2",
        description: "The M&E framework shares findings, but transparency and accountability are not always consistent.",
        feedback: "Findings are shared with beneficiaries in an accessible format, but the response to uncomfortable truths is reactive."
      },
      {
        text: "Clear, consistent, and transparent",
        level: "L3",
        description: "The M&E framework promotes transparent reporting and openly shares findings, including challenges.",
        feedback: "The organisation demonstrates courage to challenge donor requirements and report uncomfortable truths. A new tool for accountability is used to clearly link findings on inequity to organisational and policy action."
      }
    ]
  },
  {
    id: 25,
    dimensionId: 4,
    section: "Reporting and Transparency",
    text: "Who are M&E findings primarily shared with?",
    options: [
      {
        text: "Limited sharing",
        level: "L1",
        description: "The M&E framework limits findings to internal or donor audiences only.",
        feedback: "The M&E report is circulated primarily to donors and management. Negative findings are often suppressed or softened."
      },
      {
        text: "Selected groups",
        level: "L2",
        description: "The M&E framework shares findings mainly with internal teams, donors, or selected stakeholders.",
        feedback: "Findings are shared with beneficiaries in an accessible format, but the response to uncomfortable truths is reactive."
      },
      {
        text: "Wide range of audiences",
        level: "L3",
        description: "The M&E framework shares findings with internal teams, communities, policymakers, and the public.",
        feedback: "The organisation demonstrates courage to challenge donor requirements and report uncomfortable truths. A new tool for accountability is used to clearly link findings on inequity to organisational and policy action."
      }
    ]
  },
  {
    id: 26,
    dimensionId: 4,
    section: "Reporting and Transparency",
    text: "How does your organisation respond to negative or uncomfortable findings?",
    options: [
      {
        text: "Findings are minimised or not shared",
        level: "L1",
        description: "The M&E framework avoids or downplays uncomfortable findings.",
        feedback: "The M&E report is circulated primarily to donors and management. Negative findings are often suppressed or softened."
      },
      {
        text: "Findings are acknowledged with limited action",
        level: "L2",
        description: "The M&E framework recognises challenges but response actions are inconsistent or limited.",
        feedback: "Findings are shared with beneficiaries in an accessible format, but the response to uncomfortable truths is reactive."
      },
      {
        text: "Findings drive meaningful change",
        level: "L3",
        description: "The M&E framework uses challenging findings to improve programmes, policies, and accountability.",
        feedback: "The organisation demonstrates courage to challenge donor requirements and report uncomfortable truths. A new tool for accountability is used to clearly link findings on inequity to organisational and policy action."
      }
    ]
  },
  {
    id: 27,
    dimensionId: 4,
    section: "Action and Systemic Change",
    text: "What is the ultimate goal of the action taken from the findings?",
    options: [
      {
        text: "No clear goal guiding action",
        level: "L1",
        description: "The M&E framework leads mainly to small operational adjustments.",
        feedback: "Findings lead only to minor operational adjustments within the existing program design."
      },
      {
        text: "Some improvements and decision-making",
        level: "L2",
        description: "The M&E framework informs programme changes but rarely influences institutional or policy reform.",
        feedback: "Findings lead to significant program adjustments but stop short of challenging the NGO/CBO’s own institutional practices or donor policies."
      },
      {
        text: "Meaningful change and decision-making",
        level: "L3",
        description: "The M&E framework uses findings to challenge systemic inequities and influence policy or institutional change.",
        feedback: "Findings are used to actively challenge the root causes of inequity (structural, systemic, and policy barriers) and advocate for change at institutional, policy, and funding levels."
      }
    ]
  },
  {
    id: 28,
    dimensionId: 4,
    section: "Action and Systemic Change",
    text: "To what extent do M&E findings influence organisational or policy-level decisions?",
    options: [
      {
        text: "Not at all",
        level: "L1",
        description: "The M&E framework has little influence on organisational or policy decisions.",
        feedback: "Findings lead only to minor operational adjustments within the existing program design."
      },
      {
        text: "Moderately",
        level: "L2",
        description: "The M&E framework informs some organisational decisions and programme improvements.",
        feedback: "Findings lead to significant program adjustments but stop short of challenging the NGO/CBO’s own institutional practices or donor policies."
      },
      {
        text: "Significantly",
        level: "L3",
        description: "The M&E framework strongly shapes organisational practices and policy decisions.",
        feedback: "Findings are used to actively challenge the root causes of inequity (structural, systemic, and policy barriers) and advocate for change at institutional, policy, and funding levels."
      }
    ]
  },
  {
    id: 29,
    dimensionId: 4,
    section: "Action and Systemic Change",
    text: "Does your organisation use M&E findings to address systemic inequities (e.g., policy advocacy, institutional reform)?",
    options: [
      {
        text: "No",
        level: "L1",
        description: "The M&E framework does not use findings to address systemic inequities.",
        feedback: "Findings lead only to minor operational adjustments within the existing program design."
      },
      {
        text: "Occasionally",
        level: "L2",
        description: "The M&E framework sometimes uses findings to support advocacy or institutional improvements.",
        feedback: "Findings lead to significant program adjustments but stop short of challenging the NGO/CBO’s own institutional practices or donor policies."
      },
      {
        text: "Yes, consistently",
        level: "L3",
        description: "The M&E framework consistently uses findings to influence policy, reform, and systemic equity outcomes.",
        feedback: "Findings are used to actively challenge the root causes of inequity (structural, systemic, and policy barriers) and advocate for change at institutional, policy, and funding levels."
      }
    ]
  },
  {
    id: 30,
    dimensionId: 4,
    section: "Continuous Learning",
    text: "How is continuous learning institutionalised within your organisation?",
    options: [
      {
        text: "Not formalised",
        level: "L1",
        description: "The M&E framework treats learning mainly as a compliance requirement.",
        feedback: "M&E is treated as a one-off requirement for compliance."
      },
      {
        text: "Occasional or partially structured",
        level: "L2",
        description: "The M&E framework supports some internal learning and reflection processes.",
        feedback: "M&E findings are discussed internally, but the learning process is limited to the M&E unit."
      },
      {
        text: "Embedded and ongoing",
        level: "L3",
        description: "The M&E framework integrates continuous learning into organisational decision-making and practice.",
        feedback: "The organisation fosters a culture of learning driven by the M&E findings, promoting epistemic humility and integrating learning into all decision-making cycles, ensuring continuous service to equity."
      }
    ]
  }
];
