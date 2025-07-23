import {
  User,
  Mail,
  Phone,
  Globe,
  Pencil,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";

const getFlagEmoji = (country) => {
  const code = country
    .toUpperCase()
    .replace(/ /g, "")
    .replace(/[^A-Z]/g, "")
    .slice(0, 2);
  return code.replace(/./g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt())
  );
};

export const ProfileCard = ({ user }) => (
  <div className="flex flex-col md:flex-row bg-white dark:bg-zinc-900 border dark:border-zinc-700 shadow rounded-lg p-6 items-center justify-between gap-6">
    <div className="flex items-center gap-6">
      <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center text-4xl">
        {user.profilePicUrl?.startsWith("https") ? (
          <img src={user.profilePicUrl} alt="profile" className="w-full h-full object-cover" />
        ) : (
          <span>{"👨‍💻"}</span>
        )}
      </div>
      <div>
        <h2 className="text-3xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
          <User size={20} /> {user.username}
        </h2>
        <p className="text-sm flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
          <Mail size={14} /> {user.email}
        </p>
        {user.country && (
            <p className="text-sm flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
              <Globe size={14} /> {user.country} {getFlagEmoji(user.country)}
            </p>
        )}
        {user.mobileNumber && (
          <p className="text-sm flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
            <Phone size={14} /> {user.mobileNumber}
          </p>
        )}
        {user.linkedIn && (
          <a
            href={user.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 transition"
          >
            <Linkedin size={20} />
          </a>
        )}
      </div>
    </div>
    <Link
      to={`/${user.username}/update`}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
    >
      <Pencil size={16} /> Edit Profile
    </Link>
  </div>
);