import React from 'react';
import '../styles/sections/TopBrands.css';

const TopBrands = () => {
const brands = [
    { id: 1, name: "BASF", logo: "https://logo.clearbit.com/basf.com" },
    { id: 2, name: "Syngenta", logo: "https://logo.clearbit.com/syngenta.com" },
    { id: 3, name: "Bayer", logo: "https://logo.clearbit.com/bayer.com" },
    { id: 4, name: "UPL", logo: "https://logo.clearbit.com/upl-ltd.com" },
    { id: 5, name: "FMC", logo: "https://logo.clearbit.com/fmc.com" },
    { id: 6, name: "Mahindra", logo: "https://logo.clearbit.com/mahindra.com" },
  ];

  return (
    <section className="brands-wrapper">
      <div className="section-header">
        <h2>Top Brands</h2>
        <button className="view-all">View All</button>
      </div>
      <div className="brands-flex">
        {brands.map(brand => (
          <div key={brand.id} className="brand-logo-circle">
            <img src={brand.logo} alt={brand.name} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopBrands;