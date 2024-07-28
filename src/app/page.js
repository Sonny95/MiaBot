import { SocialIcon } from "react-social-icons";
import Chatbox from "./components/Chatbox";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-200">Mia Son</p>
          <p className="text-lg font-medium text-gray-400">Junior Software Engineer</p>
          <p className="text-sm text-gray-500">Sydney, AUSTRALIA</p>
          <p className="text-sm text-gray-500">miajson95@gmail.com</p>
        </div>
        <Chatbox />
        <div className="flex space-x-4">
          <SocialIcon url="https://github.com/Sonny95" style={{ height: 40, width: 40 }} />
          <SocialIcon
            url="https://www.linkedin.com/in/mia-son-a1a0612b7/"
            style={{ height: 40, width: 40 }}
          />
          <SocialIcon url="https://medium.com/@miajson95" style={{ height: 40, width: 40 }} />
        </div>
      </div>
    </main>
  );
}
