import { Project, Category, Certification, ProfileDetails, EducationItem, ExperienceItem, AchievementItem } from "./types";

export const initialProfile: ProfileDetails = {
  name: "Prashant Prakash Patil",
  email: "prashantpatil4524@gmail.com",
  phone: "+91-9322852227",
  location: "Sangli, Maharashtra, India - 416419",
  bio: "Full-Stack Developer and M.C.A. Student at Lovely Professional University. Experienced in building ML pipelines, web applications, and data-driven systems.",
  longBio: "I am a high-performance Full-Stack Developer and Data Science specialist currently pursuing my Master of Computer Applications at Lovely Professional University (LPU). Driven by the nexus of algorithmic complexity and human-centered design, I craft scalable systems that process real-world data and provide actionable business intelligence. With deep focus on React/Next, FastAPI, PyTorch, and containerized Docker pipelines, I bring raw technical execution to every layer of the architecture.",
  github: "https://github.com/prashantpatil4524",
  linkedin: "https://www.linkedin.com/in/prashantpatil4524",
  twitter: "https://twitter.com/prashant_p_4524",
  leetcode: "https://leetcode.com/prashantpatil4524",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVZ0xcBJsgUoB2TpB2yVaJ8rzAUSgcj9ugD0sE_-nohH7TZKntf5JrKzClYsvWBH93RfnIJP5RAmrAnOy8qjiWO6EzUZo998ylK8qgPNaWD9RxR3hzIOsZ8F8Jt19eNKeMnsmDVBByTMraOcn_3lVQiEz6eToXl2h6KC7A28bvn3xqWgACr9kK94i6yGK8wQPzlkpMGsS_cDijqt32QlI7A7DwPCsargxxvHg9moJks6uemeReIbZlAa6rJiFBydjfz05mDRy1WBB8"
};

export const initialCategories: Category[] = [
  { id: "all", name: "All" },
  { id: "web", name: "Web Apps" },
  { id: "ml", name: "Data Science & ML" },
  { id: "cv", name: "Computer Vision" },
  { id: "cyber", name: "Open Source" },
];

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "DeepFake Detection System",
    subtitle: "Enterprise-grade real-time deepfake classification pipeline",
    description: "Built a production-ready, full-stack deepfake detection system capable of identifying whether a video or image is real or AI-generated, featuring an AUC of ~0.96.",
    longDescription: "Architected and engineered a comprehensive, state-of-the-art DeepFake Detection System to safeguard content integrity. The architecture uses EfficientNet-B4 for fine-grained spatial feature extraction and Long Short-Term Memory (LSTM) networks for sequential/temporal frame correlation analysis. Includes frame extraction powered by OpenCV, face detection using Multi-task Cascaded Convolutional Networks (MTCNN), a custom React.js frontend interface with secure Firebase authentication, and a scalable FastAPI backend serving inference models inside Docker containers in under 2 seconds.",
    category: "cv",
    date: "Feb - Apr 2026",
    tags: ["Python", "PyTorch", "FastAPI", "React.js", "OpenCV", "EfficientNet-B4", "LSTM", "MTCNN", "Docker", "Firebase"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAxsruh3QWeb2XQZC_8Vma2E6kuwi9GdUu3cx2Iqz3jVppTZw163lE7b5V4EdtZS3qMCFV8rVRIUTWsQfZpMM0S3dtFcUn-UhQJJlyY-ieiYclZbFfgiP9-S-OQJFj3tlvsfZsHld0q8X4BUpNuYrtwyS6YjzsiBxeE07GOfQxEyd8S0Kq_cAPHw_HQtIuQ5AeCG55qTGZr9xgWMZjaz3_b8gTwzjbaN7aKWgMNUOfXo50PG9vDzUVxaRWhbAdwwYGLOyv_UiNY8jo",
    version: "v2.4.0",
    isPublic: true,
    teamSize: "5",
    projectLink: "https://github.com/prashantpatil4524",
  },
  {
    id: "proj-2",
    title: "Agri Sense Crop Prediction",
    subtitle: "Web-based crop recommendations via localized soil analysis",
    description: "An intelligent crop prediction system analyzing complex soil report parameters and environmental inputs to provide high-accuracy, data-driven agricultural guidance.",
    longDescription: "Engineered Agri Sense, a web-based decision system integrated with an optimized Machine Learning catalog. By processing biochemical soil parameters (pH, Nitrogen, Phosphorus, Potassium levels) and atmospheric variables, the system determines the best-fit crops for specialized cultivation, promoting higher yields. Completed as a Scopus-indexed research paper accepted at the 14th International Conference (ICRCET-2025), Bangalore, organized by IFERP Academy.",
    category: "ml",
    date: "Jan - May 2025",
    tags: ["Python", "Flask", "Machine Learning", "HTML/CSS", "Pandas", "Scikit-Learn", "Matplotlib", "Seaborn"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZrbK4SYfhRSFsyh9ugm2czKUkNKdDzz1n3TdbpmA7s_8Qf_MmHWvVT5A1TlHMauqa854h7S1SRpj9WYy2wPpe0ijG1YEEyykXavrwp_IE0Iuapm1TcAn_FftOJfYbgbJV85at-9karWTgpBPKZJvYGCizzzm9ubZEtFoP1AJ3umi0Ns8L5W1EoEd_qlDiPXfkP0ODvRk9uIHQs5Jr10sUxTV9nyQrN84n5O3xwG_pxn1oZKLo9EtLENdrU8hHfcOdAh3Z1cwajyE8",
    version: "v1.1.2",
    isPublic: true,
    teamSize: "1 (Solo)",
    projectLink: "https://github.com/prashantpatil4524",
  },
  {
    id: "proj-3",
    title: "Music Genre Recommender",
    subtitle: "Audio feature extraction and Spotify classification engine",
    description: "A machine learning pipeline and Streamlit dashboard that extracts acoustic metadata to classify genres and deliver curated, personalized song recommendations.",
    longDescription: "Developed an end-to-end Machine Learning pipeline trained on Spotify's extensive audio intelligence datasets. The product extracts audio features (such as acousticness, energy, danceability, tempo, and valence) to dynamically categorize tracks into genre families and optimize distance-based user recommendation systems. Deployed on a streamlined Streamlit application providing real-time vector visualisations.",
    category: "ml",
    date: "Oct - Dec 2024",
    tags: ["Python", "Streamlit", "Spotify Dataset", "Scikit-Learn", "Pandas", "NumPy", "Matplotlib", "K-Means"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhc5xUhfkIMCexUvQykMwoxIAufbNtf_YfGM-yTMkdpaDQT6TNFiVNxdjSOZNh3lOn7vz2Feb_3R_p1qm4uuiuULqHm04XSsDKIDb6EmJ7DAbRXdlyvLILhevYZsT4tAaWaWteKe5SHtabenqWDy9GcPQJeM7LjbAG-tkQFK-VzHNoARu07Ahs6vzJi4r1oE04KrcIxnAQFbwAwyfNiDu-7GHTae9qeCk93qe-ZCW90-QjDxSJ814tc4TZdjjQQBeYrfn1XEgVvk0x",
    version: "v1.0.0",
    isPublic: true,
    teamSize: "1",
    projectLink: "https://github.com/prashantpatil4524/Song-Genre-Recommendation-and-Visualizations/tree/main/Documents/MCA/sem2",
  },
  {
    id: "proj-4",
    title: "Mumbai Property Predictor",
    subtitle: "Real estate regression pricing and data visualizations",
    description: "Machine learning regression systems developed during internship to evaluate property parameters and estimate fair market listing prices in urban real estate markets.",
    longDescription: "Built and evaluated multiple linear regression, decision tree, and random forest predictive algorithms to assess real estate inventory in Mumbai. Performed extensive exploratory data analysis (EDA), anomaly removal, and descriptive visualizations using Matplotlib/Seaborn inside Jupyter Notebook pipelines, preparing clean stakeholder-ready slide decks presenting insights.",
    category: "ml",
    date: "Jun - Aug 2024",
    tags: ["Python", "Pandas", "NumPy", "Scikit-Learn", "Jupyter Notebook", "Linear Regression", "Seaborn"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4kfxnwhPXH52E9Wb4OA_xC4f7--H7g2JQXvfXDCU1f6faKVaR1ZW8_UpG6BqTz7YNteCe4e3jL3kJQjgZYfVDVco_A0s_xgEW4QOBy7g-2iLLrcWTsoPRp8wxx9_1Nz-Z4NHOICY0g3b33I8J5aIh3-UjzZO5-uwXmj0txvDQU4o3J287OBD2nmNrbpLDMu9ILONSCk3KY9uuaLj5yJ4J4l10sUSmANqml7SAvrzqYrEsqzIFyAcQL2PO4q0nYHC3Revp0nsE853y",
    version: "v0.9.5",
    isPublic: true,
    teamSize: "1",
    projectLink: "https://github.com/prashantpatil4524",
  },
  {
    id: "proj-5",
    title: "SQL Injection Guard",
    subtitle: "Visual testing and security playground for parameter leaks",
    description: "An educational sandbox demonstrating SQL parameter leakage behaviors and defense frameworks including prepared statements and parameterized inputs.",
    longDescription: "Created during security certification programs to highlight database vulnerabilities. Serves as a local web playground rendering visual mock database query logs. Educators and testers can toggle vulnerability toggles on/off to interactively preview query escaping mechanics in Real Time.",
    category: "cyber",
    date: "Jun - Jul 2024",
    tags: ["SQL", "HTML/CSS", "JavaScript", "Security Audit", "Prepared Statements"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS3Tn3BRmU_oSe522DjLxwOU-nJ_70y9M8T-OkbFJaBWwrskXN4bzw78vEtvinblC8A0z5j73nI9h_cnDvsOp87v2vvRoF71k-qvdYOfXMfBm0r_riXjcdg4N_l0tUdpFi6MusgWJk0n6jGW6uYeDm449Ra2sw7FzCOOt1QzSmDqjrHWUCC5GR7sCbU9CpQufld15wSNcNd7j8fI3o4_1-WIBzuT1eomHEyUOj_iOTEZ4txso4BFVXzhw0GR2RbJFGWqX31vx5Rauw",
    version: "v1.0.1",
    isPublic: false,
    teamSize: "1",
    projectLink: "https://github.com/prashantpatil4524",
  },
];

export const initialEducation: EducationItem[] = [
  {
    id: "edu-1",
    institution: "Lovely Professional University",
    degree: "Master of Computer Applications (M.C.A.)",
    date: "2025 - 2027",
    grade: "TGPA: 7.08 / 10",
  },
  {
    id: "edu-2",
    institution: "Lovely Professional University",
    degree: "Bachelor of Computer Applications (B.C.A.)",
    date: "2022 - 2025",
    grade: "CGPA: 7.22 / 10",
  },
  {
    id: "edu-3",
    institution: "Willingdon College, Sangli",
    degree: "Higher Secondary (12th Science) MSBSHSE",
    date: "2020 - 2022",
    grade: "Percentage: 50.67% / 100",
  },
  {
    id: "edu-4",
    institution: "J. M. K. Highschool, Borgaon",
    degree: "Secondary School Certificate (10th) MSBSHSE",
    date: "2019 - 2020",
    grade: "Percentage: 93.40% / 100",
  },
];

export const initialCertifications: Certification[] = [
  {
    id: "cert-1",
    title: "SQL Injection for Beginners",
    issuer: "Simplilearn",
    date: "Jun 2024 - Jul 2024",
    proofLink: "",
  },
  {
    id: "cert-2",
    title: "Big Data Hadoop and Spark Developer Training",
    issuer: "Simplilearn",
    date: "Mar 2024",
    proofLink: "",
  },
  {
    id: "cert-3",
    title: "Hone Communication and Public Speaking Skills",
    issuer: "Skill Development, Lovely Professional University",
    date: "Feb 2026 - Mar 2026",
    proofLink: "",
  },
];

export const initialAchievements: AchievementItem[] = [
  {
    id: "ach-1",
    title: "Coding Ninjas Tech Blitz 2025 Hackathon",
    details: "Runner-Up in a 24-hour engineering sprint held at LPU showcasing custom Web App development integrated with AI models."
  },
  {
    id: "ach-2",
    title: "LeetCode 50 Days Badge 2026",
    details: "Solved 72 coding problems (51 Easy, 17 Medium, 4 Hard) with over 150 submissions and 15 days active streak."
  },
  {
    id: "ach-3",
    title: "Scopus-Indexed Crop Research",
    details: "Research paper on 'Agri Sense: Intelligent Crop Prediction through Soil Analysis' accepted at 14th International Conference on Recent Challenges in Engineering & Technology (ICRCET-2025), Bangalore."
  }
];

export const initialExperiences: ExperienceItem[] = [
  {
    id: "exp-1",
    company: "Maxgen Technologies Pvt. Ltd.",
    role: "Data Science & Machine Learning Intern",
    period: "Jun 2024 - Aug 2024",
    bullets: [
      "Cleaned and preprocessed Mumbai real estate datasets using Pandas and NumPy, applying feature engineering to support accurate model development and analysis.",
      "Built and compared machine learning models using Scikit-Learn Linear Regression, Decision Tree, and Random Forest evaluating accuracy parameters.",
      "Visualized real estate market trends, price distributions, and localized parameters inside Jupyter Notebook panels using Matplotlib and Seaborn.",
      "Analyzed predictions to formulate actionable crop/property recommendations presented in structured stakeholder-ready reports."
    ]
  }
];
