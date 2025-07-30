export default function Loader() {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
        <div className="pulse-ring-loader">
          <div className="ring" />
          <div className="ring ring2" />
          <div className="ring ring3" />
        </div>
  
        <style jsx>{`
          .pulse-ring-loader {
            position: relative;
            width: 80px;
            height: 80px;
          }
  
          .ring {
            position: absolute;
            top: 0;
            left: 0;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 4px solid rgba(134, 239, 172, 0.4); /* pastel green with reduced opacity */
            animation: pulse 1.8s infinite ease-in-out;
          }
  
          .ring2 {
            animation-delay: 0.4s;
          }
  
          .ring3 {
            animation-delay: 0.8s;
          }
  
          @keyframes pulse {
            0% {
              transform: scale(0.6);
              opacity: 1;
            }
            100% {
              transform: scale(1.8);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }
  