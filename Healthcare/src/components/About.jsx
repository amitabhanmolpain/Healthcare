import { features } from '../constants';
import styles, { layout } from '../style';
import Button from './Button';

const FeatureCard = ({ icon, title,content,index }) => (
  <div className={`flex flex-row p-6 rounded-[20px] ${index !== features.length -1 ? "mb-6":"mb-0"} feature-card`}>
   <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`}>
    <img src={icon} alt="icon" className="w-[50%] h-[50%] object-contain"/>
   </div>
   <div className="flex-1 flex flex-col ml-3">
    <h4 className="font-poppins font-semibold text-white  text-[18px] leading-[23px] mb-1">
      {title}
    </h4>
    <p className="font-poppins font-normal  text-dimWhite  text-[16px] leading-[24px] mb-1">
      {content}
    </p>
   </div>
  </div>
)


const About = () => {
  return (
    <section id="features" className={layout.section}>
      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>About Us<br className="sm:block hidden" /> <span className="text-gradient">Transforming Healthcare</span></h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        In today's fast-paced world, access to quality healthcare should be simple, seamless, and stress-free. Our platform is revolutionizing the way healthcare is delivered by leveraging technology to connect patients with trusted medical professionals, AI-driven diagnostics, and on-demand services—all from the comfort of their homes.

        From 24/7 virtual consultations to AI-powered symptom checkers, we are making healthcare more accessible, 
        affordable, and efficient. Our commitment is to empower individuals with the right tools and information, ensuring personalized care, secure medical records, and hassle-free appointments.
        Join us in reshaping the future of healthcare—because everyone deserves quality care anytime, anywhere.</p>

          <Button styles="mt-10"/>
      </div>

      <div className={`${layout.sectionImg} flex-col`}>
        {features.map((feature,index) => (
          <FeatureCard  key={feature.id} {...feature} index={index} />
        ))}
      </div>
    </section>
  )
}

export default About
