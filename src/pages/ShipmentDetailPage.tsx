import { Link, useParams } from 'react-router-dom';

/**
 * Demo shipment detail route — opened from the ShipmentPanel showcase when a row is clicked.
 * Row clicks navigate here; they do not expand or collapse the panel.
 */
export function ShipmentDetailPage() {
  const { shipmentId } = useParams();
  const id = shipmentId ?? '';

  return (
    <div style={{
      minHeight:       '100vh',
      padding:         '40px 48px',
      fontFamily:      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      background:      'linear-gradient(160deg, var(--accent-gradient-start) 0%, var(--accent-gradient-end) 100%)',
    }}>
      <nav style={{ marginBottom: 24 }}>
        <Link
          to="/showcase"
          style={{
            color:          'var(--accent-primary)',
            fontWeight:    600,
            fontSize:      14,
            textDecoration: 'none',
          }}
        >
          ← Component showcase
        </Link>
      </nav>
      <h1 style={{ color: 'var(--text-primary)', fontSize: 26, fontWeight: 700, margin: '0 0 8px' }}>
        Shipment details
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: '0 0 16px', lineHeight: 1.5 }}>
        <code style={{
          fontSize:     14,
          padding:      '2px 8px',
          borderRadius: 6,
          background:   'var(--surface-card)',
          border:       '1px solid var(--border-default)',
        }}>{id}</code>
        {' '}— placeholder detail view. In the app, the list panel stays collapsed/expanded based only on the header control.
      </p>
    </div>
  );
}

export default ShipmentDetailPage;
