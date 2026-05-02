import React from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import Categories from '../sections/Categories';
import DealsSection from '../sections/DealsSection';
import BiggestDeals from '../sections/BiggestDeals';
import FarmerEssentials from '../sections/FarmerEssentials';
import TopBrands from '../sections/TopBrands';
import ModernEquipment from '../sections/ModernEquipment';
import TraditionalTools from '../sections/TraditionalTools';
import FieldGear from '../sections/FieldGear';
import Accessories from '../sections/Accessories';
import ShopByCrop from '../sections/ShopByCrop';
import { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';
import DealerMarketplace from '../sections/DealerMarketplace';

import '../styles/main.css';

const Home = () => {
  return (
    <div className="home-container">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      
      <main className="main-content-wrapper">
        {/* SECTION 1: Awareness (Banner & Fast Access) */}
        <Carousel />
        <Categories /> {/* 👈 Wahi bade circles wala jo humne banaya */}

        {/* SECTION 2: Urgency (Deals) */}
        <DealsSection />

        {/* SECTION 3: Social & Local (Fresh Harvest) */}
        <div className="section-spacer">
          <DealerMarketplace 
            type="fresh" 
            title="Fresh From Local Farms 🌽" 
            subtitle="Directly from farmers: Fresh Vegetables, Fruits & Grains"
          />
        </div>

        {/* SECTION 4: High Trust (Certified Essentials) */}
        <DealerMarketplace 
          type="licensed" 
          category="Pesticide"
          title="Certified Agri-Essentials 🧪" 
          subtitle="Quality fertilizers and seeds from verified dealers"
        />

        {/* SECTION 5: Big Promotion (Banner) */}
        <BiggestDeals />

        {/* SECTION 6: Specialized Selection (Shop By Crop) */}
        <ShopByCrop />

        {/* SECTION 7: Technology & Machinery */}
        <ModernEquipment />
        <DealerMarketplace 
          type="licensed" 
          category="Seeds" 
          title="High-Yielding Seeds 🌾" 
          subtitle="Boost your farm productivity with premium seeds"
        />

        {/* SECTION 8: Essentials & Tools (Grid Style) */}
        <div className="essentials-bg">
          <FarmerEssentials />
          <TraditionalTools />
        </div>

        {/* SECTION 9: Branding & Gear */}
        <TopBrands /> 
        <FieldGear />
        
        {/* SECTION 10: Accessories (Last Call for Spares) */}
        <Accessories />
      </main>

      <Footer />
    </div>
  );
};

export default Home;