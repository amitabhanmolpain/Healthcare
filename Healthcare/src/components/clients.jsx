import { clients } from "../constants";
import styles from "../style";

const Clients = () => (
  <section className={`${styles.flexCenter} my-4`}>
    <div className={`${styles.flexCenter} w-full overflow-hidden`}>
      <div className="clients-slider animate-slide flex">
        {clients.map((client) => (
          <div
            key={client.id}
            className={`flex-1 ${styles.flexCenter} sm:min-w-[192px] min-w-[120px] mx-4`}
          >
            <img
              src={client.logo}
              alt="client"
              className="sm:w-[192px] w-[100px] object-contain"
            />
          </div>
        ))}
        {/* Duplicate clients for seamless looping */}
        {clients.map((client) => (
          <div
            key={`${client.id}-duplicate`}
            className={`flex-1 ${styles.flexCenter} sm:min-w-[192px] min-w-[120px] mx-4`}
          >
            <img
              src={client.logo}
              alt="client"
              className="sm:w-[192px] w-[100px] object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Clients;