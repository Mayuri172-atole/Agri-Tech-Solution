import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { HiCheckCircle } from 'react-icons/hi';

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. INSTANT SOUND: Jaise hi page load hoga, awaaz bajegi
    // Maine link thoda fast wala rakha hai taaki instant feel aaye
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    
    // Play sound immediately
    audio.play().catch(err => {
      console.log("Interaction check: Bidu, user ne Checkout button dabaya hai, toh ye bajega hi bajega!");
    });

    // 2. Redirect to Track Order (4 seconds is perfect for celebration)
    const timer = setTimeout(() => {
      navigate('/track-order');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fff' }}>
      {/* Instant Celebration */}
      <Confetti recycle={false} numberOfPieces={600} gravity={0.2} />
      
      {/* Big Animated Tick - Instant Pop */}
      <div style={{ animation: 'bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
        <HiCheckCircle size={180} color="#2e7d32" />
      </div>

      <h1 style={{ fontSize: '32px', color: '#1a1a1a', marginTop: '20px' }}>Order Placed!</h1>
      <p style={{ color: '#666', fontSize: '18px' }}>Your payment was successful and order is confirmed.</p>
      
      <p style={{ marginTop: '40px', color: '#999', fontSize: '14px' }}>Redirecting to tracking page...</p>

      {/* Inline Animation Style - NO CHANGE HERE */}
      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;