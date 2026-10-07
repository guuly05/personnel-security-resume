import { ImageResponse } from '@vercel/og';
import { projectOgCardForSlug } from '../src/seo/metadata.ts';

export const config = { runtime: 'nodejs' };

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const card = projectOgCardForSlug(url.searchParams.get('slug') ?? '');
  if (!card) return new Response('Project not found', { status: 404 });

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '64px',
        color: '#111713',
        backgroundColor: '#f7f8f5',
        border: '1px solid #d6ded7',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '10px', background: card.accent }} />
        <div style={{ position: 'absolute', right: '-90px', top: '80px', width: '420px', height: '420px', border: `1px solid ${card.accent}33`, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: '20px', top: '140px', width: '330px', height: '330px', border: `1px solid ${card.accent}22`, borderRadius: '50%' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', border: `2px solid ${card.accent}`, color: card.accent, fontSize: '22px', fontWeight: 800 }}>GM</div>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '16px' }}>
              <span style={{ fontSize: '19px', fontWeight: 700 }}>Guuleed Maxmuud Aw Abdi</span>
              <span style={{ marginTop: '4px', color: card.accent, fontSize: '11px', letterSpacing: '1.4px', textTransform: 'uppercase' }}>Full-Stack Developer · Cybersecurity · DevOps</span>
            </div>
          </div>
          <span style={{ border: `1px solid ${card.accent}66`, padding: '9px 14px', color: card.accent, fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Project case study</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '900px', marginTop: '34px' }}>
          <span style={{ color: card.accent, fontSize: '14px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>{card.type}</span>
          <h1 style={{ margin: '22px 0 0', fontSize: card.title.length > 35 ? '50px' : '62px', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05 }}>{card.title}</h1>
          <p style={{ display: '-webkit-box', overflow: 'hidden', margin: '20px 0 0', color: '#536158', fontSize: '21px', lineHeight: 1.45, WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{card.description}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #d6ded7', paddingTop: '24px', color: '#536158', fontSize: '16px' }}>
          <span>Role, architecture, decisions, and evidence</span>
          <span style={{ color: card.accent, fontWeight: 700 }}>guuleedmaxamuud.dev</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
