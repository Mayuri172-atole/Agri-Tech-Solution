import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    // Navbar
    home:"Home", cart:"Cart", wishlist:"Wishlist", login:"Login", logout:"Logout",
    trackOrder:"Track Order", searchPlaceholder:"Search seeds, tools, brands...",
    language:"Language", categories:"Categories", marketplace:"Marketplace",
    // Auth
    createAccount:"Create Account", alreadyHave:"Already have an account?",
    // Products
    addToCart:"Add to Cart", buyNow:"Buy Now", outOfStock:"Out of Stock",
    checkout:"Proceed to Checkout", orderPlaced:"Order Placed Successfully!",
    allProducts:"All Products", brands:"Top Brands", seller:"Seller", dealer:"Dealer", farmer:"Farmer",
    freshProducts:"Fresh From Local Farms 🌽", dealerProducts:"Certified Agri Inputs 🧪",
    // AI
    cropHealth:"Crop Health AI 🔬", chatbot:"AgriBot 🤖", videoHub:"AgriTube 📹",
    detectDisease:"Detect Disease", uploadLeaf:"Upload Leaf Photo",
    analyzing:"Analyzing...", remedy:"Suggested Remedy",
    // Checkout
    payment:"Payment", upi:"UPI", card:"Card / Net Banking", cod:"Cash on Delivery",
    name:"Full Name", address:"Address", city:"City", pincode:"Pincode", phone:"Phone",
    total:"Total", delivery:"Delivery Charge", grandTotal:"Grand Total",
    orderSuccess:"Order Confirmed! 🎉", emailSent:"Confirmation email sent!",
    // Categories
    nursery:"Nursery Crops", seeds:"Seeds", grains:"Grains", vegetables:"Vegetables",
    fruits:"Fruits", pesticides:"Pesticides", fertilizers:"Fertilizers",
    tools:"Tools & Equipment", machinery:"Heavy Machinery",
    // Dashboard
    myOrders:"My Orders", myProfile:"My Profile", inventory:"Inventory",
    addProduct:"Add Product", pendingApproval:"Pending Approval", liveProducts:"Live Products",
    // Home sections
    featuredProducts:"Featured Products", topDeals:"Today's Best Deals",
    shopByCrop:"Shop by Crop", farmerEssentials:"Farmer Essentials",
    biggestDeals:"Biggest Deals", fieldGear:"Field Gear",
    // Supplier
    supplierPortal:"Supplier Portal", farmerListings:"My Farm Listings",
    productInventory:"Product Inventory", addHarvest:"Post Harvest",
    verifiedDealer:"Verified Dealer", pendingVerification:"Pending Verification",
    // Admin
    adminPanel:"Admin Panel", dealerApprovals:"Dealer Approvals",
    productReview:"Product Review", totalUsers:"Total Users",
    // General
    loading:"Loading...", error:"Something went wrong!", noProducts:"No products found",
    viewAll:"View All", backToHome:"Back to Home", deleteConfirm:"Are you sure?",
    save:"Save", cancel:"Cancel", submit:"Submit", update:"Update",
  },
  hi: {
    home:"होम", cart:"कार्ट", wishlist:"विशलिस्ट", login:"लॉगिन", logout:"लॉगआउट",
    trackOrder:"ऑर्डर ट्रैक करें", searchPlaceholder:"बीज, औज़ार, ब्रांड खोजें...",
    language:"भाषा", categories:"श्रेणियाँ", marketplace:"मार्केटप्लेस",
    createAccount:"अकाउंट बनाएं", alreadyHave:"पहले से अकाउंट है?",
    addToCart:"कार्ट में जोड़ें", buyNow:"अभी खरीदें", outOfStock:"स्टॉक में नहीं",
    checkout:"चेकआउट करें", orderPlaced:"ऑर्डर सफलतापूर्वक हो गया!",
    allProducts:"सभी उत्पाद", brands:"टॉप ब्रांड्स", seller:"विक्रेता", dealer:"डीलर", farmer:"किसान",
    freshProducts:"स्थानीय खेतों से ताज़ा 🌽", dealerProducts:"प्रमाणित कृषि सामग्री 🧪",
    cropHealth:"फसल स्वास्थ्य AI 🔬", chatbot:"एग्रीबॉट 🤖", videoHub:"एग्रीट्यूब 📹",
    detectDisease:"बीमारी पहचानें", uploadLeaf:"पत्ते की फोटो अपलोड करें",
    analyzing:"विश्लेषण हो रहा है...", remedy:"सुझाया गया उपाय",
    payment:"भुगतान", upi:"UPI", card:"कार्ड / नेट बैंकिंग", cod:"कैश ऑन डिलीवरी",
    name:"पूरा नाम", address:"पता", city:"शहर", pincode:"पिनकोड", phone:"फ़ोन",
    total:"कुल", delivery:"डिलीवरी शुल्क", grandTotal:"कुल राशि",
    orderSuccess:"ऑर्डर कन्फर्म! 🎉", emailSent:"कन्फर्मेशन ईमेल भेजा गया!",
    nursery:"नर्सरी फसलें", seeds:"बीज", grains:"अनाज", vegetables:"सब्ज़ियाँ",
    fruits:"फल", pesticides:"कीटनाशक", fertilizers:"खाद",
    tools:"औज़ार और उपकरण", machinery:"भारी मशीनरी",
    myOrders:"मेरे ऑर्डर", myProfile:"मेरी प्रोफाइल", inventory:"इन्वेंटरी",
    addProduct:"प्रोडक्ट जोड़ें", pendingApproval:"अनुमोदन बाकी", liveProducts:"लाइव प्रोडक्ट",
    featuredProducts:"विशेष उत्पाद", topDeals:"आज के सबसे अच्छे ऑफर",
    shopByCrop:"फसल के अनुसार खरीदें", farmerEssentials:"किसान ज़रूरी",
    biggestDeals:"बड़े ऑफर", fieldGear:"फील्ड गियर",
    supplierPortal:"सप्लायर पोर्टल", farmerListings:"मेरी फसल लिस्टिंग",
    productInventory:"प्रोडक्ट इन्वेंटरी", addHarvest:"फसल पोस्ट करें",
    verifiedDealer:"सत्यापित डीलर", pendingVerification:"सत्यापन बाकी",
    adminPanel:"एडमिन पैनल", dealerApprovals:"डीलर अनुमोदन",
    productReview:"उत्पाद समीक्षा", totalUsers:"कुल उपयोगकर्ता",
    loading:"लोड हो रहा है...", error:"कुछ गलत हो गया!", noProducts:"कोई उत्पाद नहीं मिला",
    viewAll:"सभी देखें", backToHome:"होम पर जाएं", deleteConfirm:"क्या आप sure हैं?",
    save:"सेव करें", cancel:"रद्द करें", submit:"जमा करें", update:"अपडेट करें",
  },
  mr: {
    home:"मुखपृष्ठ", cart:"कार्ट", wishlist:"विशलिस्ट", login:"लॉगिन", logout:"लॉगआउट",
    trackOrder:"ऑर्डर ट्रॅक करा", searchPlaceholder:"बियाणे, साधने, ब्रँड शोधा...",
    language:"भाषा", categories:"वर्ग", marketplace:"बाजारपेठ",
    createAccount:"अकाउंट बनवा", alreadyHave:"आधीच अकाउंट आहे?",
    addToCart:"कार्टमध्ये जोडा", buyNow:"आत्ता खरेदी करा", outOfStock:"स्टॉक संपला",
    checkout:"चेकआउट करा", orderPlaced:"ऑर्डर यशस्वीरित्या दिला!",
    allProducts:"सर्व उत्पादने", brands:"शीर्ष ब्रँड", seller:"विक्रेता", dealer:"डीलर", farmer:"शेतकरी",
    freshProducts:"स्थानिक शेतातून ताजे 🌽", dealerProducts:"प्रमाणित शेती साहित्य 🧪",
    cropHealth:"पीक आरोग्य AI 🔬", chatbot:"एग्रीबॉट 🤖", videoHub:"एग्रीट्यूब 📹",
    detectDisease:"रोग ओळखा", uploadLeaf:"पानाचा फोटो अपलोड करा",
    analyzing:"विश्लेषण होत आहे...", remedy:"सुचवलेला उपाय",
    payment:"पेमेंट", upi:"UPI", card:"कार्ड / नेट बँकिंग", cod:"रोख वितरण",
    name:"पूर्ण नाव", address:"पत्ता", city:"शहर", pincode:"पिनकोड", phone:"फोन",
    total:"एकूण", delivery:"डिलिव्हरी शुल्क", grandTotal:"एकूण रक्कम",
    orderSuccess:"ऑर्डर कन्फर्म! 🎉", emailSent:"पुष्टी ईमेल पाठवला!",
    nursery:"नर्सरी पिके", seeds:"बियाणे", grains:"धान्य", vegetables:"भाज्या",
    fruits:"फळे", pesticides:"कीटकनाशके", fertilizers:"खते",
    tools:"साधने आणि उपकरणे", machinery:"जड यंत्रसामग्री",
    myOrders:"माझे ऑर्डर", myProfile:"माझी प्रोफाइल", inventory:"यादी",
    addProduct:"उत्पादन जोडा", pendingApproval:"मंजुरी प्रतीक्षेत", liveProducts:"लाइव्ह उत्पादने",
    featuredProducts:"विशेष उत्पादने", topDeals:"आजचे सर्वोत्तम सौदे",
    shopByCrop:"पिकानुसार खरेदी करा", farmerEssentials:"शेतकरी अत्यावश्यक",
    biggestDeals:"मोठे सौदे", fieldGear:"फील्ड गियर",
    supplierPortal:"पुरवठादार पोर्टल", farmerListings:"माझ्या शेत लिस्टिंग",
    productInventory:"उत्पादन यादी", addHarvest:"कापणी पोस्ट करा",
    verifiedDealer:"सत्यापित डीलर", pendingVerification:"सत्यापन प्रतीक्षेत",
    adminPanel:"एडमिन पॅनेल", dealerApprovals:"डीलर मंजुरी",
    productReview:"उत्पादन पुनरावलोकन", totalUsers:"एकूण वापरकर्ते",
    loading:"लोड होत आहे...", error:"काहीतरी चुकले!", noProducts:"कोणतेही उत्पादन सापडले नाही",
    viewAll:"सर्व पाहा", backToHome:"मुखपृष्ठावर जा", deleteConfirm:"तुम्हाला खात्री आहे का?",
    save:"जतन करा", cancel:"रद्द करा", submit:"सबमिट करा", update:"अपडेट करा",
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('agritech_lang') || 'en');

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('agritech_lang', l);
  };

  const t = (key) => translations[lang]?.[key] || translations['en']?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
};

export default LanguageContext;
