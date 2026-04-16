interface PlaceholderPageProps {
  section: string;
  page: string;
}

export function PlaceholderPage({ section, page }: PlaceholderPageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 280,
        padding: '40px 24px',
        gap: 20,
        textAlign: 'center',
      }}
    >
      {/* Placeholder icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          backgroundColor: 'var(--accent-wash-6)',
          border: '1.5px dashed var(--accent-wash-30)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" fill="var(--accent-primary)" opacity="0.25" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" fill="var(--accent-primary)" opacity="0.45" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" fill="var(--accent-primary)" opacity="0.45" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" fill="var(--accent-primary)" opacity="0.25" />
        </svg>
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h2
          style={{
            margin: 0,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 700,
            fontSize: 18,
            color: 'var(--text-primary)',
          }}
        >
          {page}
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}
        >
          {section} · {page}
        </p>
      </div>

      {/* Placeholder badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          backgroundColor: '#fff7ed',
          border: '1px solid #fed7aa',
          borderRadius: 100,
          padding: '3px 10px',
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#f97316',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 11,
            fontWeight: 600,
            color: '#c2410c',
            letterSpacing: '0.3px',
          }}
        >
          Placeholder
        </span>
      </div>

      {/* Skeleton lines */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginTop: 4,
        }}
      >
        {[100, 84, 92, 68].map((w, i) => (
          <div
            key={i}
            style={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'var(--border-default)',
              opacity: 0.5,
              width: `${w}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default PlaceholderPage;
