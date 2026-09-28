import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = (searchParams.get('city') || 'Canada').trim();
    const prov = (searchParams.get('prov') || 'CA').trim().toUpperCase();
    const temp = searchParams.get('temp');
    const cond = searchParams.get('cond') || 'Live Doppler Radar & 14-Day Forecast';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 80px',
            backgroundColor: '#070b14',
            backgroundImage:
              'radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.25) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(147, 51, 234, 0.25) 0%, transparent 40%)',
            fontFamily: 'sans-serif',
            color: '#ffffff',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: '0 0 20px rgba(220, 38, 38, 0.5)',
                }}
              >
                🍁
              </div>
              <span style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Weather<span style={{ color: '#38bdf8' }}>CA</span>
              </span>
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '8px 20px',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '18px',
                fontWeight: 600,
                color: '#94a3b8',
              }}
            >
              Canada Meteorological Network
            </div>
          </div>

          {/* Main Body */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: '22px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: '#38bdf8',
                  fontWeight: 700,
                  marginBottom: '6px',
                }}
              >
                Live Forecast & Radar
              </div>
              <div style={{ fontSize: '72px', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1 }}>
                {city}, {prov}
              </div>
              <div style={{ fontSize: '32px', color: '#cbd5e1', marginTop: '12px', fontWeight: 500 }}>
                {cond}
              </div>
            </div>

            {/* Temperature Bubble or Live Telemetry Badge */}
            {temp ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '24px 44px',
                  borderRadius: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <span style={{ fontSize: '110px', fontWeight: 900, lineHeight: 1 }}>{temp}</span>
                <span style={{ fontSize: '56px', fontWeight: 600, color: '#38bdf8' }}>°C</span>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'rgba(56, 189, 248, 0.1)',
                  padding: '28px 42px',
                  borderRadius: '32px',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                }}
              >
                <span style={{ fontSize: '52px', lineHeight: 1, marginBottom: '6px' }}>🍁</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8' }}>LIVE RADAR</span>
                <span style={{ fontSize: '14px', color: '#94a3b8', marginTop: '2px' }}>Official Forecast</span>
              </div>
            )}
          </div>

          {/* Footer Highlights */}
          <div
            style={{
              display: 'flex',
              gap: '30px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '30px',
              fontSize: '18px',
              color: '#94a3b8',
            }}
          >
            <div>✓ Environment Canada HRDPS Model</div>
            <div>✓ Live Canadian Radar</div>
            <div>✓ Wind Chill & Humidex</div>
            <div>✓ AQHI Air Quality</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400',
        },
      }
    );
  } catch {
    return new Response('Failed to generate image', { status: 500 });
  }
}
