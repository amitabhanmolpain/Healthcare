import styles from './style';
import { About, Doctors, Services, Clients, CTA, Footer, Navbar, Hero, Chatbot } from "./components";

const App = () => (
  <div className="bg-purple-700 w-full overflow-hidden">
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar />
      </div>
    </div>

    <div className={`bg-purple-700 ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
      </div>
    </div>

    <div className={`bg-purple-600 ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <div id="About">
          <About />
        </div>
        <div id="Doctors">
          <Doctors />
        </div>
        <div id="Services">
          <Services />
        </div>
        <div id="Clients">
          <Clients />
        </div>
        <CTA />
        <Footer />
      </div>
    </div>

    {/* floating Chatbot */}
    <Chatbot />
  </div>
);

export default App;