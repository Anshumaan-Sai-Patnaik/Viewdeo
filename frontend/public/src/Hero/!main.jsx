import './!main.css'

import AppInfo from "./app-info";
import MeetIllustration from "./meet-illustration";

function Hero({ setAuthMode }) {
  return ( 
    <div className="hero">
      <AppInfo setAuthMode={setAuthMode} />
      <MeetIllustration />
    </div>
   );
}

export default Hero;
