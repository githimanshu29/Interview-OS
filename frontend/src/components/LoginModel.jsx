// import { signInWithPopup } from "firebase/auth";
// import axios from "axios";
// import { auth, provider } from "../utils/firebase";
import { FcGoogle } from "react-icons/fc";
import { FiX } from "react-icons/fi";
// import { BiBrain } from "react-icons/bi";
// import { SiKaios } from "react-icons/si";
// import api from "../utils/axios";

export function LoginModel({ onClose, setUser }) {
  //   const handleGoogleLogin = async () => {
  //     try {
  //       const result = await signInWithPopup(auth, provider);
  //       const token = await result.user.getIdToken();
  //       const response = await api.post("/api/auth/login", { token });
  //       setUser(response.data.user);
  //       onClose();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  return (
    <div
      className="
      fixed inset-0 z-50
      flex items-center justify-center
      bg-black/40 backdrop-blur-md
      px-4
    "
    >
      <div
        className="
        relative w-full max-w-sm
        bg-[#0A0A0A]/80 backdrop-blur-2xl
        border border-white/10
        rounded-2xl
        overflow-hidden
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]
      "
      >
        {/* glass sheen */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />

        {/* Header */}
        <div className="relative p-7">
          <button
            onClick={onClose}
            className="
              absolute top-4 right-4
              text-white/30 hover:text-white
              transition-colors
            "
          >
            <FiX size={16} />
          </button>

          <h2
            className="
            text-lg
            font-bold
            text-center
            mb-2
            text-white
          "
          >
            Sign in to{" "}
            <span className="font-extrabold text-lg tracking-tight text-white">
              Interview-OS
            </span>
          </h2>

          <p
            className="
            text-white/45
            text-center
            text-xs
          "
          >
            Continue your AI interview journey
          </p>

          {/* Google */}
          <div className="mt-7">
            <button
              //   onClick={handleGoogleLogin}
              className="
                w-full
                flex items-center justify-center gap-3
                py-3
                rounded-xl
                border border-white/15
                bg-white/10 backdrop-blur-md
                hover:border-white/25
                hover:bg-white/[0.14]
                shadow-inner
                transition-all
              "
            >
              <FcGoogle size={18} />
              <span className="text-white font-medium text-sm">
                Continue with Google
              </span>
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="
          relative
          border-t border-white/10
          bg-black/30
          p-4
          text-center
        "
        >
          <p className="text-white/30 text-xs">
            Secure authentication powered by Firebase
          </p>
        </div>
      </div>
    </div>
  );
}
