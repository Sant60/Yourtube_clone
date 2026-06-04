import SearchResult from "@/components/SearchResult";
import { useRouter } from "next/router";

const SearchPage = () => {
  const router = useRouter();
  const q = Array.isArray(router.query.q) ? router.query.q[0] : (router.query.q ?? "");

  return (
    <div style={{ padding: "16px 24px", maxWidth: "1200px" }}>
      {q && (
        <p style={{ fontSize: "14px", color: "var(--yt-text-secondary)", marginBottom: "4px" }}>
          Search results for &quot;{q}&quot;
        </p>
      )}
      <SearchResult query={q} />
    </div>
  );
};

export default SearchPage;
