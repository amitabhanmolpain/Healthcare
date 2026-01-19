import {  facebook, instagram, linkedin, twitter, airbnb, binance, coinbase, dropbox, testtube,inject,medicine,doctorlg} from "../assets";
import { doctor2,doctor3,doctor1,doctor4,doctor5,doctor6,doctor7,doctor8,doctor9,doctor10,doctor11,doctor12 } from "../assets";
import { insurance, helpline,appointments,chatbot,healthrecord,meddeli } from "../assets";


export const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "About",
    title: "About",
  },
  {
    id: "Doctors",
    title: "Doctors",
  },
  {
    id: "Services",
    title: "Services",
  },
];

export const features = [
  {
    id: "feature-1",
    icon: testtube,
    title: "Online Lab Test Booking",
    content: "Schedule diagnostic tests with home sample collection.",
  },
  {
    id: "feature-2",
    icon: inject,
    title: "AI Symptom Checker",
    content: "Get preliminary assessments before consulting a doctor.",
  },
  {
    id: "feature-3",
    icon: doctorlg,
    title: "24/7 Access to Healthcare",
    content: "Book appointments and consult doctors anytime, anywhere.",
  },
  {
    id: "feature-4",
    icon: medicine,
    title: "Affordable & Transparent Pricing",
    content: "Compare consultation fees and service costs before booking.",
  },
];


export const doctors = [
  {
    id: "doctor-1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    img: doctor3,
    
  },
  {
    id: "doctor-2",
    name: "Dr. Micheal Lee",
    specialty: "Neurologist",
    img: doctor2,
    
  },
  {
    id: "doctor-3",
    name: "Dr. James Patel",
    specialty: "Pediatrician",
    img: doctor1,
    
  },
  {
    id: "doctor-4",
    name: "Dr. Sophia Patel ",
    specialty: "Neurologist",
    img: doctor4,
    
  },
  {
    id: "doctor-5",
    name: "Dr. Ethan Reynolds",
    specialty: "Cardiologist",
    img: doctor5,
    
  },
  {
    id: "doctor-6",
    name: "Dr. Olivia Kim ",
    specialty: "Pulmonologist",
    img: doctor6,
    
  },
  {
    id: "doctor-7",
    name: "Dr. Ava Thompson ",
    specialty: "Pediatrician",
    img: doctor7,
    
  },
  {
    id: "doctor-8",
    name: "Dr. Mason Gupta",
    specialty: "Orthopedic Surgeon",
    img: doctor8,
    
  },
  {
    id: "doctor-9",
    name: "Dr. James Nguyen",
    specialty: "Psychiatrist",
    img: doctor9,
    
  },
  {
    id: "doctor-10",
    name: "Dr. Benjamin Carter",
    specialty: "Gastroenterologist",
    img: doctor10,
    
  },
  {
    id: "doctor-11",
    name: "Dr. Charlotte Lee",
    specialty: "Ophthalmologist",
    img: doctor11,
    
  },
  {
    id: "doctor-12",
    name: "Dr. Noah Martinez",
    specialty: " Obstetrician & Gynecologist",
    img: doctor12,
    
  },
];


export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Content",
        link: "https://www.hoobank.com/content/",
      },
      {
        name: "How it Works",
        link: "https://www.hoobank.com/how-it-works/",
      },
      {
        name: "Create",
        link: "https://www.hoobank.com/create/",
      },
      {
        name: "Explore",
        link: "https://www.hoobank.com/explore/",
      },
      {
        name: "Terms & Services",
        link: "https://www.hoobank.com/terms-and-services/",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "https://www.hoobank.com/help-center/",
      },
      {
        name: "Partners",
        link: "https://www.hoobank.com/partners/",
      },
      {
        name: "Suggestions",
        link: "https://www.hoobank.com/suggestions/",
      },
      {
        name: "Blog",
        link: "https://www.hoobank.com/blog/",
      },
      {
        name: "Newsletters",
        link: "https://www.hoobank.com/newsletters/",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partner",
        link: "https://www.hoobank.com/our-partner/",
      },
      {
        name: "Become a Partner",
        link: "https://www.hoobank.com/become-a-partner/",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "https://www.twitter.com/",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/",
  },
];

export const clients = [
  {
    id: "client-1",
    logo: airbnb,
  },
  {
    id: "client-2",
    logo: binance,
  },
  {
    id: "client-3",
    logo: coinbase,
  },
  {
    id: "client-4",
    logo: dropbox,
  },
];  

export const services = [
  {
     id: 'service1', 
     
     title: 'Health Record Management', 
     content: 'Store, access, and share your medical history securely in one place.',
     icon:  healthrecord },
  { 
    id: 'service2',
     
     title: 'Specialist Appointment Booking', 
     content: 'Book appointments with top specialists in various fields with ease.', 
     icon: appointments
    },
     {
     id: 'service3',
     title: 'Medicine Delivery', 
     content: 'Order prescription and over-the-counter medicines with fast home delivery.',
     icon: meddeli
     },
     {
      id: 'service4',
     title: 'Health Insurance Assistance', 
     content: 'Compare plans and get help with insurance claims and coverage.',
     icon: insurance
     },
     {
      id: 'service5',
     title: 'Gamified Mental Health', 
     content: 'Cure depression, anxiety, PTSD, and hopelessness through engaging therapeutic games.' ,
     icon: chatbot
    },
    {
      id: 'service6',
     title: '24/7 Helpline', 
     content: 'Access emergency medical support and advice anytime, day or night.',
     icon: helpline
    },

  // Add more services as needed
];