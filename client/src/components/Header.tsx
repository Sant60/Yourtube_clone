import { Bell, Menu, Mic, Search, Upload, User } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Channeldialogue from "./channeldialogue";
import { useRouter } from "next/router";
import { useUser } from "@/lib/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, authReady, logout, handlegooglesignin } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "56px",
        background: "var(--yt-bg)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: "8px",
        borderBottom: "1px solid var(--yt-border)",
      }}
    >
      {/* Left: hamburger + logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
        <button
          className="yt-icon-btn"
          onClick={onMenuClick}
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
          <div style={{ background: "#ff0000", borderRadius: "4px", padding: "2px 4px", display: "flex", alignItems: "center" }}>
            <svg width="22" height="16" viewBox="0 0 24 18" fill="white">
              <path d="M23.5 3.2a3.02 3.02 0 0 0-2.12-2.14C19.4.5 12 .5 12 .5s-7.4 0-9.38.56A3.02 3.02 0 0 0 .5 3.2C0 5.2 0 9 0 9s0 3.8.5 5.8a3.02 3.02 0 0 0 2.12 2.14C4.6 17.5 12 17.5 12 17.5s7.4 0 9.38-.56A3.02 3.02 0 0 0 23.5 14.8C24 12.8 24 9 24 9s0-3.8-.5-5.8zM9.75 12.75V5.25L15.5 9l-5.75 3.75z" />
            </svg>
          </div>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--yt-text-primary)", letterSpacing: "-0.5px" }}>
            YourTube
          </span>
          <span style={{ fontSize: "11px", color: "var(--yt-text-secondary)", marginTop: "2px" }}>IN</span>
        </Link>
      </div>

      {/* Center: search bar */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", maxWidth: "720px", margin: "0 auto" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", width: "100%", maxWidth: "600px" }}>
          <input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="yt-search-input"
            style={searchFocused ? { borderColor: "var(--yt-blue)", boxShadow: "inset 0 1px 2px rgba(0,0,0,.1)" } : {}}
          />
          <button type="submit" className="yt-search-btn" aria-label="Search">
            <Search size={18} />
          </button>
        </form>
        <button className="yt-icon-btn" style={{ marginLeft: "8px" }} aria-label="Search with voice">
          <Mic size={18} />
        </button>
      </div>

      {/* Right: actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
        {!authReady ? (
          <div
            style={{
              width: "80px",
              height: "32px",
              borderRadius: "999px",
              background: "var(--yt-bg-secondary)",
            }}
          />
        ) : user ? (
          <>
            <button className="yt-icon-btn" aria-label="Create">
              <Upload size={20} />
            </button>
            <button className="yt-icon-btn" style={{ position: "relative" }} aria-label="Notifications">
              <Bell size={20} />
              <span className="yt-notif-dot" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "50%",
                    padding: "2px",
                    marginLeft: "4px",
                  }}
                >
                  <Avatar style={{ width: "32px", height: "32px" }}>
                    <AvatarImage src={user.image} />
                    <AvatarFallback style={{ background: "#065fd4", color: "white", fontSize: "14px" }}>
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                style={{
                  background: "var(--yt-surface)",
                  border: "1px solid var(--yt-border)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,.12)",
                  minWidth: "220px",
                  padding: "8px 0",
                }}
                align="end"
              >
                <div style={{ padding: "12px 16px", display: "flex", gap: "12px", alignItems: "center" }}>
                  <Avatar style={{ width: "40px", height: "40px" }}>
                    <AvatarImage src={user.image} />
                    <AvatarFallback style={{ background: "#065fd4", color: "white" }}>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: "14px", color: "var(--yt-text-primary)" }}>{user.name}</p>
                    <p style={{ fontSize: "12px", color: "var(--yt-text-secondary)" }}>{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {user?.channelname ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/channel/${user?._id}`} style={{ color: "var(--yt-text-primary)" }}>Your channel</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                    Create Channel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/history" style={{ color: "var(--yt-text-primary)" }}>History</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/liked" style={{ color: "var(--yt-text-primary)" }}>Liked videos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/watch-later" style={{ color: "var(--yt-text-primary)" }}>Watch later</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} style={{ color: "var(--yt-text-primary)" }}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <button className="yt-signin-btn" onClick={handlegooglesignin}>
            <User size={16} />
            Sign in
          </button>
        )}
      </div>

      <Channeldialogue
        isopen={isDialogOpen}
        onclose={() => setIsDialogOpen(false)}
        mode="create"
      />
    </header>
  );
};

export default Header;
