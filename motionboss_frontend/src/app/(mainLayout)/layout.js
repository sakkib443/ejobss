import Footer from '@/components/sheard/Footer';
import Navbar from '@/components/sheard/Navbar';
import TopHeader from '@/components/sheard/TopHeader';
import ScrollToTop from '@/components/sheard/ScrollToTop';
import FloatingSeminarButton from '@/components/sheard/FloatingSeminarButton';
import FloatingLanguageButton from '@/components/sheard/FloatingLanguageButton';
import React from 'react';

const mainLayout = ({ children }) => {
    return (
        <div>
            <TopHeader />
            <Navbar />
            {children}
            <Footer />
            <ScrollToTop />
            <FloatingSeminarButton />
            <FloatingLanguageButton />
        </div>
    );
};

export default mainLayout;