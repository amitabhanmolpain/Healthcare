import React from 'react';
import { doctors } from '../constants';

const Doctors = () => (
  <section className="py-10">
    <h1 className="flex-1 font-poppins font-semibold ss:text-[62px] text-[42px] text-white ss:leading-[100px] leading-[75px] text-center">
      Our <span className="text-gradient">Doctors</span>{" "}
    </h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center max-w-6xl mx-auto">
      {doctors.map(doctor => (
        <div 
          key={doctor.id}
          className="bg-dimWhite hover:black-gradient p-2 rounded-lg w-64 flex flex-col items-center text-center"
        >
          <img 
            src={doctor.img}
            alt={doctor.name}
            className="w-auto h-60 mb-6 object-contain"
          />
          <h3 className="text-black text-xl font-semibold">{doctor.name}</h3>
          <p className="text-dimBlack">{doctor.specialty}</p>
          <button 
            className="mt-4 bg-green-gradient text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300"
          >
            Consult Now
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default Doctors;