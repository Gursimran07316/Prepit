import { DotLottieReact } from "@lottiefiles/dotlottie-react/webgpu"
import { Link } from "react-router"

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] px-6 text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
        Ace your next<br />
        <span className="text-blue-500">technical interview</span>
      </h1>

       <div className="w-64 h-64 md:w-80 md:h-80 mb-4">
        <DotLottieReact
          src="https://lottie.host/34003d73-ec14-4e79-82d8-8ef37d197f36/WbKVHatcPA.lottie"
          loop
          autoplay
        />
      </div>
      
      <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
        PrepIt gives you AI-powered mock interviews tailored to real job postings.
        Practice, improve, and land the role.
      </p>
      <Link
        to="/register"
        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base px-8 py-3 rounded-lg transition-colors"
      >
        Get started — it's free
      </Link>
    </div>
  )
}

export default Home
