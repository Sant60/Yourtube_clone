import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  User,
  Flame,
  Music2,
  Gamepad2,
  Newspaper,
  Trophy,
  Film,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Channeldialogue from "./channeldialogue";
import { useUser } from "@/lib/AuthContext";
import { useRouter } from "next/router";

interface SidebarProps {
  open: boolean;
}

const Sidebar = ({ open }: SidebarProps) => {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const path = router.pathname;

  const mainLinks = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/subscriptions", icon: PlaySquare, label: "Subscriptions" },
  ];

  const userLinks = [
    { href: "/history", icon: History, label: "History" },
    { href: "/liked", icon: ThumbsUp, label: "Liked videos" },
    { href: "/watch-later", icon: Clock, label: "Watch later" },
  ];

  const exploreLinks = [
    { href: "/trending", icon: Flame, label: "Trending" },
    { href: "/music", icon: Music2, label: "Music" },
    { href: "/gaming", icon: Gamepad2, label: "Gaming" },
    { href: "/news", icon: Newspaper, label: "News" },
    { href: "/sports", icon: Trophy, label: "Sports" },
    { href: "/movies", icon: Film, label: "Movies" },
  ];

  if (!open) {
    // Mini sidebar
    return (
      <aside
        style={{
          position: "fixed",
          top: "56px",
          left: 0,
          bottom: 0,
          width: "72px",
          background: "var(--yt-bg)",
          zIndex: 50,
          overflowY: "auto",
          padding: "8px 0",
          transition: "width 0.2s",
        }}
      >
        <nav>
          {mainLinks.map(({ href, icon: Icon, label }) => (
            <Link href={href} key={href} className={`yt-nav-item-mini ${path === href ? "active" : ""}`}>
              <Icon size={22} />
              <span>{label}</span>
            </Link>
          ))}
          {user && (
            <>
              <div className="yt-sidebar-divider" style={{ margin: "8px 8px" }} />
              {userLinks.map(({ href, icon: Icon, label }) => (
                <Link href={href} key={href} className={`yt-nav-item-mini ${path === href ? "active" : ""}`}>
                  <Icon size={22} />
                  <span>{label.split(" ")[0]}</span>
                </Link>
              ))}
              {user?.channelname ? (
                <Link href={`/channel/${user._id}`} className={`yt-nav-item-mini ${path.startsWith("/channel") ? "active" : ""}`}>
                  <User size={22} />
                  <span>Channel</span>
                </Link>
              ) : (
                <button
                  className="yt-nav-item-mini"
                  onClick={() => setIsDialogOpen(true)}
                  style={{ width: "100%", border: "none", background: "none" }}
                >
                  <User size={22} />
                  <span>Create</span>
                </button>
              )}
            </>
          )}
        </nav>
        <Channeldialogue isopen={isDialogOpen} onclose={() => setIsDialogOpen(false)} mode="create" />
      </aside>
    );
  }

  // Full sidebar
  return (
    <aside
      style={{
        position: "fixed",
        top: "56px",
        left: 0,
        bottom: 0,
        width: "240px",
        background: "var(--yt-bg)",
        zIndex: 50,
        overflowY: "auto",
        padding: "8px 12px",
        transition: "width 0.2s",
      }}
    >
      <nav>
        {mainLinks.map(({ href, icon: Icon, label }) => (
          <Link href={href} key={href} className={`yt-nav-item ${path === href ? "active" : ""}`}>
            <Icon size={20} />
            {label}
          </Link>
        ))}

        <div className="yt-sidebar-divider" />

        {user && (
          <>
            <p style={{ fontSize: "14px", fontWeight: 600, padding: "8px 12px 4px", color: "var(--yt-text-primary)" }}>
              You
            </p>
            {userLinks.map(({ href, icon: Icon, label }) => (
              <Link href={href} key={href} className={`yt-nav-item ${path === href ? "active" : ""}`}>
                <Icon size={20} />
                {label}
              </Link>
            ))}
            {user?.channelname ? (
              <Link href={`/channel/${user._id}`} className={`yt-nav-item ${path.startsWith("/channel") ? "active" : ""}`}>
                <User size={20} />
                Your channel
              </Link>
            ) : (
              <button
                className="yt-nav-item"
                onClick={() => setIsDialogOpen(true)}
                style={{ border: "none", background: "none", cursor: "pointer" }}
              >
                <User size={20} />
                Create Channel
              </button>
            )}
            <div className="yt-sidebar-divider" />
          </>
        )}

        <p style={{ fontSize: "14px", fontWeight: 600, padding: "8px 12px 4px", color: "var(--yt-text-primary)" }}>
          Explore
        </p>
        {exploreLinks.map(({ href, icon: Icon, label }) => (
          <Link href={href} key={href} className={`yt-nav-item ${path === href ? "active" : ""}`}>
            <Icon size={20} />
            {label}
          </Link>
        ))}

        <div className="yt-sidebar-divider" />
        <div style={{ padding: "12px", fontSize: "12px", color: "var(--yt-text-secondary)", lineHeight: 1.8 }}>
          <p>About Press Copyright</p>
          <p>Contact us Creators</p>
          <p>Advertise Developers</p>
          <br />
          <p>Terms Privacy Policy & Safety</p>
          <p>How YouTube works</p>
          <p>Test new features</p>
          <br />
          <p>© 2024 YourTube Clone</p>
        </div>
      </nav>

      <Channeldialogue isopen={isDialogOpen} onclose={() => setIsDialogOpen(false)} mode="create" />
    </aside>
  );
};

export default Sidebar;
