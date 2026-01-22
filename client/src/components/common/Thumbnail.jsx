import React from "react";

// Reusable thumbnail component that tries multiple image candidates (attraction, state, unsplash)
const sanitize = (s) => (s || "").toString().trim().replace(/[\s,()\/\\]+/g, "_").replace(/[^A-Za-z0-9_\-]/g, "");

const buildCandidates = (providedSrc, title) => {
    const list = [];
    if (providedSrc) list.push(providedSrc);
    const parts = (title || "").split(/→|—|-/).map(p => p.trim()).filter(Boolean);
    const primary = parts[0] || "";
    const secondary = parts[1] || "";

    if (primary && secondary) {
        const key = `${sanitize(primary)}_${sanitize(secondary)}`;
        list.push(`/attraction-images/${key}.svg`);
        list.push(`/attraction-images/${key}.png`);
        list.push(`/attraction-images/${key}.jpg`);
    }

    if (primary) {
        list.push(`/state-images/${sanitize(primary)}.svg`);
        list.push(`/state-images/${sanitize(primary)}.png`);
    }

    // fallback to unsplash search using attraction or state
    const query = encodeURIComponent(secondary || primary || "india");
    list.push(`https://source.unsplash.com/160x120/?${query}`);

    return list;
};

const Thumbnail = ({ src, title, className = "" }) => {
    const [idx, setIdx] = React.useState(0);
    const [failedAll, setFailedAll] = React.useState(false);

    const candidates = React.useMemo(() => buildCandidates(src, title), [src, title]);

    React.useEffect(() => {
        setIdx(0);
        setFailedAll(false);
    }, [src, title]);

    const initials = React.useMemo(() => {
        if (!title) return "TR";
        return title
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();
    }, [title]);

    if (failedAll) {
        return (
            <div
                className={`thumb-placeholder ${className}`.trim()}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'linear-gradient(135deg,#eef2ff,#f8fafc)' }}
            >
                {initials}
            </div>
        );
    }

    return (
        <img
                src={candidates[idx]}
                alt={title}
                className={className}
                onError={() => {
                    if (idx + 1 < candidates.length) setIdx((i) => i + 1);
                    else setFailedAll(true);
                }}
                onLoad={() => { /* loaded successfully */ }}
                style={{ height: 'auto', maxWidth: '100%', objectFit: 'cover', borderRadius: 8, display: 'block' }}
            />
    );
};

export default Thumbnail;
