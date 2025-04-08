import React, { useEffect, useState } from 'react'

import LandingPage from './LandingPage';
import IntroducePage from './IntroducePage';

function LandingWithIntro() {
  const [showIntroPage, setShowIntroPage] = useState(false);

  const handleLandingComplete = () => {
    setShowIntroPage(true)
  }

  return showIntroPage ? (
    <IntroducePage />
  ) : (
    <LandingPage onLoadingComplete={handleLandingComplete} />
  )
};

export default LandingWithIntro