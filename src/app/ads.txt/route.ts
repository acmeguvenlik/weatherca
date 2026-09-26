import { NextResponse } from 'next/server';

export async function GET() {
  const adsTxtContent = `# WeatherCA National Meteorological Network - Authorized Digital Sellers
# Certified IAB / Google AdSense ads.txt specification

google.com, pub-981273918237192, DIRECT, f08c47fec0942fa0
appnexus.com, 14291, RESELLER, bba84830856721b1
rubiconproject.com, 90812, RESELLER, 0bfd66d529a55803
openx.com, 537192841, RESELLER, 6a698e2ec38604c6
pubmatic.com, 159281, RESELLER, 5d62e6307edd348a
magnite.com, 29481, RESELLER, 1b48b7f8e87492c1
`;

  return new NextResponse(adsTxtContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
